import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type AuthCardProps = Omit<ComponentProps<"section">, "title"> & {
  /** 카드 위 큰 제목 (h1) */
  title: ReactNode;
  /** 카드 아래 바깥 자리 (예: "처음이신가요? 회원가입") */
  footer?: ReactNode;
};

/**
 * 로그인 · 회원가입 · 찾기 화면 공통 틀 — 제목 + 테두리 카드 + 카드 아래 자리.
 * 로고는 `app/(auth)/layout.tsx`가 그려요. 너비는 `className`(예: `max-w-xs`)으로 정해요.
 *
 * @example
 * <AuthCard title="soso.study에 로그인" className="max-w-xs" footer={<p>처음이신가요? …</p>}>
 *   <LoginForm … />
 * </AuthCard>
 */
export function AuthCard({
  title,
  footer,
  className,
  children,
  ...props
}: AuthCardProps) {
  return (
    <section
      className={cn("mx-auto flex w-full flex-col gap-4", className)}
      {...props}
    >
      <h1 className="text-center text-xl font-normal text-balance">{title}</h1>
      <div className="rounded-md border border-border bg-card p-4">
        {children}
      </div>
      {footer}
    </section>
  );
}
