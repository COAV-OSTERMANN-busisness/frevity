import "server-only";

import {
  FieldValue,
  Timestamp,
} from "firebase-admin/firestore";

import { getAdminFirestore } from "@/lib/firebase";

import type {
  MetricCounter,
  MetricIncrement,
  MetricsRepository,
  OperationalMetricName,
} from "@/types/metrics";

const COLLECTION_NAME = "metric_counters";

function getDocumentId(
  event: OperationalMetricName,
  date: string
): string {
  return `${date}_${event}`;
}

export const firestoreMetricsRepository: MetricsRepository = {
  async increment(input: MetricIncrement): Promise<void> {
    const firestore = getAdminFirestore();

    const documentId = getDocumentId(input.event, input.date);

    await firestore
      .collection(COLLECTION_NAME)
      .doc(documentId)
      .set(
        {
          event: input.event,
          date: input.date,
          count: FieldValue.increment(1),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
  },

  async getCounter(
    event: OperationalMetricName,
    date: string
  ): Promise<MetricCounter | null> {
    const firestore = getAdminFirestore();

    const documentId = getDocumentId(event, date);

    const snapshot = await firestore
      .collection(COLLECTION_NAME)
      .doc(documentId)
      .get();

    if (!snapshot.exists) {
      return null;
    }

    const data = snapshot.data();

    if (!data) {
      return null;
    }

    const updatedAt = data.updatedAt;

    if (
      typeof data.count !== "number" ||
      !(updatedAt instanceof Timestamp)
    ) {
      throw new Error("Invalid metric counter document.");
    }

    return {
      event,
      date,
      count: data.count,
      updatedAt: updatedAt.toDate(),
    };
  },
};