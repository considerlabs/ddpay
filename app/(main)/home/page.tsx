"use client";
import Link from "next/link";
import { ChevronRight, CreditCard } from "lucide-react";
import { mockUser, mockContracts, getMonthlyStats } from "@/lib/mock-data";

const stats = getMonthlyStats(mockContracts);

export default function HomePage() {
  return (
    <div className="flex flex-col pb-2">
      {/* Top header */}
      <header className="flex items-center justify-between px-5 pt-12 pb-3">
        <span className="text-sm font-semibold text-gray-800">
          깐부치킨 울릉도점 님
        </span>
        <div className="flex items-center gap-1">
          <span className="text-xs font-black tracking-widest text-[var(--dd-green)]">DDPAY</span>
        </div>
      </header>

      {/* Promotional banner */}
      <div className="mx-4 mb-4 rounded-2xl bg-[var(--dd-green)] overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div className="flex-1">
            <p className="text-[10px] text-green-200 mb-1">물류, 인건비, 경조사비까지</p>
            <h2 className="text-[17px] font-black text-white leading-snug">
              복잡한 관리비용<br />이젠 후대폰 하나로<br />해결하세요!
            </h2>
            <p className="text-[10px] text-green-200 mt-2 leading-relaxed">
              현금결제가 필요한 모든 송금,<br />
              <span className="text-white font-bold">"디디페이"</span>는 쉽고, 효율적인<br />
              결제 솔루션을 제공합니다.
            </p>
          </div>
          <div className="w-24 h-24 flex items-center justify-center">
            <div className="w-20 h-28 bg-white/20 rounded-2xl flex items-center justify-center">
              <div className="w-14 h-20 bg-white/30 rounded-xl" />
            </div>
          </div>
        </div>
        {/* Dots */}
        <div className="flex justify-center gap-1.5 pb-3">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-white" : "bg-white/30"}`} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4">
        {/* 결제카드 등록 */}
        <Link
          href="/profile/card"
          className="flex items-center justify-between px-4 py-3.5 bg-white rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <CreditCard size={16} className="text-orange-400" />
            </div>
            <span className="text-sm font-medium">결제카드등록</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-5 h-5 rounded-full bg-[var(--dd-green)] text-white text-[10px] flex items-center justify-center font-bold">
              {mockUser.cards.length}
            </span>
            <ChevronRight size={16} className="text-gray-400" />
          </div>
        </Link>

        {/* 계약결제 서비스 */}
        <section>
          <h3 className="text-sm font-bold text-gray-800 mb-2">계약결제 서비스</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { href: "/contract", label: "계약등록", emoji: "📝" },
              { href: "/status", label: "등록현황", emoji: "📋" },
              { href: "/payments", label: "결제내역", emoji: "💳" },
            ].map(({ href, label, emoji }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center gap-2 py-4 bg-white rounded-2xl shadow-sm border border-gray-100"
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-xs font-medium text-gray-700">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 이번달 등록 현황 */}
        <section>
          <h3 className="text-sm font-bold text-gray-800 mb-2">이번달 등록 현황</h3>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: "승인대기", value: stats.pending, color: "text-gray-400" },
                { label: "반려", value: stats.rejected, color: "text-red-400" },
                { label: "승인완료", value: stats.approved, color: "text-[var(--dd-green)]" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex flex-col items-center gap-0.5">
                  <span className={`text-xl font-black ${color}`}>{String(value).padStart(2, "0")}</span>
                  <span className="text-[10px] text-gray-400">{label}</span>
                  <span className="text-[10px] text-gray-400">건</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 비즈링크 카드결제 서비스 */}
        <section>
          <h3 className="text-sm font-bold text-gray-800 mb-2">비즈링크 카드결제 서비스</h3>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "B2B구매대행 바로가기", href: "/b2b" },
                { label: "구매내역", href: "/payments" },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-center py-5 bg-gray-100 rounded-xl text-sm font-medium text-gray-700 text-center leading-tight"
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col divide-y divide-gray-100">
              {[
                { label: "공급자등록", href: "/b2b/supplier-register" },
                { label: "공급자 승인내역", href: "/b2b/supplier-status" },
              ].map(({ label, href }) => (
                <Link key={href} href={href} className="flex items-center justify-between py-3 text-sm text-gray-700">
                  {label}
                  <ChevronRight size={14} className="text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 식재재 새벽배송 서비스 */}
        <section>
          <h3 className="text-sm font-bold text-gray-800 mb-2">식자재몰 새벽배송 서비스</h3>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-2 divide-x divide-gray-50">
              {[
                { label: "🛒 식자재몰 바로가기" },
                { label: "💬 서비스문의" },
              ].map(({ label }) => (
                <button key={label} className="flex items-center justify-center gap-1 px-3 py-3.5 text-sm text-gray-700">
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
