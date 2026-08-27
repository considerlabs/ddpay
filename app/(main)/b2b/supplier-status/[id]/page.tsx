"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { X } from "lucide-react";
import { MOCK_SUPPLIERS, SupplierStatus } from "@/lib/mock-suppliers";

const STATUS_COLORS: Record<SupplierStatus, string> = {
  승인대기: "text-gray-500",
  승인완료: "text-green-600",
  승인반려: "text-red-500",
  사용정지: "text-orange-500",
  계약해지: "text-blue-500",
};

export default function SupplierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const supplier = MOCK_SUPPLIERS.find((s) => s.id === id);

  const [extraDocs, setExtraDocs] = useState<string[]>([]);
  const [showReApplyDone, setShowReApplyDone] = useState(false);
  const [showDocUpload, setShowDocUpload] = useState(false);

  if (!supplier) {
    return (
      <div className="flex flex-col">
        <PageHeader title="상세보기" back />
        <p className="text-center text-sm text-gray-400 py-12">데이터를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const isRejected = supplier.approvalStatus === "승인반려";

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="B2B구매대행 공급자 승인현황 상세" back />

      <div className="flex-1 px-4 py-4 flex flex-col gap-3 overflow-y-auto pb-6">
        {/* Main info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {[
            ["서비스 분류", "상품대금"],
            ["공급자 계약번호", supplier.regNo],
            ["공급자명", supplier.name],
            ["공급자 사업자등록번호", supplier.bizNo],
            ["대표자", supplier.ceo],
            ["담당자명", supplier.contactName],
            ["담당자 휴대폰번호", supplier.contactPhone],
            ["등록일시", supplier.registeredAt],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center border-b border-gray-50 px-4 py-3 gap-3">
              <span className="text-xs text-gray-400 w-36 shrink-0">{label}</span>
              <span className="text-xs text-gray-800 flex-1">{value}</span>
            </div>
          ))}

          <div className="flex items-center border-b border-gray-50 px-4 py-3 gap-3">
            <span className="text-xs text-gray-400 w-36 shrink-0">승인상태</span>
            <span className={`text-xs font-bold flex-1 ${STATUS_COLORS[supplier.approvalStatus]}`}>
              {supplier.approvalStatus}
            </span>
          </div>

          {supplier.approvedAt && (
            <div className="flex items-center border-b border-gray-50 px-4 py-3 gap-3">
              <span className="text-xs text-gray-400 w-36 shrink-0">승인완료일시</span>
              <span className="text-xs text-gray-800 flex-1">{supplier.approvedAt}</span>
            </div>
          )}

          <div className="flex items-start border-b border-gray-50 px-4 py-3 gap-3">
            <span className="text-xs text-gray-400 w-36 shrink-0">첨부서류</span>
            <div className="flex flex-col gap-1 flex-1">
              {supplier.attachments.map((a, i) => (
                <span key={i} className="text-xs text-gray-800">첨부 {i + 1}. {a}</span>
              ))}
            </div>
          </div>

          {/* 승인반려 상세 */}
          {isRejected && (
            <>
              <div className="flex items-center border-b border-gray-50 px-4 py-3 gap-3">
                <span className="text-xs text-gray-400 w-36 shrink-0">승인반려일시</span>
                <span className="text-xs text-red-500 flex-1">{supplier.rejectedAt}</span>
              </div>
              <div className="flex items-center border-b border-gray-50 px-4 py-3 gap-3">
                <span className="text-xs text-gray-400 w-36 shrink-0">승인반려사유</span>
                <span className="text-xs text-gray-800 flex-1">{supplier.rejectReason}</span>
              </div>
              <div className="flex items-start px-4 py-3 gap-3">
                <span className="text-xs text-gray-400 w-36 shrink-0">추가서류</span>
                <div className="flex flex-col gap-1 flex-1">
                  {extraDocs.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-xs text-gray-800">{doc}</span>
                      <button onClick={() => setExtraDocs((prev) => prev.filter((_, idx) => idx !== i))}>
                        <X size={12} className="text-gray-400" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setShowDocUpload(true)}
                    className="mt-1 flex items-center gap-1 text-xs text-[var(--dd-orange)]"
                  >
                    + 추가서류 등록
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 계좌정보 등록 상세 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <span className="text-xs font-semibold text-gray-700">계좌정보 등록 상세</span>
          </div>
          {[
            ["은행", supplier.bank],
            ["계좌번호", supplier.accountNo],
            ["예금주명", supplier.accountHolder],
            ["송금자명칭", supplier.senderName],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center border-b border-gray-50 last:border-0 px-4 py-3 gap-3">
              <span className="text-xs text-gray-400 w-24 shrink-0">{label}</span>
              <span className="text-xs text-gray-800 flex-1">{value}</span>
            </div>
          ))}
        </div>

        {/* 재승인 요청 버튼 */}
        {isRejected && (
          <button
            onClick={() => extraDocs.length > 0 && setShowReApplyDone(true)}
            disabled={extraDocs.length === 0}
            className="w-full h-12 rounded-xl bg-[var(--dd-orange)] text-white font-semibold disabled:bg-gray-200 disabled:text-gray-400"
          >
            재승인 요청
          </button>
        )}
      </div>

      {/* 보완서류 등록 모달 */}
      {showDocUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="bg-white rounded-2xl p-5 w-full max-w-xs flex flex-col gap-3 shadow-xl">
            <p className="text-sm font-bold text-gray-800">보완서류 등록</p>
            <p className="text-xs text-gray-500">반려 사유를 확인한 후 필요한 보완서류를 첨부해 주세요.</p>
            <p className="text-xs text-gray-400">※ 보완서류 저장 후 재승인 요청이 가능합니다.</p>
            {["사업자등록증 추가", "공급자 통장사본 추가", "물품·서비스 거래명세서"].map((label) => (
              <button
                key={label}
                className="flex items-center justify-between px-4 py-3 rounded-xl border-2 border-[var(--dd-orange)]"
              >
                <span className="text-sm text-[var(--dd-orange)]">{label}</span>
                <span className="w-6 h-6 rounded-full bg-[var(--dd-orange)] text-white flex items-center justify-center text-lg leading-none">+</span>
              </button>
            ))}
            <div className="grid grid-cols-2 gap-3 mt-1">
              <button onClick={() => setShowDocUpload(false)} className="h-11 rounded-xl border border-gray-200 text-sm text-gray-600">
                취소
              </button>
              <button
                onClick={() => { setExtraDocs((p) => [...p, "거래명세표"]); setShowDocUpload(false); }}
                className="h-11 rounded-xl bg-[var(--dd-orange)] text-white text-sm font-semibold"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 재승인 요청 완료 모달 */}
      {showReApplyDone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-8">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xs flex flex-col gap-4 text-center shadow-xl">
            <div>
              <p className="text-base font-bold text-gray-800">재승인 요청이 접수되었습니다.</p>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                검토까지 영업일 기준<br />1~2일이 소요될 수 있습니다.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => router.push("/home")} className="h-11 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium">
                홈화면
              </button>
              <button onClick={() => router.push("/b2b/supplier-status")} className="h-11 rounded-xl bg-[var(--dd-orange)] text-white text-sm font-semibold">
                승인현황 바로가기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
