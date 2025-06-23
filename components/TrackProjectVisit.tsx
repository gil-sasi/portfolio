"use client";

import { useEffect, useRef } from "react";

interface TrackProjectVisitProps {
  projectId: string;
  projectName: string;
}

export default function TrackProjectVisit({
  projectId,
  projectName,
}: TrackProjectVisitProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only track once per session for this project
    if (hasTracked.current) return;

    // Skip tracking in development mode (TEMPORARILY DISABLED FOR TESTING)
    // if (process.env.NODE_ENV === "development") {
    //   console.log(
    //     `Skipping project visit tracking in development mode: ${projectName}`
    //   );
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

    // Track the project visit with a slight delay to ensure page is loaded
    setTimeout(() => {
      if (!hasTracked.current) {
        hasTracked.current = true;

        fetch("/api/track-project-visit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId,
            projectName,
            timestamp: Date.now(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            screen: {
              width: window.screen.width,
              height: window.screen.height,
            },
          }),
        }).catch((err) => {
          // Silently fail - don't block user experience
          console.debug("Project visit tracking failed:", err);
        });
      }
    }, 1500); // Slightly longer delay than general tracking
  }, [projectId, projectName]);

  return null; // nothing to render
}
