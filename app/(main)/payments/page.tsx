"use client";
import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { mockPayments, formatAmount } from "@/lib/mock-data";
import { Calendar } from "lucide-react";

const TABS = ["전체", "계약결제", "B2B도매몰", "식자재몰"] as const;
type Tab = (typeof TABS)[number];

function getDateString(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split("T")[0];
}

export default function PaymentsPage() {
  const [from, setFrom] = useState(getDateString(-31));
  const [to, setTo] = useState(getDateString());
  const [tab, setTab] = useState<Tab>("전체");

  const completedCount = mockPayments.filter((p) => p.cardStatus === "결제완료").length;
  const completedTotal = mockPayments
    .filter((p) => p.cardStatus === "결제완료")
    .reduce((s, p) => s + p.totalAmount, 0);
  const transferCount = mockPayments.filter((p) => p.transferStatus === "송금완료").length;
  const transferTotal = mockPayments
    .filter((p) => p.transferStatus === "송금완료")
    .reduce((s, p) => s + p.transferAmount, 0);

  // tab 필터 (B2B, 식재재는 현재 mock 데이터 없음 → 빈 목록)
  const filtered = tab === "전체" || tab === "계약결제" ? mockPayments : [];

  return (
    <div className="flex flex-col">
      <PageHeader title="구매내역" back />

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-xs font-medium transition-colors ${
              tab === t
                ? "text-[var(--dd-green)] border-b-2 border-[var(--dd-green)]"
                : "text-gray-400"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Date range */}
      <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-100">
        <div className="flex items-center gap-1 flex-1 h-9 rounded-lg border border-gray-200 px-2 bg-white">
          <Calendar size={13} className="text-gray-400 shrink-0" />
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="flex-1 text-xs text-gray-700 bg-transparent outline-none" />
        </div>
        <span className="text-gray-400">~</span>
        <div className="flex items-center gap-1 flex-1 h-9 rounded-lg border border-gray-200 px-2 bg-white">
          <Calendar size={13} className="text-gray-400 shrink-0" />
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="flex-1 text-xs text-gray-700 bg-transparent outline-none" />
        </div>
        <button onClick={() => { setFrom(getDateString()); setTo(getDateString()); }} className="h-9 px-2.5 rounded-lg border border-gray-200 text-xs text-gray-600">당일</button>
        <button onClick={() => { setFrom(getDateString(-7)); setTo(getDateString()); }} className="h-9 px-2.5 rounded-lg border border-gray-200 text-xs text-gray-600">일주일</button>
      </div>

      {/* Stats */}
      <div className="px-4 py-3 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">결제완료</span>
            <span className="text-sm font-bold text-[var(--dd-orange)]">{completedCount}건</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">총 결제금액</span>
            <span className="text-sm font-bold">{formatAmount(completedTotal)}</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">송금완료</span>
            <span className="text-sm font-bold text-[var(--dd-green)]">{transferCount}건</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">총 송금금액</span>
            <span className="text-sm font-bold">{formatAmount(transferTotal)}</span>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3 px-4 pb-4">
        {filtered.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-12">결제내역이 없습니다.</p>
        )}
        {filtered.map((payment) => (
          <div key={payment.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">{payment.date}</span>
              <Link href={`/payments/${payment.id}`} className="flex items-center gap-0.5 text-xs text-gray-500">
                상세 ›
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-semibold text-gray-900">{payment.contractName}</span>
              <span className={`text-[15px] font-bold ${payment.cardStatus === "결제실패" ? "line-through text-gray-400" : ""}`}>
                {formatAmount(payment.totalAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-gray-500">
                <span className="font-medium">결제정보</span>
                {payment.cardStatus && (
                  <span className="ml-2"><StatusBadge status={payment.cardStatus} /></span>
                )}
              </div>
              <span className="text-xs text-gray-400">{payment.paymentMethod}</span>
            </div>
            {payment.cardName && (
              <div className="mt-1 text-xs text-gray-400">결제카드: {payment.cardName}</div>
            )}
            {payment.transferStatus && (
              <div className="mt-1 text-xs text-gray-400">
                송금상태: <StatusBadge status={payment.transferStatus} className="text-xs" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
