"use client";

import { useActionState, useState, type FormEvent } from "react";
import { signupAction, type SignupState } from "@/actions/auth-actions";
import { SubmitButton } from "@/components/atoms/submit-button";
import { FormAlert } from "@/components/molecules/form-alert";
import { FormField } from "@/components/molecules/form-field";
import { InputBox } from "@/components/molecules/input-box";
import { PasswordInput } from "@/components/molecules/password-input";
import {
  EMAIL_VERIFIED_FIELD,
  EmailVerification,
} from "@/components/organisms/email-verification";
import { fieldErrors } from "@/lib/field-errors";
import { signupSchema } from "@/schema/auth-schema";

const NOT_VERIFIED = "이메일 인증을 먼저 해 주세요";

/**
 * 피그마 ⑥ 회원가입 카드 안쪽 — 이메일 인증 · 닉네임 · 비밀번호 · 비밀번호 확인 · 가입하기.
 * 칸 검사는 화면에서 먼저(zod `signupSchema`), 가입은 서버 액션(`signupAction`)으로 보내요.
 * 가입하면 서버 액션이 로그인 화면(`?notice=signed-up`)으로 보내요.
 *
 * @example
 * <SignupForm />
 */
export function SignupForm() {
  const [state, formAction] = useActionState<SignupState, FormData>(
    signupAction,
    {},
  );
  // 남는 상태는 화면 검사 결과 하나 — 인증했는지는 따로 기억하지 않고 폼(숨은 칸)에서 읽어요
  const [clientErrors, setClientErrors] = useState<SignupState["errors"]>({});

  // 보내기 전에 화면에서 먼저 검사 — 틀렸거나 인증 전이면 서버로 보내지 않아요
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const parsed = signupSchema.safeParse({
      email: formData.get("email") ?? "",
      nickname: formData.get("nickname") ?? "",
      password: formData.get("password") ?? "",
      passwordConfirm: formData.get("passwordConfirm") ?? "",
    });
    const errors = parsed.success ? {} : fieldErrors(parsed.error);
    if (formData.get(EMAIL_VERIFIED_FIELD) !== "yes") {
      errors.email ??= NOT_VERIFIED;
    }

    setClientErrors(errors);
    if (Object.keys(errors).length > 0) {
      event.preventDefault(); // form action(서버로 보내기)을 멈춰요
    }
  }

  // 화면 검사 결과가 먼저, 서버가 돌려준 결과는 그다음
  const errors = { ...state.errors, ...clientErrors };

  return (
    <form
      noValidate
      action={formAction}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      {/* 인증을 마치면 화면 검사 문구("이메일 인증을 먼저 해 주세요")는 자식이 감춰요 */}
      <EmailVerification
        checkError={clientErrors?.email}
        serverError={state.errors?.email}
      />

      <FormField id="nickname" label="닉네임" required error={errors.nickname}>
        {(field) => (
          <InputBox
            {...field}
            name="nickname"
            autoComplete="nickname"
            placeholder="스터디에서 보일 이름 (2~20자)"
            defaultValue={state.values?.nickname}
          />
        )}
      </FormField>

      <FormField
        id="password"
        label="비밀번호"
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
        label="비밀번호 확인"
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

      {state.formError && <FormAlert tone="error">{state.formError}</FormAlert>}

      <SubmitButton pendingText="가입 중…" className="w-full">
        가입하기
      </SubmitButton>
    </form>
  );
}
