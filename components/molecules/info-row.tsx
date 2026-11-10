import type { ComponentProps } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type InfoRowProps = ComponentProps<"div"> & {
  /** 이름 앞 아이콘 (lucide 아이콘 컴포넌트, 예: Users) */
  icon: LucideIcon;
  /** 왼쪽 이름 (예: 모집 인원) */
  label: string;
};

/**
 * 피그마 ② 정보 카드 한 줄 — 아이콘 + 이름 ······ 값(children).
 * `<dl>` 안에 넣어서 써요 (이름 = dt, 값 = dd).
 *
 * @example
 * <dl>
 *   <InfoRow icon={Users} label="모집 인원">4 / 5명</InfoRow>
 *   <InfoRow icon={CalendarDays} label="마감일">2026.11.18 (D-8)</InfoRow>
 * </dl>
 */
export function InfoRow({
  icon: Icon,
  label,
  children,
  className,
  ...props
}: InfoRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 text-sm",
        className,
      )}
      {...props}
    >
      <dt className="flex shrink-0 items-center gap-2 whitespace-nowrap text-muted-foreground">
        <Icon className="size-4" aria-hidden />
        {label}
      </dt>
      <dd className="font-mono text-foreground">{children}</dd>
    </div>
  );
}
