import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function B2BPage() {
  return (
    <div className="flex flex-col">
      <header className="flex items-center justify-center h-14 border-b border-gray-100">
        <h1 className="text-base font-semibold">B2B도매몰</h1>
      </header>

      <div className="px-4 py-5 flex flex-col gap-4">
        {/* BIZLINK */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
            <span className="text-blue-600 font-black text-sm">𝔹</span>
            <span className="text-blue-600 font-bold text-sm">BIZLINK</span>
            <span className="text-xs text-gray-400 ml-1">카드결제 서비스</span>
          </div>
          {[
            { label: "B2B공급자 정보등록", href: "/b2b/supplier-register", desc: "거래처 공급자를 등록합니다" },
            { label: "도매몰 공급자 승인현황", href: "/b2b/supplier-status", desc: "등록한 공급자 승인 상태 확인" },
            { label: "구매내역", href: "/payments", desc: "B2B 구매 내역 조회" },
          ].map(({ label, href, desc }) => (
            <Link key={href} href={href} className="flex items-center justify-between px-4 py-3.5 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-800">{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
