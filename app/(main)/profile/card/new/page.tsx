"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Shield, AlertTriangle, ChevronDown } from "lucide-react";

export default function CardNewPage() {
  const router = useRouter();
  const [cardNums, setCardNums] = useState(["", "", "", ""]);
  const [mm, setMm] = useState("");
  const [yy, setYy] = useState("");
  const [pw, setPw] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [agreeAll, setAgreeAll] = useState(false);

  const canSubmit =
    cardNums.every((n) => n.length === 4) &&
    mm && yy && pw && ownerName && birthDate && phone && agreeAll;

  function handleCardNum(index: number, val: string) {
    const next = [...cardNums];
    next[index] = val.replace(/\D/g, "").slice(0, 4);
    setCardNums(next);
  }

  function handleToggleAll() {
    const next = !agreeAll;
    setAgreeAll(next);
    setAgreed(next);
  }

  return (
    <div className="flex flex-col">
      <PageHeader title="카드등록" back />

      <div className="px-4 py-5 flex flex-col gap-6">
        {/* 결제정보 */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={18} className="text-gray-700" />
            <h2 className="text-[15px] font-bold text-gray-900">결제정보</h2>
          </div>
          <p className="text-xs text-gray-400 mb-4">결제에 사용하실 카드 정보를 입력하세요</p>

          <div className="flex flex-col gap-4">
            <div>
              <Label className="text-xs text-gray-500 mb-1.5 block">카드번호</Label>
              <div className="flex gap-2">
                {cardNums.map((v, i) => (
                  <Input
                    key={i}
                    value={v}
                    onChange={(e) => handleCardNum(i, e.target.value)}
                    maxLength={4}
                    inputMode="numeric"
                    placeholder="1234"
                    className="h-11 rounded-xl text-center text-sm"
                  />
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs text-gray-500 mb-1.5 block">유효기간</Label>
              <div className="flex gap-2">
                <Input value={mm} onChange={(e) => setMm(e.target.value.replace(/\D/g, "").slice(0, 2))} maxLength={2} inputMode="numeric" placeholder="MM(월)" className="h-11 rounded-xl text-center" />
                <Input value={yy} onChange={(e) => setYy(e.target.value.replace(/\D/g, "").slice(0, 2))} maxLength={2} inputMode="numeric" placeholder="YY(년)" className="h-11 rounded-xl text-center" />
              </div>
            </div>

            <div>
              <Label className="text-xs text-gray-500 mb-1.5 block">비밀번호</Label>
              <Input type="password" value={pw} onChange={(e) => setPw(e.target.value.slice(0, 2))} maxLength={2} placeholder="비밀번호 앞 2자리 입력" className="h-11 rounded-xl" />
            </div>
          </div>
        </section>

        {/* 인증정보 */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-gray-700" />
            <h2 className="text-[15px] font-bold text-gray-900">인증정보</h2>
          </div>
          <p className="text-xs text-gray-400 mb-4">안전한 결제를 위해 카드 소유자 정보를 입력해 주세요</p>

          <div className="flex flex-col gap-4">
            <div>
              <Label className="text-xs text-gray-500 mb-1.5 block">이름</Label>
              <Input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="카드 소유자 이름 입력" className="h-11 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1.5 block">생년월일 | 사업자등록번호</Label>
              <Input value={birthDate} onChange={(e) => setBirthDate(e.target.value.replace(/\D/g, ""))} inputMode="numeric" placeholder="카드 소유자 생년월일 입력 (- 없이 숫자만 입력)" className="h-11 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1.5 block">휴대전화</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} inputMode="numeric" placeholder="휴대전화 번호 입력 (- 없이 숫자만 입력)" className="h-11 rounded-xl" />
            </div>
          </div>
        </section>

        {/* 카드 등록 및 결제 시 유의사항 */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={18} className="text-gray-700" />
            <h2 className="text-[15px] font-bold text-gray-900">카드 등록 및 결제 시 유의사항</h2>
          </div>
          {["카드 등록 시 주의 사항", "카드 결제 시 주의 사항"].map((item) => (
            <div key={item} className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-700">{item}</span>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          ))}
        </section>

        {/* 약관동의 */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📋</span>
            <h2 className="text-[15px] font-bold text-gray-900">약관동의</h2>
          </div>
          <p className="text-xs text-gray-400 mb-3">서비스이용을 위해 약관에 동의해 주세요</p>

          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={handleToggleAll}
              className="w-full flex items-center gap-3 px-4 py-3.5 bg-gray-50"
            >
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${agreeAll ? "border-[var(--dd-green)] bg-[var(--dd-green)]" : "border-gray-300"}`}>
                {agreeAll && <span className="text-white text-xs">✓</span>}
              </span>
              <span className="text-sm font-semibold text-gray-800">약관에 전체 동의 합니다</span>
            </button>
            {["전자금융거래 기본약관", "개인정보 처리방침"].map((term) => (
              <div key={term} className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${agreeAll ? "text-[var(--dd-green)]" : "text-gray-400"}`}>✓</span>
                  <span className="text-sm text-gray-700">{term}</span>
                </div>
                <span className="text-gray-400">›</span>
              </div>
            ))}
          </div>
        </section>

        <button
          disabled={!canSubmit}
          onClick={() => router.push("/profile/card")}
          className="h-12 rounded-xl bg-[var(--dd-green)] text-white font-semibold disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
        >
          등록하기
        </button>
      </div>
    </div>
  );
}
