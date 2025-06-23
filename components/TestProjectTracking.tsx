"use client";

import { useState, useEffect } from "react";

interface TestProjectTrackingProps {
  projectId: string;
  projectName: string;
}

export default function TestProjectTracking({
  projectId,
  projectName,
}: TestProjectTrackingProps) {
  const [trackingStatus, setTrackingStatus] = useState<
    "pending" | "success" | "error"
  >("pending");
  const [responseData, setResponseData] = useState<Record<
    string,
    unknown
  > | null>(null);

  useEffect(() => {
    // Test the tracking by sending a manual request
    const testTracking = async () => {
      try {
        const response = await fetch("/api/track-project-visit", {
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
              width: window.screen?.width || 0,
              height: window.screen?.height || 0,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setResponseData(data);
          setTrackingStatus("success");
        } else {
          setTrackingStatus("error");
          setResponseData({ error: `HTTP ${response.status}` });
        }
      } catch (error) {
        setTrackingStatus("error");
        setResponseData({
          error: error instanceof Error ? error.message : String(error),
        });
      }
    };

    testTracking();
  }, [projectId, projectName]);

  // Only show in development mode
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg border border-gray-600 max-w-sm z-50">
      <h4 className="font-bold text-sm mb-2">🧪 Project Tracking Test</h4>
      <div className="text-xs space-y-1">
        <div>
          <strong>Project:</strong> {projectName}
        </div>
        <div>
          <strong>ID:</strong> {projectId}
        </div>
        <div className="flex items-center gap-2">
          <strong>Status:</strong>
          {trackingStatus === "pending" && (
            <span className="text-yellow-400">⏳ Tracking...</span>
          )}
          {trackingStatus === "success" && (
            <span className="text-green-400">✅ Success</span>
          )}
          {trackingStatus === "error" && (
            <span className="text-red-400">❌ Error</span>
          )}
        </div>

        {responseData && (
          <div className="mt-2 p-2 bg-gray-700 rounded text-xs">
            <div>
              <strong>Response:</strong>
            </div>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(responseData, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-2 text-xs text-gray-400">
          💡 Visit admin panel → Project Analytics to see results
        </div>
      </div>
    </div>
  );
}
