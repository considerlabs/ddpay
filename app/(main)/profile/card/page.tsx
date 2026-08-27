"use client";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { mockUser } from "@/lib/mock-data";
import { Plus, CreditCard, Trash2 } from "lucide-react";

const MAX_CARDS = 7;

const NOTICES = [
  "본 서비스는 고객이 등록한 카드로 결제가 진행됩니다.",
  "카드 최초 등록 시, 별도의 추가 등록 절차 없이 모든 서비스에서 동일 카드로 결제하실 수 있습니다.",
  "등록/삭제 및 기본카드 변경은 프로그램에서 언제든지 가능합니다.",
  "전자금융거래약관 및 개인정보 처리·제3자 제공(결제 처리 목적) 동의 후 등록이 진행됩니다.",
  "카드 한도 초과/이용정지/이상거래 탐지 등으로 결제가 실패할 수 있습니다.",
  "수수료, 할부/무이자 적용 여부는 카드사 및 거래 유형에 따라 상이합니다.",
  "취소·부분취소·환불은 거래 유형 및 관련 정책에 따르며 처리 시간이 달라질 수 있습니다.",
  "본 결제는 PG사 전자금융거래 기본약관 및 관련 법령을 따릅니다.",
  "카드 정보는 저장되지 않으며, 결제는 각 PG사를 통해 암호화되어 안전하게 처리됩니다.",
];

export default function CardSettingsPage() {
  const cards = mockUser.cards;

  return (
    <div className="flex flex-col">
      <PageHeader title="카드등록 설정" back />

      <div className="px-4 py-4 flex flex-col gap-4">
        {/* Store info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          {[
            { label: "상점 코드", value: mockUser.storeCode },
            { label: "상점 명칭", value: mockUser.storeName },
            { label: "상점 상태", value: "정상" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
              <span className="text-sm font-semibold text-gray-700">{label}</span>
              <span className="text-sm text-gray-600 text-right max-w-[60%]">{value}</span>
            </div>
          ))}
        </div>

        {/* Notices */}
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-5 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs font-bold">!</span>
            <h3 className="text-sm font-semibold text-gray-700">카드 등록 및 결제 시 주의사항</h3>
          </div>
          <ul className="flex flex-col gap-2">
            {NOTICES.map((n, i) => (
              <li key={i} className="flex gap-2 text-xs text-gray-500">
                <span className="shrink-0">•</span>
                <span>{n}</span>
              </li>
            ))}
          </ul>
          <button className="w-full text-center text-xs text-gray-400 underline mt-4">
            전자금융거래 기본 약관 보기
          </button>
        </div>

        {/* Card registration order */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="flex gap-3">
            <span className="text-sm font-semibold text-gray-700 w-20 shrink-0">카드등록순서</span>
            <div className="flex-1 flex flex-col">
              {Array.from({ length: MAX_CARDS - 3 }).map((_, i) => {
                const card = i < cards.length ? cards[i] : null;
                return (
                  <div key={i} className="py-2 border-b border-gray-50 last:border-0 text-sm text-gray-500">
                    {i + 1}. {card ? `${card.name}/${card.last4}/${card.status}` : "미등록"}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card slots */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {cards.map((card) => (
            <div key={card.id} className="flex-shrink-0 w-24 flex flex-col items-center gap-2">
              <div className="w-20 h-14 rounded-xl bg-gray-100 border-2 border-[var(--dd-green)] flex items-center justify-center">
                <CreditCard size={20} className="text-[var(--dd-green)]" />
              </div>
              <span className="text-[10px] text-center text-gray-600">{card.name}/{card.last4}</span>
            </div>
          ))}
          {Array.from({ length: Math.min(2, MAX_CARDS - cards.length) }).map((_, i) => (
            <Link
              key={i}
              href="/profile/card/new"
              className="flex-shrink-0 w-24 flex flex-col items-center gap-2"
            >
              <div className="w-20 h-14 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                <Plus size={20} className="text-gray-400" />
              </div>
              <span className="text-[10px] text-center text-gray-400">카드 등록</span>
            </Link>
          ))}
        </div>

        <button className="self-end px-4 py-2 rounded-lg border-2 border-[var(--dd-orange)] text-[var(--dd-orange)] text-xs font-semibold flex items-center gap-1">
          <Trash2 size={13} />
          카드삭제
        </button>
      </div>
    </div>
  );
}
