"use client";

import { useState, useTransition, type MouseEvent } from "react";
import { CircleCheck } from "lucide-react";
import {
  sendEmailCodeAction,
  verifyEmailCodeAction,
} from "@/actions/auth-actions";
import { FormField } from "@/components/molecules/form-field";
import { InputBox } from "@/components/molecules/input-box";
import { Button } from "@/components/ui/button";
import { formatClock, useCountdown } from "@/hooks/use-countdown";

/** 다시 보내기까지 기다리는 시간 (버튼 연타로 메일 폭탄 막기) */
const RESEND_WAIT_SECONDS = 60;

/** 인증이 끝나면 폼에 같이 실려 가는 숨은 칸 이름 — 부모 폼이 FormData로 읽어요 */
export const EMAIL_VERIFIED_FIELD = "emailVerified";

/**
 * 인증 단계 — 함께 바뀌는 값(단계 · 안내 문구 · 테스트 번호)을 하나로 묶었어요.
 * "인증 완료인데 인증번호 안내가 남은" 같은 있을 수 없는 조합을 타입이 막아 줘요.
 */
type Verification =
  | { step: "idle"; emailMessage?: string }
  | {
      step: "sent";
      /** 보낸 시각 — 다시 보내면 바뀌어서 인증번호 칸을 `key`로 새로 그려요(칸 비우기) */
      sentAt: number;
      demoCode?: string;
      codeMessage?: string;
      emailMessage?: string;
    }
  | { step: "verified" };

type EmailVerificationProps = {
  /** 화면 검사 결과 (이메일 형식 · "인증을 먼저 해 주세요") — 인증을 마치면 안 보여요 */
  checkError?: string;
  /** 서버가 돌려준 이메일 칸 문구 — 인증을 마쳐도 보여요 */
  serverError?: string;
};

/**
 * 이메일 + [인증번호 받기] → 아래 인증번호 줄(남은 시간 · [확인]) → "✓ 인증됐어요".
 * 회원가입에서 쓰고, 나중에 비밀번호 찾기 같은 이메일 인증에도 다시 쓸 수 있어요.
 * 이메일 칸 이름은 `email`이라 감싼 `<form>`에 그대로 같이 보내져요.
 * 인증을 마치면 숨은 칸 `emailVerified=yes`도 같이 보내져요 — 부모는 콜백 없이 FormData로 알아요.
 *
 * @example
 * <EmailVerification checkError={clientErrors.email} serverError={state.errors?.email} />
 */
export function EmailVerification({
  checkError,
  serverError,
}: EmailVerificationProps) {
  // 가입이 서버에서 실패하면 React가 폼 칸을 비워요 → 이메일은 상태로 들고 있어야 "인증됐어요"와 함께 남아요
  const [email, setEmail] = useState("");
  const [verification, setVerification] = useState<Verification>({
    step: "idle",
  });
  const [isSending, startSending] = useTransition();
  const [isVerifying, startVerifying] = useTransition();
  const codeTimer = useCountdown(); // 인증번호 남은 시간
  const resendTimer = useCountdown(); // 다시 보내기 대기

  const verified = verification.step === "verified";
  const emailMessage =
    verification.step === "verified" ? undefined : verification.emailMessage;

  function changeEmail(next: string) {
    setEmail(next);
    // 이메일을 바꾸면 처음부터 (받은 번호는 이전 이메일 것이라서) — 한 번에 되돌려요
    if (verification.step !== "idle") codeTimer.stop();
    setVerification({ step: "idle" });
  }

  function sendCode() {
    startSending(async () => {
      const result = await sendEmailCodeAction(email);
      if (!result.ok) {
        setVerification((current) =>
          current.step === "verified"
            ? current
            : { ...current, emailMessage: result.message },
        );
        return;
      }
      setVerification({
        step: "sent",
        sentAt: Date.now(),
        demoCode: result.demoCode ?? undefined,
      });
      codeTimer.start(result.ttlSeconds);
      resendTimer.start(RESEND_WAIT_SECONDS);
    });
  }

  // 인증번호는 상태로 들고 있지 않고, [확인]을 누를 때 폼에서 꺼내요
  function verifyCode(event: MouseEvent<HTMLButtonElement>) {
    const code = String(
      new FormData(event.currentTarget.form ?? undefined).get("emailCode") ??
        "",
    );
    startVerifying(async () => {
      const result = await verifyEmailCodeAction(email, code);
      if (!result.ok) {
        setVerification((current) =>
          current.step === "sent"
            ? { ...current, codeMessage: result.message }
            : current,
        );
        return;
      }
      setVerification({ step: "verified" });
      codeTimer.stop();
    });
  }

  // 인증번호를 다시 치기 시작하면 틀렸다는 안내를 지워요
  function clearCodeMessage() {
    setVerification((current) =>
      current.step === "sent" && current.codeMessage
        ? { ...current, codeMessage: undefined }
        : current,
    );
  }

  const sendLabel = verified
    ? "인증 완료"
    : resendTimer.running
      ? `다시 보내기 (${resendTimer.remaining}초)`
      : verification.step === "sent"
        ? "다시 보내기"
        : "인증번호 받기";

  return (
    <div className="flex flex-col gap-3">
      {verified && (
        <input type="hidden" name={EMAIL_VERIFIED_FIELD} value="yes" />
      )}

      <FormField
        id="email"
        label="이메일"
        required
        error={
          emailMessage ?? (verified ? undefined : checkError) ?? serverError
        }
        description={
          verified ? (
            <span className="flex items-center gap-1 text-status-open">
              <CircleCheck className="size-3.5" aria-hidden />
              인증됐어요
            </span>
          ) : undefined
        }
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
              readOnly={verified}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              className="h-9 shrink-0 text-foreground enabled:cursor-pointer"
              disabled={verified || isSending || resendTimer.running}
              onClick={sendCode}
            >
              {isSending ? "보내는 중…" : sendLabel}
            </Button>
          </div>
        )}
      </FormField>

      {verification.step === "sent" && (
        <FormField
          id="emailCode"
          label="인증번호"
          required
          error={
            verification.codeMessage ??
            (codeTimer.finished
              ? "인증 시간이 지났어요. 인증번호를 다시 받아 주세요."
              : undefined)
          }
          description={
            verification.demoCode
              ? `🧪 테스트 서버라 메일 대신 알려 줘요 — 인증번호 ${verification.demoCode}`
              : undefined
          }
        >
          {(field) => (
            <div className="flex gap-2">
              <InputBox
                {...field}
                key={verification.sentAt}
                name="emailCode"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="6자리 숫자"
                onChange={clearCodeMessage}
                end={
                  <span className="font-mono text-xs text-attention">
                    {formatClock(codeTimer.remaining)}
                  </span>
                }
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                className="h-9 shrink-0 text-foreground enabled:cursor-pointer"
                disabled={isVerifying || codeTimer.finished}
                onClick={verifyCode}
              >
                {isVerifying ? "확인 중…" : "확인"}
              </Button>
            </div>
          )}
        </FormField>
      )}
    </div>
  );
}
