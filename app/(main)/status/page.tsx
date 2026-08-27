"use client";
import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { getAllContracts, mockContracts, mockUser, formatAmount, type Contract } from "@/lib/mock-data";
import { ChevronRight, CreditCard, Pencil } from "lucide-react";

const MONTHS = ["전체", "1월", "2월", "3월", "4월", "5월", "6월"];
const STATUSES = ["전체", "승인대기", "승인완료", "반려"];

// 결제금액 구간별 분할결제 입력칸 수 (9천만원 초과는 11칸으로 고정)
const SPLIT_TIERS: [number, number][] = [
  [10_000_000, 3],
  [30_000_000, 5],
  [50_000_000, 7],
  [70_000_000, 9],
  [90_000_000, 11],
];
function getSplitCount(amount: number) {
  for (const [max, count] of SPLIT_TIERS) if (amount <= max) return count;
  return 11;
}

export default function StatusPage() {
  const [month, setMonth] = useState("전체");
  const [status, setStatus] = useState("전체");
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [payingContract, setPayingContract] = useState<Contract | null>(null);
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);
  if (typeof window !== "undefined" && !loadedFromStorage) {
    setLoadedFromStorage(true);
    setContracts(getAllContracts());
  }

  const filtered = contracts.filter((c) => {
    if (status !== "전체" && c.approvalStatus !== status) return false;
    return true;
  });

  function handlePaid(contractId: string) {
    setContracts((prev) =>
      prev.map((c) => (c.id === contractId ? { ...c, completedCount: c.completedCount + 1 } : c))
    );
  }

  return (
    <div className="flex flex-col">
      <PageHeader title="계약 등록 현황" back />

      {/* Filters */}
      <div className="px-4 py-3 flex gap-2 border-b border-gray-100">
        {[
          { label: "월선택", value: month, options: MONTHS, onChange: setMonth },
          { label: "상태", value: status, options: STATUSES, onChange: setStatus },
          { label: "결제예정일", value: "전체", options: ["전체"], onChange: () => {} },
        ].map(({ label, value, options, onChange }) => (
          <select
            key={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 h-9 rounded-lg border border-gray-200 text-xs text-gray-700 px-2 bg-white"
          >
            {options.map((o) => <option key={o} value={o}>{o === "전체" ? label : o}</option>)}
          </select>
        ))}
      </div>

      {/* Contract list */}
      <div className="flex flex-col gap-3 px-4 py-4">
        {filtered.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-12">등록된 계약이 없습니다.</p>
        )}
        {filtered.map((contract) => (
          <div key={contract.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">{contract.registeredAt}</span>
              <Link
                href={`/status/${contract.id}`}
                className="flex items-center gap-0.5 text-xs text-gray-500"
              >
                상세 <ChevronRight size={12} />
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-semibold text-gray-900">{contract.name}</span>
              <span className="text-[15px] font-bold">{formatAmount(contract.totalAmount)}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <StatusBadge status={contract.approvalStatus} />
                {contract.approvalStatus === "승인완료" && (
                  <span className="text-xs text-gray-400">결제완료:{contract.completedCount}회</span>
                )}
              </div>
              {contract.approvalStatus === "승인완료" ? (
                <button
                  onClick={() => setPayingContract(contract)}
                  className="px-3 py-1.5 rounded-lg bg-[var(--dd-orange)] text-white text-xs font-semibold"
                >
                  수동 결제하기
                </button>
              ) : (
                <button className="px-3 py-1.5 rounded-lg bg-gray-300 text-white text-xs font-semibold" disabled>
                  수동 결제하기
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {payingContract && (
        <ManualPaymentSheet
          contract={payingContract}
          onClose={() => setPayingContract(null)}
          onPaid={() => handlePaid(payingContract.id)}
        />
      )}
    </div>
  );
}

function ManualPaymentSheet({
  contract,
  onClose,
  onPaid,
}: {
  contract: Contract;
  onClose: () => void;
  onPaid: () => void;
}) {
  const [step, setStep] = useState<"card" | "confirm" | "done">("card");
  const [selectedCardId, setSelectedCardId] = useState(mockUser.cards[0]?.id);
  const [amount, setAmount] = useState(contract.totalAmount);
  const [editingAmount, setEditingAmount] = useState(false);
  const [paymentType, setPaymentType] = useState<"일반" | "분할">("일반");
  const splitCount = getSplitCount(amount);
  const [splitInputs, setSplitInputs] = useState<string[]>(() => Array(splitCount - 1).fill(""));
  const selectedCard = mockUser.cards.find((c) => c.id === selectedCardId) ?? mockUser.cards[0];
  const today = new Date().toISOString().slice(0, 10);

  const [prevSplitCount, setPrevSplitCount] = useState(splitCount);
  if (prevSplitCount !== splitCount) {
    setPrevSplitCount(splitCount);
    setSplitInputs(Array(splitCount - 1).fill(""));
  }

  const numericSplitInputs = splitInputs.map((v) => (v === "" ? 0 : Number(v)));
  const sumEntered = numericSplitInputs.reduce((a, b) => a + b, 0);
  const lastAmount = amount - sumEntered;
  const allSplitValues = [...numericSplitInputs, lastAmount];
  const splitAllFilled = numericSplitInputs.every((v) => v > 0) && lastAmount > 0;
  const splitHasDuplicate = new Set(allSplitValues).size !== allSplitValues.length;
  const splitValid = splitAllFilled && !splitHasDuplicate;

  const rows: [string, string][] = [
    ["받는사람", contract.counterparty.name],
    ["받는계좌", `${contract.counterparty.bank}/${contract.counterparty.accountNumber}`],
    ["통장표기", contract.counterparty.accountHolder],
    ["송금액", formatAmount(contract.transferAmount)],
    ["결제금액", formatAmount(amount)],
    ["결제카드", selectedCard ? `${selectedCard.name}(${selectedCard.last4})` : "-"],
    ["할부기간", paymentType === "일반" ? "일시불" : `분할 ${splitCount}회`],
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-6">
      <div className="bg-white rounded-2xl p-6 w-full max-w-xs max-h-[85vh] overflow-y-auto flex flex-col items-center gap-4 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-dd-orange-light flex items-center justify-center">
          <CreditCard className="text-[var(--dd-orange)]" size={28} />
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-gray-900">{contract.name}</p>
          <StatusBadge status={contract.approvalStatus} className="mt-1" />
        </div>

        {step === "card" && (
          <>
            <div className="flex gap-3 overflow-x-auto w-full py-1">
              {mockUser.cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => setSelectedCardId(card.id)}
                  className={`shrink-0 w-40 h-24 rounded-xl flex flex-col justify-between p-3 text-white bg-gradient-to-br from-blue-500 to-blue-700 transition-opacity ${
                    selectedCardId === card.id ? "ring-2 ring-[var(--dd-orange)]" : "opacity-50"
                  }`}
                >
                  <span className="text-[10px] font-semibold tracking-wide">CREDIT CARD</span>
                  <span className="text-sm font-bold">{card.name}</span>
                </button>
              ))}
            </div>
            {selectedCard && (
              <p className="text-sm text-gray-600">
                {selectedCard.name} ({selectedCard.last4})
              </p>
            )}
            <div className="grid grid-cols-2 gap-3 w-full mt-2">
              <button onClick={onClose} className="h-11 rounded-xl border border-gray-200 text-gray-600 font-medium">
                취소
              </button>
              <button
                onClick={() => setStep("confirm")}
                disabled={!selectedCard}
                className="h-11 rounded-xl bg-[var(--dd-orange)] text-white font-semibold disabled:bg-gray-300"
              >
                다음
              </button>
            </div>
          </>
        )}

        {step === "confirm" && (
          <>
            <div className="w-full rounded-xl bg-gray-50 divide-y divide-gray-100 text-sm">
              {rows.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between px-3 py-2.5">
                  <span className="text-gray-500">{label}</span>
                  <span className="text-gray-900 font-medium">{value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400">결제일: {today}</p>

            {/* 일반결제 / 분할결제 탭 */}
            <div className="w-full grid grid-cols-2 rounded-xl bg-gray-100 p-1">
              {(["일반", "분할"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setPaymentType(type)}
                  className={`h-9 rounded-lg text-sm font-semibold transition-colors ${
                    paymentType === type ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                  }`}
                >
                  {type}결제
                </button>
              ))}
            </div>

            <div className="w-full rounded-xl bg-gray-50 h-14 flex items-center justify-center relative">
              {editingAmount ? (
                <input
                  type="number"
                  autoFocus
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                  onBlur={() => setEditingAmount(false)}
                  className="text-xl font-bold text-center w-32 bg-transparent outline-none"
                />
              ) : (
                <span className="text-xl font-bold text-gray-900">{formatAmount(amount)}</span>
              )}
              <button
                onClick={() => setEditingAmount(true)}
                className="absolute right-4 text-[var(--dd-orange)]"
              >
                <Pencil size={16} />
              </button>
            </div>

            {paymentType === "분할" && (
              <div className="w-full flex flex-col gap-2">
                {Array.from({ length: splitCount }).map((_, i) => {
                  const isLast = i === splitCount - 1;
                  return (
                    <div key={i} className="flex items-center justify-between gap-2 rounded-xl bg-gray-50 px-3 py-2.5">
                      <span className="text-xs text-gray-500 shrink-0">{i + 1}회차</span>
                      {isLast ? (
                        <span className={`text-sm font-semibold ${lastAmount <= 0 ? "text-red-500" : "text-gray-900"}`}>
                          {formatAmount(lastAmount)}
                        </span>
                      ) : (
                        <input
                          type="number"
                          value={splitInputs[i] ?? ""}
                          onChange={(e) => {
                            const next = [...splitInputs];
                            next[i] = e.target.value;
                            setSplitInputs(next);
                          }}
                          placeholder="금액 입력"
                          className="flex-1 text-right text-sm font-medium bg-transparent outline-none"
                        />
                      )}
                    </div>
                  );
                })}
                {splitHasDuplicate && (
                  <p className="text-xs text-red-500">⚠ 각 회차 금액은 서로 달라야 합니다. (동일 금액 불가)</p>
                )}
                {lastAmount < 0 && (
                  <p className="text-xs text-red-500">입력한 금액의 합이 결제금액을 초과했습니다.</p>
                )}
              </div>
            )}

            <p className="text-xs text-gray-400 text-center">※ 위 내용을 확인 후 · 결제하기를 클릭하세요.</p>
            <div className="grid grid-cols-2 gap-3 w-full">
              <button onClick={() => setStep("card")} className="h-11 rounded-xl border border-gray-200 text-gray-600 font-medium">
                카드선택
              </button>
              <button
                onClick={() => setStep("done")}
                disabled={paymentType === "분할" && !splitValid}
                className="h-11 rounded-xl bg-[var(--dd-orange)] text-white font-semibold disabled:bg-gray-300"
              >
                결제하기
              </button>
            </div>
          </>
        )}

        {step === "done" && (
          <>
            <p className="text-sm text-gray-600 text-center">결제가 요청되었습니다.<br />결제 결과는 결제내역에서 확인하세요.</p>
            <button
              onClick={() => {
                onPaid();
                onClose();
              }}
              className="h-11 w-full rounded-xl bg-[var(--dd-orange)] text-white font-semibold"
            >
              확인
            </button>
          </>
        )}
      </div>
    </div>
  );
}
