"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { mockUser } from "@/lib/mock-data";

const BANKS = ["국민은행", "신한은행", "우리은행", "하나은행", "농협은행", "기업은행", "카카오뱅크", "토스뱅크"];

const DOC_TYPES = [
  { label: "사업자등록증", key: "bizReg" },
  { label: "공급자 통장사본", key: "bankBook" },
  { label: "물품·서비스 거래명세서", key: "invoice" },
];

export default function SupplierRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showComplete, setShowComplete] = useState(false);

  // step 1 - basic info
  const [bizName, setBizName] = useState("");
  const [bizNo, setBizNo] = useState("");
  const [ceoName, setCeoName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // step 2 - account info
  const [bank, setBank] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [verified, setVerified] = useState(false);
  const senderName = mockUser.senderName;

  // step 3 - documents
  const [docs, setDocs] = useState<{ type: string; file: string }[]>([]);

  function addDoc(type: string) {
    setDocs((prev) => [...prev, { type, file: `${type}_0${prev.filter((d) => d.type === type).length + 1}` }]);
  }

  function removeDoc(index: number) {
    setDocs((prev) => prev.filter((_, i) => i !== index));
  }

  const step1Valid = bizName && bizNo && ceoName && contactName && contactPhone;
  const step2Valid = !!senderName && bank && accountNo;

  const progressPct = (step / 3) * 100;

  if (showComplete) {
    return (
      <div className="flex flex-col min-h-screen">
        <PageHeader title="B2B구매대행 공급자(거래처) 정보 등록" back />
        <div className="h-1 bg-gray-100">
          <div className="h-full bg-[var(--dd-orange)]" style={{ width: "100%" }} />
        </div>
        <div className="flex-1 px-5 py-6 flex flex-col gap-5 overflow-y-auto">
          <p className="text-[15px] font-medium text-gray-800">구매대행 공급자 등록을 위해 필수 서류를 첨부해 주세요.</p>
          <div className="flex flex-col gap-3">
            {DOC_TYPES.map(({ label, key }) => {
              const existing = docs.filter((d) => d.type === key);
              return (
                <div key={key} className="flex flex-col gap-2">
                  {existing.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200">
                      <span className="text-sm text-gray-700">{doc.file}</span>
                      <button onClick={() => removeDoc(docs.indexOf(doc))}><X size={16} className="text-gray-400" /></button>
                    </div>
                  ))}
                  <button
                    onClick={() => addDoc(key)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl border-2 border-[var(--dd-orange)]"
                  >
                    <span className="text-sm text-[var(--dd-orange)]">{label} 추가(필수)</span>
                    <span className="w-6 h-6 rounded-full bg-[var(--dd-orange)] text-white flex items-center justify-center text-lg leading-none">+</span>
                  </button>
                </div>
              );
            })}
            <p className="text-xs text-gray-400">* 거래명세서는 최근 1개월 이내 발급된 자료를 첨부해 주세요.</p>
          </div>
        </div>
        {/* Completion popup overlay */}
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-8">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xs flex flex-col gap-4 text-center shadow-xl">
            <div>
              <p className="text-base font-bold text-gray-800">공급자 등록 신청이 접수되었습니다.</p>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                승인까지 영업일 기준<br />1~2일이 소요될 수 있습니다.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                onClick={() => router.push("/home")}
                className="h-11 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium"
              >
                홈화면
              </button>
              <button
                onClick={() => router.push("/b2b/supplier-status")}
                className="h-11 rounded-xl bg-[var(--dd-orange)] text-white text-sm font-semibold"
              >
                승인현황 바로가기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="B2B구매대행 공급자(거래처) 정보 등록"
        back
        onBack={step > 1 ? () => setStep(step - 1) : undefined}
      />

      {/* Progress */}
      <div className="h-1 bg-gray-100">
        <div className="h-full bg-[var(--dd-orange)] transition-all" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="flex-1 px-5 py-6 flex flex-col gap-5 overflow-y-auto">

        {/* Step 1: 기본정보 */}
        {step === 1 && (
          <>
            <p className="text-[15px] font-medium text-gray-800">거래 상대방의 기본정보를 입력해주세요.</p>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-gray-500">사업자명</Label>
                <Input value={bizName} onChange={(e) => setBizName(e.target.value)} placeholder="사업자명" className="h-12 rounded-xl" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-gray-500">사업자등록번호</Label>
                <Input value={bizNo} onChange={(e) => setBizNo(e.target.value.replace(/\D/g, ""))} inputMode="numeric" placeholder="사업자등록번호" className="h-12 rounded-xl" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-gray-500">대표자명</Label>
                <Input
                  value={ceoName}
                  onChange={(e) => setCeoName(e.target.value.replace(/[^가-힣a-zA-Z\s]/g, ""))}
                  placeholder="대표자명"
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-gray-500">거래처 담당자명</Label>
                <Input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="담당자명" className="h-12 rounded-xl" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-gray-500">담당자 연락처</Label>
                <Input
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, ""))}
                  inputMode="numeric"
                  placeholder="연락처"
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="text-xs text-gray-400 flex flex-col gap-1">
                <p>* 연락처는 숫자만 입력해 주세요. (- 제외)</p>
                <p>* 서비스 이용 및 거래 관련 안내를 위해 실제 공급 담당자의 연락처를 입력해 주세요.</p>
                <p>* 담당자 정보가 없거나 부정확한 경우 서비스 이용이 어려울 수 있습니다.</p>
              </div>
            </div>
          </>
        )}

        {/* Step 2: 계좌정보 */}
        {step === 2 && (
          <>
            <p className="text-[15px] font-medium text-gray-800">거래 상대방의 계좌정보를 입력해주세요.</p>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-gray-500">송금자명칭</Label>
                  <span className="text-xs text-[var(--dd-orange)] cursor-pointer">송금자명 변경방법 !</span>
                </div>
                <div className="h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center px-3">
                  <span className="text-sm text-gray-700">{senderName || "미등록"}</span>
                </div>
                {!senderName && (
                  <p className="text-xs text-red-400">송금자명칭이 등록되지 않아 공급자 등록이 불가합니다. 내정보에서 먼저 등록해 주세요.</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-gray-500">거래처 은행</Label>
                <select
                  value={bank}
                  onChange={(e) => { setBank(e.target.value); setVerified(false); setAccountHolder(""); }}
                  className="h-12 rounded-xl border border-gray-200 px-3 text-sm bg-white"
                >
                  <option value="">은행을 선택하세요</option>
                  {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-gray-500">거래처 계좌번호</Label>
                <Input
                  value={accountNo}
                  onChange={(e) => { setAccountNo(e.target.value.replace(/\D/g, "")); setVerified(false); setAccountHolder(""); }}
                  inputMode="numeric"
                  placeholder="계좌번호"
                  className="h-12 rounded-xl"
                />
              </div>
              {bank && accountNo && (
                <button
                  onClick={() => { setVerified(true); setAccountHolder("홍길동"); }}
                  className="h-12 rounded-xl bg-[var(--dd-orange)] text-white font-semibold text-sm"
                >
                  계좌인증
                </button>
              )}
              <p className="text-xs text-gray-400">* 계좌번호의 유효성 검사만 진행되며, 상대방에게 연락이 가지 않습니다.</p>
              {verified && (
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-gray-500">예금주명</Label>
                  <div className="h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center px-3">
                    <span className="text-sm text-gray-700">{accountHolder}</span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Step 3: 필수서류 */}
        {step === 3 && (
          <>
            <p className="text-[15px] font-medium text-gray-800">구매대행 공급자 등록을 위해 필수 서류를 첨부해 주세요.</p>
            <div className="flex flex-col gap-3">
              {DOC_TYPES.map(({ label, key }) => {
                const existing = docs.filter((d) => d.type === key);
                return (
                  <div key={key} className="flex flex-col gap-2">
                    {existing.map((doc, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200">
                        <span className="text-sm text-gray-700">{doc.file}</span>
                        <button onClick={() => removeDoc(docs.indexOf(doc))}><X size={16} className="text-gray-400" /></button>
                      </div>
                    ))}
                    <button
                      onClick={() => addDoc(key)}
                      className="flex items-center justify-between px-4 py-3 rounded-xl border-2 border-[var(--dd-orange)]"
                    >
                      <span className="text-sm text-[var(--dd-orange)]">{label} 추가(필수)</span>
                      <span className="w-6 h-6 rounded-full bg-[var(--dd-orange)] text-white flex items-center justify-center text-lg leading-none">+</span>
                    </button>
                  </div>
                );
              })}
              <p className="text-xs text-gray-400">* 거래명세서는 최근 1개월 이내 발급된 자료를 첨부해 주세요.</p>
            </div>
          </>
        )}
      </div>

      {/* Bottom buttons */}
      <div className="px-5 pb-6 flex gap-3">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="flex-1 h-12 rounded-xl border border-gray-200 text-gray-600 font-medium">
            이전
          </button>
        )}
        <button
          onClick={() => step < 3 ? setStep(step + 1) : setShowComplete(true)}
          disabled={
            (step === 1 && !step1Valid) ||
            (step === 2 && !step2Valid)
          }
          className="flex-1 h-12 rounded-xl bg-[var(--dd-orange)] text-white font-semibold disabled:bg-gray-300 disabled:text-gray-400"
        >
          {step === 3 ? "등록신청 완료" : "다음"}
        </button>
      </div>
    </div>
  );
}
