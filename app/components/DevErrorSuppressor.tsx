"use client";
import { useEffect } from "react";

export default function DevErrorSuppressor() {
  useEffect(() => {
    const handler = (e: PromiseRejectionEvent) => {
      if (e.reason?.code === -32603) e.preventDefault();
    };
    window.addEventListener("unhandledrejection", handler);
    return () => window.removeEventListener("unhandledrejection", handler);
  }, []);
  return null;
}
