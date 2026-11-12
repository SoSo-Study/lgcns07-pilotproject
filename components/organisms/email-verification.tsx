"use client";

import { useState, useTransition } from "react";
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

type Status = "idle" | "sent" | "verified";

type EmailVerificationProps = {
  /** 이메일 칸 에러 (부모 폼의 칸 검사 결과) */
  error?: string;
  /** 인증을 마치면 그 이메일, 이메일을 바꾸면 null을 알려 줘요 */
  onVerifiedChange: (email: string | null) => void;
};

/**
 * 이메일 + [인증번호 받기] → 아래 인증번호 줄(남은 시간 · [확인]) → "✓ 인증됐어요".
 * 회원가입에서 쓰고, 나중에 비밀번호 찾기 같은 이메일 인증에도 다시 쓸 수 있어요.
 * 이메일 칸 이름은 `email`이라 감싼 `<form>`에 그대로 같이 보내져요.
 *
 * @example
 * <EmailVerification error={errors.email} onVerifiedChange={setVerifiedEmail} />
 */
export function EmailVerification({
  error,
  onVerifiedChange,
}: EmailVerificationProps) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [codeMessage, setCodeMessage] = useState<string | null>(null);
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [isSending, startSending] = useTransition();
  const [isVerifying, startVerifying] = useTransition();
  const codeTimer = useCountdown(); // 인증번호 남은 시간
  const resendTimer = useCountdown(); // 다시 보내기 대기

  const verified = status === "verified";

  function changeEmail(next: string) {
    setEmail(next);
    // 보낸 뒤에 이메일을 바꾸면 처음부터 (받은 번호는 이전 이메일 것이라서)
    if (status !== "idle") {
      setStatus("idle");
      setCode("");
      setDemoCode(null);
      setCodeMessage(null);
      codeTimer.stop();
      onVerifiedChange(null);
    }
    setEmailMessage(null);
  }

  function sendCode() {
    startSending(async () => {
      const result = await sendEmailCodeAction(email);
      if (!result.ok) {
        setEmailMessage(result.message);
        return;
      }
      setStatus("sent");
      setCode("");
      setCodeMessage(null);
      setDemoCode(result.demoCode ?? null);
      codeTimer.start(result.ttlSeconds);
      resendTimer.start(RESEND_WAIT_SECONDS);
    });
  }

  function verifyCode() {
    startVerifying(async () => {
      const result = await verifyEmailCodeAction(email, code);
      if (!result.ok) {
        setCodeMessage(result.message);
        return;
      }
      setStatus("verified");
      codeTimer.stop();
      onVerifiedChange(email);
    });
  }

  const sendLabel = verified
    ? "인증 완료"
    : resendTimer.running
      ? `다시 보내기 (${resendTimer.remaining}초)`
      : status === "sent"
        ? "다시 보내기"
        : "인증번호 받기";

  return (
    <div className="flex flex-col gap-3">
      <FormField
        id="email"
        label="이메일"
        required
        error={emailMessage ?? error}
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

      {status === "sent" && (
        <FormField
          id="emailCode"
          label="인증번호"
          required
          error={
            codeMessage ??
            (codeTimer.finished
              ? "인증 시간이 지났어요. 인증번호를 다시 받아 주세요."
              : undefined)
          }
          description={
            demoCode
              ? `🧪 테스트 서버라 메일 대신 알려 줘요 — 인증번호 ${demoCode}`
              : undefined
          }
        >
          {(field) => (
            <div className="flex gap-2">
              <InputBox
                {...field}
                name="emailCode"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="6자리 숫자"
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  setCodeMessage(null);
                }}
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
