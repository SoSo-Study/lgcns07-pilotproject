"use client";

import { useActionState, useState, useTransition, type FormEvent } from "react";
import {
  requestPasswordResetAction,
  resetPasswordAction,
  type ResetPasswordState,
} from "@/actions/auth-actions";
import { SubmitButton } from "@/components/atoms/submit-button";
import { FormAlert } from "@/components/molecules/form-alert";
import { FormField } from "@/components/molecules/form-field";
import { InputBox } from "@/components/molecules/input-box";
import { PasswordInput } from "@/components/molecules/password-input";
import { Button } from "@/components/ui/button";
import { RESET_RESEND_WAIT_SECONDS } from "@/config/password-reset-limit";
import { useCountdown } from "@/hooks/use-countdown";
import { fieldErrors } from "@/lib/field-errors";
import { passwordResetSchema } from "@/schema/auth-schema";

/**
 * 비밀번호 찾기 카드 안쪽 — 한 화면에서 두 단계예요.
 * 1. 이메일 + [보안키 받기] → 보안키를 메일로 보내요 (`requestPasswordResetAction`)
 * 2. 보안키 · 새 비밀번호 · 확인 + [비밀번호 바꾸기] (`resetPasswordAction`)
 *    → 성공하면 서버 액션이 로그인 화면(`?notice=password-reset`)으로 보내요
 *
 * 🔒 가입한 이메일인지 아닌지는 알려 주지 않아요 (어느 쪽이든 같은 안내).
 * 🔒 이메일 · 보안키를 주소(?email=)에 싣지 않으려고 화면을 나누지 않았어요.
 *
 * @example
 * <PasswordResetForm />
 */
export function PasswordResetForm() {
  const [state, formAction] = useActionState<ResetPasswordState, FormData>(
    resetPasswordAction,
    {},
  );
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false); // 보안키를 보냈는지 (2단계 칸을 보여 줄지)
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const [demoToken, setDemoToken] = useState<string | null>(null);
  const [clientErrors, setClientErrors] = useState<
    ResetPasswordState["errors"]
  >({});
  const [isSending, startSending] = useTransition();
  const resendTimer = useCountdown(); // 다시 보내기 대기

  function changeEmail(next: string) {
    setEmail(next);
    setEmailMessage(null);
    // 보낸 뒤에 이메일을 바꾸면 처음부터 (받은 보안키는 이전 이메일 것이라서)
    if (sent) {
      setSent(false);
      setSentMessage(null);
      setDemoToken(null);
      setClientErrors({});
    }
  }

  function sendToken() {
    startSending(async () => {
      const result = await requestPasswordResetAction(email);
      if (!result.ok) {
        setEmailMessage(result.message);
        return;
      }
      setSent(true);
      setSentMessage(result.message);
      setDemoToken(result.demoToken ?? null);
      resendTimer.start(RESET_RESEND_WAIT_SECONDS);
    });
  }

  // 보내기 전에 화면에서 먼저 검사 — 틀렸으면 서버로 보내지 않아요
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // 보안키를 받기 전에 Enter를 누르면 [보안키 받기]로
    if (!sent) {
      event.preventDefault();
      if (!isSending && !resendTimer.running) sendToken();
      return;
    }
    const formData = new FormData(event.currentTarget);
    const parsed = passwordResetSchema.safeParse({
      email: formData.get("email") ?? "",
      token: formData.get("token") ?? "",
      password: formData.get("password") ?? "",
      passwordConfirm: formData.get("passwordConfirm") ?? "",
    });
    const errors = parsed.success ? {} : fieldErrors(parsed.error);

    setClientErrors(errors);
    if (Object.keys(errors).length > 0) {
      event.preventDefault(); // form action(서버로 보내기)을 멈춰요
    }
  }

  // 화면 검사 결과가 먼저, 서버가 돌려준 결과는 그다음
  const errors = { ...state.errors, ...clientErrors };

  const sendLabel = resendTimer.running
    ? `다시 보내기 (${resendTimer.remaining}초)`
    : sent
      ? "다시 보내기"
      : "보안키 받기";

  return (
    <form
      noValidate
      action={formAction}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      {/* ── 1단계: 이메일 + 보안키 받기 ── */}
      <FormField
        id="email"
        label="가입한 이메일"
        error={emailMessage ?? errors.email}
      >
        {(field) => (
          <div className="flex gap-2">
            <InputBox
              {...field}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@soso.study"
              value={email}
              onChange={(event) => changeEmail(event.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              className="h-9 shrink-0 text-foreground enabled:cursor-pointer"
              disabled={isSending || resendTimer.running}
              onClick={sendToken}
            >
              {isSending ? "보내는 중…" : sendLabel}
            </Button>
          </div>
        )}
      </FormField>

      {/* ── 2단계: 보안키 + 새 비밀번호 (보안키를 보낸 뒤에만) ── */}
      {sent && (
        <>
          {sentMessage && <FormAlert>{sentMessage}</FormAlert>}

          <FormField
            id="token"
            label="보안키"
            required
            error={errors.token}
            description={
              demoToken
                ? `🧪 테스트 서버라 메일 대신 알려 줘요 — 보안키 ${demoToken}`
                : undefined
            }
          >
            {(field) => (
              <InputBox
                {...field}
                name="token"
                autoComplete="one-time-code"
                placeholder="메일로 받은 보안키"
                className="font-mono"
              />
            )}
          </FormField>

          <FormField
            id="password"
            label="새 비밀번호"
            required
            error={errors.password}
          >
            {(field) => (
              <PasswordInput
                {...field}
                name="password"
                autoComplete="new-password"
                placeholder="8자 이상 (72자까지)"
              />
            )}
          </FormField>

          <FormField
            id="passwordConfirm"
            label="새 비밀번호 확인"
            required
            error={errors.passwordConfirm}
          >
            {(field) => (
              <PasswordInput
                {...field}
                name="passwordConfirm"
                autoComplete="new-password"
                placeholder="한 번 더 입력하세요"
              />
            )}
          </FormField>

          {state.formError && (
            <FormAlert tone="error">{state.formError}</FormAlert>
          )}

          <SubmitButton pendingText="바꾸는 중…" className="w-full">
            비밀번호 바꾸기
          </SubmitButton>
        </>
      )}
    </form>
  );
}
