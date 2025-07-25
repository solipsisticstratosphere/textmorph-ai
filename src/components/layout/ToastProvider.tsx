"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#fff",
          color: "#363636",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "0.5rem",
          padding: "0.75rem 1rem",
        },
        success: {
          style: {
            border: "1px solid #e6f7f0",
            background: "linear-gradient(to right, #f0fdf9, #ecfdf5)",
          },
          iconTheme: {
            primary: "#10b981",
            secondary: "#ffffff",
          },
        },
        error: {
          style: {
            border: "1px solid #fee2e2",
            background: "linear-gradient(to right, #fef2f2, #fff1f2)",
          },
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}
