"use client";
import { useEffect, useRef } from "react";
import { visitorService } from "@/services/visitor";

export default function VisitorTracker() {
  const tracked = useRef(false);

  useEffect(() => {
    // Pastikan hanya track sekali per page load
    if (tracked.current) return;
    tracked.current = true;

    // Track visitor via API
    visitorService.trackVisitor();
  }, []);

  return null;
}
