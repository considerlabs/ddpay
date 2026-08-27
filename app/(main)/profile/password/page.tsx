"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockUser } from "@/lib/mock-data";

export default function PasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"request" | "change">("request");
  const [phone, setPhone] = useState(mockUser.phone);
  const [otp, setOtp] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [sent, setSent] = useState(false);

  function handleSend() {
    setSent(true);
    setTimeout(() => setStep("change"), 800);
  }

  function handleChange() {
    if (newPw !== confirmPw) return;
    router.back();
  }

  if (step === "change") {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <PageHeader title="비밀번호 변경" back />
        <div className="px-4 py-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm text-gray-500">인증번호</Label>
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              placeholder="인증번호 6자리 입력"
              className="h-12 rounded-xl bg-white"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm text-gray-500">새 비밀번호</Label>
            <Input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="새 비밀번호 입력"
              className="h-12 rounded-xl bg-white"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm text-gray-500">새 비밀번호 확인</Label>
            <Input
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="새 비밀번호 재입력"
              className="h-12 rounded-xl bg-white"
            />
            {confirmPw && newPw !== confirmPw && (
              <p className="text-xs text-red-500">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>
          <button
            onClick={handleChange}
            disabled={!otp || !newPw || newPw !== confirmPw}
            className="h-12 rounded-xl bg-[var(--dd-orange)] text-white font-semibold disabled:bg-gray-200 disabled:text-gray-400"
          >
            변경하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PageHeader title="인증번호 요청" back />
      <div className="px-4 py-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-gray-500">아이디</Label>
          <Input value={mockUser.id} disabled className="h-12 rounded-xl bg-white" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-gray-500">인증 단말기 번호</Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            inputMode="numeric"
            className="h-12 rounded-xl bg-white"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!phone || sent}
          className="h-12 rounded-xl bg-[var(--dd-orange)] text-white font-semibold disabled:opacity-60"
        >
          {sent ? "전송 완료..." : "인증번호 전송"}
        </button>
      </div>
    </div>
  );
}
