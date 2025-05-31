"use client";

import { useEffect } from "react";

export default function TrackVisit() {
  useEffect(() => {
    fetch("/api/track-visitor", { method: "POST" });
  }, []);

  return null; // nothing to render
}
