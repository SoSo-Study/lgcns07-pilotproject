import { CircleCheck, CircleDot } from "lucide-react";
import type { StudyStatus } from "@/types/study";
import { cn } from "@/lib/utils";

const statusStyle: Record<
  StudyStatus,
  { label: string; className: string; Icon: typeof CircleDot }
> = {
  OPEN: {
    label: "모집 중",
    className: "border-status-open bg-status-open-subtle text-status-open",
    Icon: CircleDot,
  },
  CLOSED: {
    label: "마감",
    className:
      "border-status-closed bg-status-closed-subtle text-status-closed",
    Icon: CircleCheck,
  },
};

type StatusBadgeProps = {
  status: StudyStatus;
  className?: string;
};

// 피그마 StatusBadge — 모집 중(초록) / 마감(보라)
// 사용: <StatusBadge status={study.status} />
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, className: color, Icon } = statusStyle[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        color,
        className,
      )}
    >
      <Icon className="size-3" aria-hidden />
      {label}
    </span>
  );
}
