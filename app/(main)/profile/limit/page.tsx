"use client";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";

const TABS = ["계약결제 한도", "B2B구매대행 구매한도"] as const;
type Tab = (typeof TABS)[number];

const LIMITS: Record<Tab, { label: string; value: number }[]> = {
  "계약결제 한도": [
    { label: "일 승인한도", value: 10_000_000 },
    { label: "월 승인한도", value: 50_000_000 },
  ],
  "B2B구매대행 구매한도": [
    { label: "일 구매한도", value: 5_000_000 },
    { label: "월 구매한도", value: 50_000_000 },
  ],
};

export default function LimitPage() {
  const [tab, setTab] = useState<Tab>("계약결제 한도");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PageHeader title="결제승인한도" back />

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === t
                ? "text-[var(--dd-green)] border-b-2 border-[var(--dd-green)]"
                : "text-gray-400"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="px-4 py-6 flex flex-col gap-4">
        {LIMITS[tab].map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1.5">
            <span className="text-sm text-gray-500">{label}</span>
            <div className="h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-between px-3">
              <span className="text-[15px] font-bold text-gray-900">
                {value.toLocaleString()}
              </span>
              <span className="text-sm text-gray-400">원</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
