"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !password) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }
    router.push("/home");
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-center h-14 border-b border-gray-100">
        <span className="text-sm font-bold tracking-wider text-[var(--dd-green)]">DD·PAY</span>
      </div>

      {/* Logo area */}
      <div className="flex-1 flex flex-col px-6 pt-12 pb-6">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-dd-green-light mb-4">
            <span className="text-2xl font-black text-[var(--dd-green)]">DD</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">디디페이</h1>
          <p className="text-sm text-gray-500 mt-1">가맹점 결제 관리 서비스</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="id" className="text-sm text-gray-700">아이디</Label>
            <Input
              id="id"
              placeholder="아이디를 입력하세요"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="h-12 rounded-xl border-gray-200 focus:border-[var(--dd-green)]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password" className="text-sm text-gray-700">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-xl border-gray-200"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            className="h-12 rounded-xl bg-[var(--dd-green)] text-white font-semibold text-[15px] mt-2 active:opacity-90"
          >
            로그인
          </button>
        </form>

        <p className="text-xs text-center text-gray-400 mt-6">
          테스트 계정: 아무 아이디/비밀번호 입력
        </p>
      </div>
    </div>
  );
}
