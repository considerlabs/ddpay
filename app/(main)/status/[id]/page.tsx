"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { mockContracts, formatAmount } from "@/lib/mock-data";
import { FileText } from "lucide-react";

interface Row {
  label: string;
  value: React.ReactNode;
}

function DetailRow({ label, value }: Row) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500 w-28 shrink-0">{label}</span>
      <span className="text-sm text-right text-gray-900">{value}</span>
    </div>
  );
}

export default function StatusDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const contract = mockContracts.find((c) => c.id === id);
  if (!contract) notFound();

  return (
    <div className="flex flex-col">
      <PageHeader title="등록현황 상세" back />

      <div className="flex flex-col gap-3 px-4 py-4">
        {/* 기본 정보 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <DetailRow label="서비스분류" value={contract.type} />
          <DetailRow label="계약등록번호" value={<span className="font-mono text-xs">{`4601${contract.id}`}</span>} />
          <DetailRow
            label="계약명"
            value={
              <div className="flex items-center gap-2">
                <span>{contract.name.split("(")[0].trim()}({contract.counterparty.name})</span>
                <button className="px-2 py-1 rounded-lg bg-[var(--dd-orange)] text-white text-xs font-semibold">
                  사용중지하기
                </button>
              </div>
            }
          />
          {contract.type === "배달비" && (
            <>
              <DetailRow label="배달플랫폼사명" value="콜고유니온" />
              <DetailRow label="사업자명" value="㈜지와이소프트" />
              <DetailRow label="사업자등록번호" value={contract.counterparty.idNumber} />
            </>
          )}
          <DetailRow label="계약등록일" value={contract.registeredAt} />
          <DetailRow label="결제방식" value={contract.paymentMethod} />
          <DetailRow label="결제일" value="미지정" />
          <DetailRow label="승인상태" value={<StatusBadge status={contract.approvalStatus} />} />
        </div>

        {/* 첨부서류 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">첨부서류</h3>
          <div className="flex flex-col gap-2">
            {contract.documents.map((doc) => (
              <div key={doc} className="flex items-center gap-2">
                <FileText size={14} className="text-blue-500 shrink-0" />
                <span className="text-sm text-blue-500 underline">{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 계좌송금 등록내역 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">계좌송금 등록내역</h3>
          <DetailRow label="은행" value={contract.counterparty.bank} />
          <DetailRow label="계좌번호" value={<span className="font-mono text-xs">{contract.counterparty.accountNumber}</span>} />
          <DetailRow label="예금주명" value={contract.counterparty.accountHolder} />
          <DetailRow
            label="송금자명칭"
            value={
              <div className="flex items-center gap-2">
                <span>{contract.senderName}</span>
                <button className="px-2 py-1 rounded-lg bg-[var(--dd-orange)] text-white text-xs font-semibold">
                  수정
                </button>
              </div>
            }
          />
          <p className="text-[10px] text-gray-400 mt-2">
            * 예금주명 : 계약자(거래 상대방)성명 입니다.<br />
            * 송금자 명칭 : 송금 시 상대방 계좌 또는 충전계좌에 표시되는 이름입니다.
          </p>
        </div>

        {/* 카드결제 및 계좌송금 완료내역 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">카드결제 및 계좌송금 완료내역</h3>
          <DetailRow label="카드결제 완료 횟수" value={`${contract.completedCount}회`} />
          <DetailRow label="카드결제 총금액" value={formatAmount(0)} />
          <DetailRow label="계좌송금 완료 횟수" value="0회" />
          <DetailRow label="계좌송금 총금액" value={formatAmount(0)} />
          <p className="text-[10px] text-gray-400 mt-2">
            * 자세한 완료내역은 "결제내역 상세" 에서 확인해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
