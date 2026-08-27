"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PenLine, Link2, CreditCard, User } from "lucide-react";

const tabs = [
  { href: "/home", label: "홈", icon: Home },
  { href: "/contract", label: "계약등록", icon: PenLine },
  { href: "/b2b", label: "비즈링크", icon: Link2 },
  { href: "/profile/card", label: "카드등록", icon: CreditCard },
  { href: "/profile", label: "내정보", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-200 z-50">
      <div className="flex">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium transition-colors ${
                active ? "text-[var(--dd-green)]" : "text-gray-400"
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
