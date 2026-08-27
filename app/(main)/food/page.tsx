import { PageHeader } from "@/components/page-header";

export default function FoodPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="식자재몰" />
      <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
        준비 중입니다.
      </div>
    </div>
  );
}
