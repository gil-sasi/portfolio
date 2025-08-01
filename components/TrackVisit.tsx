"use client";

import { useEffect, useRef } from "react";

export default function TrackVisit() {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only track once per session
    if (hasTracked.current) return;

    // Skip tracking in development mode (TEMPORARILY DISABLED FOR DEBUGGING)
    // if (process.env.NODE_ENV === "development") {
    //   console.log("Skipping visitor tracking in development mode");
    //   return;
    // }

    // Skip if running in iframe (embedded content)
    if (window !== window.top) {
      return;
    }

    // Skip if user agent looks automated (client-side check)
    const userAgent = navigator.userAgent;
    if (!userAgent || userAgent.length < 20) {
      return;
    }

    // Check for obvious bot patterns
    if (/bot|crawl|spider|scraper|headless/i.test(userAgent)) {
      return;
    }

    // Skip if no interaction capability (likely automated)
    if (
      !window.screen ||
      window.screen.width === 0 ||
      window.screen.height === 0
    ) {
      return;
    }

    // Track the visit with a slight delay to ensure page is loaded
    setTimeout(() => {
      if (!hasTracked.current) {
        hasTracked.current = true;

        fetch("/api/track-visitor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // Add some client-side context
          body: JSON.stringify({
            timestamp: Date.now(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            screen: {
              width: window.screen.width,
              height: window.screen.height,
            },
          }),
        }).catch((err) => {
          // Silently fail - don't block user experience
          console.debug("Visitor tracking failed:", err);
        });
      }
    }, 1000);
  }, []);

  return null; // nothing to render
}
