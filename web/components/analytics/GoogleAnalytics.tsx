"use client";

import { useEffect } from "react";
import Script from "next/script";

import { usePrivacyConsent } from "@/components/privacy";
import {
  getGa4MeasurementId,
  setGa4Ready,
} from "@/lib/analytics";

function removeAnalyticsCookies(): void {
  const hostname = window.location.hostname;
  const parts = hostname.split(".");

  const domains: Array<string | undefined> = [undefined];

  for (let index = 0; index < parts.length - 1; index++) {
    domains.push(parts.slice(index).join("."));
  }

  for (const entry of document.cookie.split(";")) {
    const name = entry.split("=")[0]?.trim();

    if (
      !name ||
      (name !== "_ga" && !name.startsWith("_ga_"))
    ) {
      continue;
    }

    for (const domain of domains) {
      document.cookie =
        `${name}=; Max-Age=0; Path=/; SameSite=Lax` +
        (domain ? `; Domain=${domain}` : "");
    }
  }
}

export function GoogleAnalytics() {
  const { consent } = usePrivacyConsent();
  const measurementId = getGa4MeasurementId();
  const allowed = consent.analytics === "granted";

  useEffect(() => {
    if (!measurementId) {
      return;
    }

    const disabledKey: `ga-disable-${string}` =
      `ga-disable-${measurementId}`;

    window[disabledKey] = !allowed;

    if (!allowed) {
      setGa4Ready(false);
      removeAnalyticsCookies();
    }

    if (window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: allowed ? "granted" : "denied",
      });

      if (allowed) {
        window.gtag("config", measurementId, {
          send_page_view: false,
        });

        setGa4Ready(true);
      }
    }
  }, [allowed, measurementId]);

  if (!measurementId || !allowed) {
    return null;
  }

  return (
    <>
      <Script
        id="frevity-ga4-bootstrap"
        strategy="afterInteractive"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function() {
            window.dataLayer.push(arguments);
          };
          window.gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
          });
          window.gtag('js', new Date());
        `}
      </Script>

      <Script
        id="frevity-ga4-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
        onReady={() => {
          if (!window.gtag) {
            return;
          }

          const disabledKey: `ga-disable-${string}` =
            `ga-disable-${measurementId}`;

          if (window[disabledKey]) {
            return;
          }

          window.gtag("consent", "update", {
            analytics_storage: "granted",
          });

          window.gtag("config", measurementId, {
            send_page_view: false,
          });

          setGa4Ready(true);
        }}
      />
    </>
  );
}