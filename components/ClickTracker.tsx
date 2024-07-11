"use client";
import useWindowClickTracker from "@/hooks/useWindowClickTracker";
import React, { useEffect } from "react";
interface Props {
  data: Record<string, any>;
  testCookies: any;
}

function setCookie(name: string, value?: string, days?: number) {
  if (!value || typeof document === "undefined") return;
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

const WindowClickTrackerComponent: React.FC<Props> = ({
  data,
  testCookies,
}): React.ReactElement => {
  const { totalClicks, uniqueClicks } = useWindowClickTracker({ data });
  useEffect(() => {
    if (testCookies) setCookie(testCookies?.name, testCookies?.value);
  }, [testCookies]);
  return (
    <div>
      <h1>Click anywhere in the window to track clicks</h1>
      <p>Total Clicks: {totalClicks}</p>
      <p>Unique Clicks: {uniqueClicks}</p>
    </div>
  );
};

export default WindowClickTrackerComponent;
