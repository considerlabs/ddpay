"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mockUser } from "@/lib/mock-data";
import { ChevronRight, Lock, CreditCard, User, Bell, LogOut, BarChart3 } from "lucide-react";

const menuItems = [
  { href: "/profile/password", label: "비밀번호 변경", icon: Lock },
  { href: "/profile/card", label: "결제카드 등록 및 관리", icon: CreditCard },
  { href: "/profile/sender-name", label: "계약결제 송금자명 설정", icon: User },
  { href: "/profile/limit", label: "결제승인한도", icon: BarChart3 },
  { href: "/profile/push", label: "푸시 알림 설정", icon: Bell },
];

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col">
      <header className="flex items-center justify-center h-14 border-b border-gray-100">
        <h1 className="text-base font-semibold">내정보</h1>
      </header>

      <div className="flex flex-col gap-3 px-4 py-4">
        {/* User info card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          {[
            { label: "아이디", value: mockUser.id },
            { label: "가맹점명", value: mockUser.storeName },
            { label: "코드", value: mockUser.storeCode },
            { label: "버전", value: mockUser.version },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">{label}</span>
              <span className="text-sm text-gray-900 font-medium text-right max-w-[60%] leading-snug">{value}</span>
            </div>
          ))}
        </div>

        {/* Menu items */}
        <div className="flex flex-col gap-2">
          {menuItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3.5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className="text-gray-400" />
                <span className="text-sm text-gray-800">{label}</span>
              </div>
              <ChevronRight size={16} className="text-[var(--dd-orange)]" />
            </Link>
          ))}

          <button
            onClick={() => router.push("/login")}
            className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3.5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <LogOut size={18} className="text-gray-400" />
              <span className="text-sm text-gray-800">로그아웃</span>
            </div>
            <ChevronRight size={16} className="text-[var(--dd-orange)]" />
          </button>
        </div>
      </div>
    </div>
  );
}
