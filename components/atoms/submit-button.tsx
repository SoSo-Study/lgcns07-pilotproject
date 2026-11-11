"use client";

import type { ComponentProps, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type SubmitButtonProps = Omit<ComponentProps<typeof Button>, "type"> & {
  /** 보내는 중인지 직접 알려 줄 때 (없으면 감싼 `<form action>`의 상태를 따라가요) */
  pending?: boolean;
  /** 보내는 중에 보일 글자 (예: "로그인 중…") */
  pendingText?: ReactNode;
};

/**
 * 폼 제출 버튼 — 보내는 중이면 잠기고 글자가 바뀌어요(연타 방지).
 * shadcn `Button` 위에 만들었고, `variant` · `size` · `className`은 그대로 써요.
 *
 * - 서버 액션 폼(`<form action={…}>`) 안: 보내는 중인지 알아서 알아요(`useFormStatus`)
 * - 직접 처리하는 폼(`onSubmit`): `pending`을 넘겨 주세요
 *
 * @example
 * <SubmitButton pendingText="가입 중…">가입하기</SubmitButton>
 * <SubmitButton pending={isPending} pendingText="로그인 중…" className="w-full">로그인</SubmitButton>
 */
export function SubmitButton({
  pending,
  pendingText,
  disabled,
  children,
  ...props
}: SubmitButtonProps) {
  const form = useFormStatus();
  const isPending = pending ?? form.pending;

  return (
    <Button
      type="submit"
      disabled={disabled || isPending}
      aria-busy={isPending || undefined}
      {...props}
    >
      {isPending && (
        <LoaderCircle aria-hidden className="motion-safe:animate-spin" />
      )}
      {isPending ? (pendingText ?? children) : children}
    </Button>
  );
}
