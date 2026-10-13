"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { useI18n } from "@/components/providers/i18n";
import { usePrivacyConsent } from "@/components/privacy";

import {
  GA4_READY_EVENT,
  isGa4Ready,
} from "@/lib/analytics";

import { useAnalytics } from "./AnalyticsProvider";

export function AnalyticsPageTracker() {
  const pathname = usePathname();
  const { locale } = useI18n();
  const { consent } = usePrivacyConsent();
  const { track } = useAnalytics();

  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (consent.analytics !== "granted") {
      lastTrackedPath.current = null;
      return;
    }

    const trackPage = () => {
      if (
        !isGa4Ready() ||
        pathname === lastTrackedPath.current
      ) {
        return;
      }

      if (pathname === "/") {
        track("landing_view", { locale });
        lastTrackedPath.current = pathname;
      } else if (pathname === "/calculator") {
        track("calculator_open", { locale });
        lastTrackedPath.current = pathname;
      }
    };

    window.addEventListener(GA4_READY_EVENT, trackPage);

    trackPage();

    return () => {
      window.removeEventListener(
        GA4_READY_EVENT,
        trackPage
      );
    };
  }, [pathname, locale, consent.analytics, track]);

  return null;
}