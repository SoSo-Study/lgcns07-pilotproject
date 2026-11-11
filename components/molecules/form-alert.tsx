import type { ComponentProps } from "react";
import { CircleAlert, CircleCheck, Info, type LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

// 색은 "뜻" 이름으로 (globals.css)
const formAlertVariants = cva("", {
  variants: {
    tone: {
      error: "border-destructive/60 bg-danger-subtle text-destructive",
      info: "border-link/40 bg-link-subtle text-foreground",
      success: "border-status-open/60 bg-status-open-subtle text-status-open",
    },
  },
  defaultVariants: {
    tone: "info",
  },
});

type Tone = NonNullable<VariantProps<typeof formAlertVariants>["tone"]>;

const toneIcons: Record<Tone, LucideIcon> = {
  error: CircleAlert,
  info: Info,
  success: CircleCheck,
};

type FormAlertProps = Omit<ComponentProps<typeof Alert>, "variant"> &
  VariantProps<typeof formAlertVariants>;

/**
 * 폼 위 안내 상자 — 로그인 실패, "로그아웃했어요" 같은 폼 전체에 대한 한 줄.
 * shadcn `Alert` 위에 만들었어요. 글자는 `children`으로 넣어요.
 *
 * - `tone`: error(빨강) · info(파랑, 기본) · success(초록) — 아이콘도 같이 바뀌어요
 * - error는 화면 읽기 프로그램이 바로 끼어들어 읽고(`role="alert"`),
 *   info · success는 하던 말을 마치고 읽어요(`role="status"`)
 *
 * @example
 * <FormAlert tone="error">이메일 또는 비밀번호가 맞지 않아요.</FormAlert>
 * <FormAlert>로그아웃했어요.</FormAlert>
 * <FormAlert tone="success">가입했어요. 로그인해 주세요.</FormAlert>
 */
export function FormAlert({
  tone,
  className,
  children,
  ...props
}: FormAlertProps) {
  const Icon = toneIcons[tone ?? "info"];

  return (
    <Alert
      role={tone === "error" ? "alert" : "status"}
      className={cn(formAlertVariants({ tone }), className)}
      {...props}
    >
      <Icon aria-hidden />
      <AlertDescription className="text-current">{children}</AlertDescription>
    </Alert>
  );
}
