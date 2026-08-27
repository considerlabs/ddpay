"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { mockPayments, formatAmount } from "@/lib/mock-data";
import { FileText } from "lucide-react";

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500 w-28 shrink-0">{label}</span>
      <span className="text-sm text-right text-gray-900 flex-1">{value}</span>
    </div>
  );
}

export default function PaymentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const payment = mockPayments.find((p) => p.id === id);
  if (!payment) notFound();

  return (
    <div className="flex flex-col">
      <PageHeader title="결제내역 상세" back />

      <div className="flex flex-col gap-3 px-4 py-4">
        {/* 계약 기본 정보 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <DetailRow label="서비스분류" value={payment.serviceType} />
          <DetailRow label="계약결제번호" value={<span className="font-mono text-xs">{payment.contractNo}</span>} />
          <DetailRow label="계약명" value={payment.contractName.split("(")[0]} />
          <DetailRow label="계약자 성명" value={payment.approverName ?? "-"} />
          <DetailRow label="주민번호" value={payment.idNumber ?? "-"} />
          <DetailRow label="계약등록일" value={payment.contractRegisteredAt ?? "-"} />
          <DetailRow label="결제방식" value={payment.paymentMethod} />
          <DetailRow label="결제일" value="미지정" />
          <DetailRow label="승인상태" value={<StatusBadge status="승인완료" />} />
          {payment.attachments && (
            <div className="pt-3">
              <span className="text-sm text-gray-500 block mb-2">첨부서류</span>
              <div className="flex flex-col gap-1.5">
                {payment.attachments.map((doc) => (
                  <div key={doc} className="flex items-center gap-2">
                    <FileText size={13} className="text-blue-500 shrink-0" />
                    <span className="text-sm text-blue-500 underline">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 카드결제 상세 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">카드결제 상세</h3>
          <DetailRow label="카드 결제 금액" value={formatAmount(payment.totalAmount)} />
          <DetailRow label="결제상태" value={<StatusBadge status={payment.cardStatus ?? "결제대기"} />} />
          {payment.cardFailReason && (
            <DetailRow
              label="결제실패사유"
              value={<span className="text-red-500 text-xs leading-relaxed">{payment.cardFailReason}</span>}
            />
          )}
          <DetailRow label="결제카드" value={payment.cardName ?? "-"} />
          <DetailRow label="결제완료일" value={payment.cardCompletedAt ?? "-"} />
        </div>

        {/* 계좌송금 상세 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">계좌송금 상세</h3>
          <DetailRow label="은행" value={payment.bank ?? "-"} />
          <DetailRow label="계좌번호" value={<span className="font-mono text-xs">{payment.accountNumber ?? "-"}</span>} />
          <DetailRow label="예금주명" value={payment.accountHolder ?? "-"} />
          <DetailRow label="송금액" value={formatAmount(payment.transferAmount)} />
          <DetailRow label="송금상태" value={<StatusBadge status={payment.transferStatus ?? "송금대기"} />} />
          <DetailRow label="송금자명칭" value={payment.approverName ?? "-"} />
        </div>
      </div>
    </div>
  );
}
