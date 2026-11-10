import type { ComponentProps } from "react";
import { CircleCheck, CircleDot } from "lucide-react";
import { Pill } from "@/components/atoms/pill";
import type { StudyStatus } from "@/types/study";

// 스터디 상태 → Pill 글자·색·아이콘
const statusPill = {
  OPEN: { label: "모집 중", tone: "success", icon: CircleDot },
  CLOSED: { label: "마감", tone: "done", icon: CircleCheck },
} as const satisfies Record<
  StudyStatus,
  Pick<ComponentProps<typeof Pill>, "tone" | "icon"> & { label: string }
>;

type StatusBadgeProps = Omit<
  ComponentProps<typeof Pill>,
  "tone" | "icon" | "children"
> & {
  /** 스터디 상태 (OPEN = 모집 중, CLOSED = 마감) */
  status: StudyStatus;
};

/**
 * 피그마 StatusBadge — 스터디 모집 상태 (모집 중: 초록 / 마감: 보라).
 * 스터디 상태 전용 지름길이에요. 다른 글자가 필요하면 `Pill`을 바로 쓰세요.
 *
 * @example
 * <StatusBadge status={study.status} />
 * <Pill tone="success" outlined>신청 대기</Pill> // 다른 글자는 Pill로
 */
export function StatusBadge({ status, ...props }: StatusBadgeProps) {
  const { label, tone, icon } = statusPill[status];

  return (
    <Pill tone={tone} icon={icon} outlined {...props}>
      {label}
    </Pill>
  );
}
