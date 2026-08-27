"use client";
import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, Building2, X } from "lucide-react";
import { addUserContract, type Contract, type ContractType } from "@/lib/mock-data";

type CounterpartyType = "개인" | "사업자";

const CONTRACT_TYPES: { label: ContractType; emoji: string }[] = [
  { label: "월세", emoji: "🏠" },
  { label: "경조사비", emoji: "🎁" },
  { label: "학원비", emoji: "📚" },
  { label: "운영비", emoji: "💼" },
  { label: "인건비", emoji: "👤" },
  { label: "배달비", emoji: "🛵" },
];

const BANKS = [
  "국민은행", "신한은행", "우리은행", "하나은행", "농협은행",
  "기업은행", "카카오뱅크", "토스뱅크", "케이뱅크",
];

const SERVICE_FEE_RATE = 0.066;

export default function ContractPage() {
  const router = useRouter();
  const contractId = useId();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // step 1
  const [contractType, setContractType] = useState<ContractType | null>(null);
  const [contractName, setContractName] = useState("");

  // step 2
  const [cpType, setCpType] = useState<CounterpartyType>("개인");
  const [name, setName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [bank, setBank] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [verified, setVerified] = useState(false);

  // step 3
  const [senderName, setSenderName] = useState("ㅋㅋㅋ");
  const [amount, setAmount] = useState("");
  const [payMethod, setPayMethod] = useState<"수동" | "자동">("수동");

  // step 4
  const [docs, setDocs] = useState<{ type: string; file: string }[]>([]);

  const totalAmount = amount ? Math.round(Number(amount) * (1 + SERVICE_FEE_RATE)) : 0;

  function handleNext() {
    if (step < totalSteps) {
      setStep(step + 1);
      return;
    }
    const contract: Contract = {
      id: contractId,
      type: contractType!,
      name: contractName,
      registeredAt: new Date().toISOString().slice(0, 10),
      approvalStatus: "승인대기",
      paymentMethod: payMethod,
      transferAmount: Number(amount),
      totalAmount,
      senderName,
      counterparty: {
        type: cpType,
        name,
        idNumber,
        bank,
        accountNumber: accountNo,
        accountHolder: name,
      },
      documents: docs.map((d) => d.file),
      completedCount: 0,
    };
    addUserContract(contract);
    setStep(5); // done
  }

  function handlePrev() {
    if (step > 1) setStep(step - 1);
  }

  function addDoc(type: string) {
    setDocs((prev) => [...prev, { type, file: `${type}_0${prev.filter((d) => d.type === type).length + 1}` }]);
  }

  function removeDoc(index: number) {
    setDocs((prev) => prev.filter((_, i) => i !== index));
  }

  if (step === 5) {
    return (
      <div className="flex flex-col min-h-screen">
        <PageHeader title="신규계약 등록" />
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
          <div className="w-20 h-20 rounded-full bg-yellow-50 flex items-center justify-center text-4xl">
            📝
          </div>
          <div className="text-center">
            <h2 className="text-lg font-bold text-[var(--dd-green)]">계약등록 완료!</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              승인완료 후 결제처리가 가능합니다.<br />
              승인완료처리는 약 1~2일 소요됩니다.
            </p>
          </div>
          <button
            onClick={() => router.push("/status")}
            className="w-full h-12 rounded-xl bg-[var(--dd-green)] text-white font-semibold"
          >
            계약 등록 현황 바로가기
          </button>
        </div>
      </div>
    );
  }

  const progressPct = (step / totalSteps) * 100;

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="신규계약 등록" back={step > 1} onBack={handlePrev} />

      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-full bg-[var(--dd-green)] transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col px-5 py-6 gap-6 overflow-y-auto">
        {/* Step 1: Contract Type */}
        {step === 1 && (
          <>
            <p className="text-[15px] font-medium text-gray-800">계약 유형을 선택해주세요.</p>
            <div className="grid grid-cols-3 gap-3">
              {CONTRACT_TYPES.map(({ label, emoji }) => (
                <button
                  key={label}
                  onClick={() => setContractType(label)}
                  className={`flex flex-col items-center justify-center gap-2 py-5 rounded-2xl border-2 transition-all ${
                    contractType === label
                      ? "border-[var(--dd-green)] bg-dd-green-light"
                      : "border-gray-100 bg-white"
                  }`}
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-xs font-medium text-gray-700">{label}</span>
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-gray-500">계약명</Label>
              <Input
                value={contractName}
                onChange={(e) => setContractName(e.target.value)}
                placeholder="000"
                className="h-12 rounded-xl"
              />
            </div>
          </>
        )}

        {/* Step 2: Counterparty Info */}
        {step === 2 && (
          <>
            <p className="text-[15px] font-medium text-gray-800">거래 상대방의 정보를 입력해주세요.</p>

            <div className="flex gap-3">
              {(["개인", "사업자"] as CounterpartyType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setCpType(t)}
                  className={`flex items-center gap-2 text-sm font-medium ${
                    cpType === t ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      cpType === t ? "border-[var(--dd-green)]" : "border-gray-300"
                    }`}
                  >
                    {cpType === t && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--dd-green)]" />
                    )}
                  </span>
                  {t === "개인" ? <Home size={14} /> : <Building2 size={14} />}
                  {t}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-gray-500">성명</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="성명을 입력하세요" className="h-12 rounded-xl" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-gray-500">{cpType === "개인" ? "주민번호" : "사업자등록번호"}</Label>
                <Input value={idNumber} onChange={(e) => setIdNumber(e.target.value)} placeholder={cpType === "개인" ? "000000-0000000" : "000-00-00000"} className="h-12 rounded-xl" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-gray-500">은행선택</Label>
                <select
                  value={bank}
                  onChange={(e) => { setBank(e.target.value); setVerified(false); }}
                  className={`h-12 rounded-xl border px-3 text-sm bg-white ${
                    !bank ? "border-red-400 text-gray-400" : "border-gray-200 text-gray-900"
                  }`}
                >
                  <option value="">거래은행을 선택하세요.</option>
                  {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                {!bank && <p className="text-xs text-red-400">은행을 선택해주세요.</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-gray-500">계좌번호</Label>
                <Input
                  value={accountNo}
                  onChange={(e) => { setAccountNo(e.target.value); setVerified(false); }}
                  placeholder="계좌번호를 입력하세요"
                  inputMode="numeric"
                  className="h-12 rounded-xl"
                />
              </div>
              {bank && accountNo && !verified && (
                <button
                  onClick={() => setVerified(true)}
                  className="h-12 rounded-xl border-2 border-[var(--dd-orange)] text-[var(--dd-orange)] font-semibold text-sm"
                >
                  안심 계좌인증
                </button>
              )}
              {verified && (
                <p className="text-xs text-[var(--dd-green)] font-medium">✓ 계좌 인증이 완료되었습니다.</p>
              )}
              {bank && accountNo && (
                <p className="text-[10px] text-gray-400">
                  ※ 계좌번호의 유효성 검사만 진행되며, 상대방에게 연락이 가지 않습니다.
                </p>
              )}
            </div>
          </>
        )}

        {/* Step 3: Amount */}
        {step === 3 && (
          <>
            <p className="text-[15px] font-medium text-gray-800">송금하실 금액을 입력해주세요.</p>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-gray-500">송금자명칭</Label>
                  <span className="text-xs text-[var(--dd-green)] cursor-pointer">송금자명 변경방법 ⓘ</span>
                </div>
                <Input value={senderName} onChange={(e) => setSenderName(e.target.value)} className="h-12 rounded-xl font-medium" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-gray-500">송금금액</Label>
                <div className="relative">
                  <Input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="0"
                    inputMode="numeric"
                    className="h-12 rounded-xl pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">원</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-gray-500">결제금액</Label>
                <div className="h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between px-3">
                  <span className="text-sm font-bold text-gray-800">
                    {totalAmount.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">원</span>
                </div>
                <p className="text-xs text-gray-400 text-right">송금액+서비스이용료(6.6%)</p>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-xs text-gray-500">자동결제 여부(수동/자동)</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPayMethod("수동")}
                    className={`h-12 rounded-xl border-2 text-sm font-semibold transition-all ${
                      payMethod === "수동"
                        ? "border-[var(--dd-orange)] text-[var(--dd-orange)]"
                        : "border-gray-200 text-gray-400"
                    }`}
                  >
                    내가 직접결제하기(수동)
                  </button>
                  <button
                    onClick={() => setPayMethod("자동")}
                    className={`h-12 rounded-xl border-2 text-sm font-semibold transition-all ${
                      payMethod === "자동"
                        ? "border-[var(--dd-orange)] text-[var(--dd-orange)]"
                        : "border-gray-200 text-gray-400"
                    }`}
                  >
                    자동결제 신청하기
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 4: Documents */}
        {step === 4 && (
          <>
            <p className="text-[15px] font-medium text-gray-800">받으시는 분(상대방)의 첨부 서류를 등록해주세요.</p>
            <div className="flex flex-col gap-3">
              {[
                "신분증 또는 사업자등록증",
                "입금 통장 사본",
                "임대차계약서 등",
              ].map((docType) => {
                const existing = docs.filter((d) => d.type === docType);
                return (
                  <div key={docType} className="flex flex-col gap-2">
                    {existing.map((doc, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200"
                      >
                        <span className="text-sm text-gray-700">{doc.file}</span>
                        <button onClick={() => removeDoc(docs.indexOf(doc))}>
                          <X size={16} className="text-gray-400" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addDoc(docType)}
                      className="flex items-center justify-between px-4 py-3 rounded-xl border-2 border-[var(--dd-green)]"
                    >
                      <span className="text-sm text-[var(--dd-green)]">{docType} 추가</span>
                      <span className="w-6 h-6 rounded-full bg-[var(--dd-green)] text-white flex items-center justify-center text-lg leading-none">+</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Bottom buttons */}
      <div className="px-5 pb-6 flex gap-3">
        {step > 1 && (
          <button
            onClick={handlePrev}
            className="flex-1 h-12 rounded-xl border border-gray-200 text-gray-600 font-medium"
          >
            이전
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={
            (step === 1 && (!contractType || !contractName)) ||
            (step === 2 && (!name || !idNumber || !bank || !accountNo)) ||
            (step === 3 && !amount)
          }
          className="flex-1 h-12 rounded-xl bg-[var(--dd-green)] text-white font-semibold disabled:bg-gray-300 disabled:text-gray-400 transition-colors"
        >
          {step === totalSteps ? "계약등록 완료" : "다음"}
        </button>
      </div>
    </div>
  );
}
