import { BottomNav } from "@/components/bottom-nav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen pb-16">
      {children}
      <BottomNav />
    </div>
  );
}
