"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockUser } from "@/lib/mock-data";

export default function SenderNamePage() {
  const router = useRouter();
  const [newName, setNewName] = useState("");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PageHeader title="송금자 명칭설정" back />

      <div className="px-4 py-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-gray-500">기존 송금자 명칭</Label>
          <Input value={mockUser.senderName} disabled className="h-12 rounded-xl bg-white" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-gray-500">변경할 송금자 명칭</Label>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="변경할 송금자 명칭을 입력해주세요."
            className="h-12 rounded-xl bg-white"
          />
        </div>
        <button
          onClick={() => router.back()}
          disabled={!newName.trim()}
          className="h-12 rounded-xl bg-[var(--dd-orange)] text-white font-semibold disabled:bg-gray-200 disabled:text-gray-400"
        >
          저장
        </button>
      </div>
    </div>
  );
}
