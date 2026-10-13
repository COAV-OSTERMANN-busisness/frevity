"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import type { OperationalMetricName } from "@/types/metrics";

export function OperationalPageTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (pathname === lastTrackedPath.current) {
      return;
    }

    let event: OperationalMetricName;

    if (pathname === "/") {
      event = "landing_view";
    } else if (pathname === "/calculator") {
      event = "calculator_open";
    } else {
      return;
    }

    lastTrackedPath.current = pathname;

    void fetch("/api/metrics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event }),
      keepalive: true,
    }).catch(() => {
      // Metrics must not interrupt application navigation.
    });
  }, [pathname]);

  return null;
}