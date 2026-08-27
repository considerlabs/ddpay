"use client";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";

export default function PushPage() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PageHeader title="푸시 알림" back />

      <div className="px-5 py-5">
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <span className="text-[15px] text-gray-900">계약 관련 알림</span>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
              enabled ? "bg-[var(--dd-green)]" : "bg-gray-200"
            }`}
          >
            <span
              className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
                enabled ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          • 계약 승인이나 반려 또는 결제 관련 알림을 받습니다.
        </p>
      </div>
    </div>
  );
}
