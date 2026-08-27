"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  back?: boolean;
  onBack?: () => void;
}

export function PageHeader({ title, back = false, onBack }: PageHeaderProps) {
  const router = useRouter();
  return (
    <header className="sticky top-0 bg-white z-10 border-b border-gray-100">
      <div className="flex items-center h-14 px-4 relative">
        {back && (
          <button
            onClick={onBack ?? (() => router.back())}
            className="absolute left-4 p-1 text-gray-600"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <h1 className="w-full text-center text-base font-semibold">{title}</h1>
      </div>
    </header>
  );
}
