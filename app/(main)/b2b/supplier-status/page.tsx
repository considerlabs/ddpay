"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Calendar, ChevronDown } from "lucide-react";
import { MOCK_SUPPLIERS, SupplierStatus } from "@/lib/mock-suppliers";

const STATUS_COLORS: Record<SupplierStatus, string> = {
  승인대기: "bg-gray-200 text-gray-600",
  승인완료: "bg-green-100 text-green-700",
  승인반려: "bg-red-100 text-red-600",
  사용정지: "bg-orange-100 text-orange-600",
  계약해지: "bg-blue-100 text-blue-600",
};

const ALL_STATUSES: SupplierStatus[] = ["승인대기", "승인완료", "승인반려", "사용정지", "계약해지"];

export default function SupplierStatusPage() {
  const router = useRouter();
  const [from, setFrom] = useState("2025-09-01");
  const [to, setTo] = useState("2025-09-30");
  const [statusFilter, setStatusFilter] = useState("전체");

  const filtered = MOCK_SUPPLIERS.filter((s) =>
    statusFilter === "전체" ? true : s.approvalStatus === statusFilter
  );

  return (
    <div className="flex flex-col">
      <PageHeader title="B2B구매대행 공급자 승인현황" back />

      {/* Date + filter */}
      <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-100">
        <div className="flex items-center gap-1 flex-1 h-9 rounded-lg border border-gray-200 px-2 bg-white">
          <Calendar size={13} className="text-gray-400 shrink-0" />
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="flex-1 text-xs text-gray-700 bg-transparent outline-none"
          />
        </div>
        <span className="text-gray-400 text-xs">~</span>
        <div className="flex items-center gap-1 flex-1 h-9 rounded-lg border border-gray-200 px-2 bg-white">
          <Calendar size={13} className="text-gray-400 shrink-0" />
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="flex-1 text-xs text-gray-700 bg-transparent outline-none"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 pl-2.5 pr-6 rounded-lg border border-gray-200 text-xs text-gray-600 bg-white appearance-none"
          >
            <option value="전체">승인 상태</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3 px-4 py-4">
        {filtered.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-12">승인현황이 없습니다.</p>
        )}
        {filtered.map((supplier) => (
          <div key={supplier.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-gray-800">{supplier.regNo}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[supplier.approvalStatus]}`}>
                {supplier.approvalStatus}
              </span>
            </div>
            <p className="text-xs text-gray-600">공급자명 : {supplier.name}</p>
            <p className="text-xs text-gray-400">등록일시 : {supplier.registeredAt}</p>
            {supplier.approvalStatus === "승인반려" && supplier.rejectedAt && (
              <>
                <p className="text-xs text-gray-400">승인반려일시 : {supplier.rejectedAt}</p>
                <p className="text-xs text-red-500">반려사유 : {supplier.rejectReason}</p>
              </>
            )}
            {supplier.reApplyAt && (
              <p className="text-xs text-gray-400">재승인요청일시 : {supplier.reApplyAt}</p>
            )}
            <button
              onClick={() => router.push(`/b2b/supplier-status/${supplier.id}`)}
              className="mt-1 w-full h-9 rounded-xl bg-gray-100 text-xs font-medium text-gray-600"
            >
              상세보기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
