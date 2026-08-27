interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  승인완료: "text-[var(--dd-green)]",
  승인대기: "text-gray-400",
  반려: "text-red-500",
  결제완료: "text-gray-700",
  결제실패: "text-red-500",
  결제대기: "text-gray-400",
  송금완료: "text-[var(--dd-green)]",
  송금대기: "text-gray-400",
  송금실패: "text-red-500",
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  return (
    <span className={`text-sm font-medium ${statusStyles[status] ?? "text-gray-500"} ${className}`}>
      {status}
    </span>
  );
}
