import type { ComponentProps } from "react";
import type { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// 색은 "뜻" 이름으로 (globals.css의 GitHub Primer 이름과 같음)
const pillVariants = cva("", {
  variants: {
    tone: {
      neutral: "border-border bg-muted text-muted-foreground",
      success: "border-status-open bg-status-open-subtle text-status-open",
      done: "border-status-closed bg-status-closed-subtle text-status-closed",
      accent: "border-link bg-link-subtle text-link",
      danger: "border-destructive bg-destructive/10 text-destructive",
    },
    outlined: {
      true: "",
      false: "border-transparent",
    },
  },
  defaultVariants: {
    tone: "neutral",
    outlined: false,
  },
});

type PillProps = Omit<ComponentProps<typeof Badge>, "variant"> &
  VariantProps<typeof pillVariants> & {
    /** 글자 앞 아이콘 (lucide 아이콘 컴포넌트) */
    icon?: LucideIcon;
  };

/**
 * 작은 둥근 글자표 — 상태, 태그, 개수 등 어디서든 글자와 색만 바꿔 써요.
 * shadcn `Badge` 위에 만들었고, `<span>` 속성(`aria-*`, `className`, `render`)은 그대로 전달돼요.
 *
 * - `tone`: neutral(회색, 기본) · success(초록) · done(보라) · accent(파랑) · danger(빨강)
 * - `outlined`: 테두리 보이기 (기본 false)
 * - `icon`: 글자 앞 아이콘
 *
 * @example
 * <Pill tone="success" icon={CircleDot} outlined>모집 중</Pill>
 * <Pill tone="accent">React</Pill>
 * <Pill>D-3</Pill>
 * <Pill tone="accent" render={<Link href="/studies?tag=React" />}>React</Pill>
 */
export function Pill({
  tone,
  outlined,
  icon: Icon,
  className,
  children,
  ...props
}: PillProps) {
  return (
    <Badge
      variant="outline"
      className={cn(pillVariants({ tone, outlined }), className)}
      {...props}
    >
      {Icon && <Icon data-icon="inline-start" aria-hidden />}
      {children}
    </Badge>
  );
}
