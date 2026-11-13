"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitButton } from "@/components/atoms/submit-button";
import { FormAlert } from "@/components/molecules/form-alert";
import { FormField } from "@/components/molecules/form-field";
import { InputBox } from "@/components/molecules/input-box";
import { PasswordInput } from "@/components/molecules/password-input";
import { useFlashNotice } from "@/hooks/use-flash-notice";
import type { AuthNotice } from "@/config/auth-notice";
import { routes } from "@/config/routes";
import { fieldErrors } from "@/lib/field-errors";
import { requestLogin } from "@/lib/login-request";
import { loginSchema, type LoginValues } from "@/schema/auth-schema";

type LoginFormProps = {
  /** 로그인 뒤 갈 주소 (page에서 safeCallbackUrl로 검사한 값) */
  callbackUrl: string;
  /** 폼 위 안내 (page에서 getAuthNotice로 고른 값) */
  notice?: AuthNotice | null;
};

/**
 * 피그마 ⑤ 로그인 카드 안쪽 — 이메일 · 비밀번호 · 안내 상자 · 로그인 버튼.
 * 칸 검사는 zod(`loginSchema`), 로그인 요청은 `requestLogin` 하나로만 보내요.
 *
 * @example
 * <LoginForm callbackUrl="/studies" notice={getAuthNotice("logged-out")} />
 */
export function LoginForm({ callbackUrl, notice }: LoginFormProps) {
  const router = useRouter();
  const passwordRef = useRef<HTMLInputElement>(null);
  // 칸 아래 문구(fields)와 버튼 위 실패 문구(form)는 늘 같이 바뀌어서 상태 하나로 들고 있어요
  const [result, setResult] = useState<{
    fields?: Partial<Record<keyof LoginValues, string>>;
    form?: string;
  }>({});
  const [isPending, startTransition] = useTransition();
  // 안내(로그아웃했어요 등)는 잠깐만: 글자 입력 · 제출 · 5초 뒤 사라지고, 새로고침해도 안 보여요
  const [noticeVisible, hideNotice] = useFlashNotice(Boolean(notice));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // 브라우저가 페이지를 새로 불러오지 않게
    hideNotice();
    const formData = new FormData(event.currentTarget);

    // 1. 칸 검사 — 틀리면 칸 아래에 문구, 요청은 보내지 않아요
    const parsed = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    if (!parsed.success) {
      setResult({ fields: fieldErrors(parsed.error) });
      return;
    }
    setResult({});

    // 2. 로그인 요청 — 기다리는 동안 isPending = true (버튼 잠김)
    startTransition(async () => {
      const login = await requestLogin(parsed.data);
      if (!login.ok) {
        setResult({ form: login.message });
        if (passwordRef.current) passwordRef.current.value = ""; // 비밀번호만 비우기
        passwordRef.current?.focus();
        return;
      }
      // 3. 성공 — replace: 뒤로 가기를 눌러도 로그인 화면으로 돌아오지 않게
      router.replace(callbackUrl);
      router.refresh(); // 서버 화면을 로그인 상태로 다시 그리기
    });
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      onInput={hideNotice}
      className="flex flex-col gap-4"
    >
      {/* 안내(로그아웃했어요 등)는 맨 위에 잠깐 */}
      {notice && noticeVisible && (
        <FormAlert tone={notice.tone}>{notice.message}</FormAlert>
      )}

      <FormField id="email" label="이메일" error={result.fields?.email}>
        {(field) => (
          <InputBox
            {...field}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="이메일을 입력하세요"
          />
        )}
      </FormField>

      <FormField
        id="password"
        label="비밀번호"
        error={result.fields?.password}
        labelEnd={
          <Link
            href={routes.forgotPassword}
            className="text-xs text-link hover:underline"
          >
            비밀번호를 잊으셨나요?
          </Link>
        }
      >
        {(field) => (
          <PasswordInput
            {...field}
            ref={passwordRef}
            name="password"
            autoComplete="current-password"
          />
        )}
      </FormField>

      {/* 실패 문구는 피그마 ⑤처럼 버튼 바로 위 */}
      {result.form && <FormAlert tone="error">{result.form}</FormAlert>}

      <SubmitButton
        pending={isPending}
        pendingText="로그인 중…"
        className="w-full"
      >
        로그인
      </SubmitButton>
    </form>
  );
}
