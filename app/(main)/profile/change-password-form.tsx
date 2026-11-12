"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  changePasswordAction,
  type ChangePasswordState,
} from "@/actions/profile-actions";
import { SubmitButton } from "@/components/atoms/submit-button";
import { FormAlert } from "@/components/molecules/form-alert";
import { FormField } from "@/components/molecules/form-field";
import { PasswordInput } from "@/components/molecules/password-input";
import { routes } from "@/config/routes";
import { requestLogout } from "@/lib/logout-request";

// ⑧ 비밀번호 바꾸기 — POST /users/me/password (지금 비밀번호를 확인하는 방식)
// 바꾸면 로그아웃 → 로그인 화면 "새 비밀번호로 로그인해 주세요"
// 🔒 비밀번호는 폼 → 서버 액션(POST 바디)으로만. 돌려주는 상태 · 주소 · 로그에 남기지 않아요 (#45 C1)
export function ChangePasswordForm() {
  const router = useRouter();
  const [state, setState] = useState<ChangePasswordState>({});
  const [isPending, startTransition] = useTransition();

  // 흐름은 "버튼을 누른 그 처리 안에서" 이어요 — 바꾸기 → 성공이면 로그아웃 → 로그인 화면
  // (결과를 보고 useEffect로 다음 일을 시키지 않아요 — React 문서 "Effect가 필요 없을 수도")
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await changePasswordAction({}, formData);
      setState(result);
      if (!result.ok) return;
      await requestLogout();
      router.replace(routes.loginNotice("password-reset"));
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-w-md flex-col gap-4 rounded-md border border-border bg-card p-5"
    >
      <FormField
        id="currentPassword"
        label="지금 비밀번호"
        error={state.errors?.currentPassword}
      >
        {(field) => (
          <PasswordInput
            {...field}
            name="currentPassword"
            autoComplete="current-password"
          />
        )}
      </FormField>
      <FormField
        id="newPassword"
        label="새 비밀번호 (8~72자)"
        error={state.errors?.newPassword}
      >
        {(field) => (
          <PasswordInput
            {...field}
            name="newPassword"
            autoComplete="new-password"
          />
        )}
      </FormField>
      <FormField
        id="newPasswordConfirm"
        label="새 비밀번호 확인"
        error={state.errors?.newPasswordConfirm}
      >
        {(field) => (
          <PasswordInput
            {...field}
            name="newPasswordConfirm"
            autoComplete="new-password"
          />
        )}
      </FormField>

      {state.formError && <FormAlert tone="error">{state.formError}</FormAlert>}
      {state.ok && (
        <FormAlert tone="success">
          비밀번호를 바꿨어요. 다시 로그인해 주세요.
        </FormAlert>
      )}

      <SubmitButton
        pending={isPending}
        pendingText="바꾸는 중…"
        className="w-full"
      >
        비밀번호 바꾸기
      </SubmitButton>
      <p className="text-xs text-muted-foreground">
        🔒 바꾸면 이 기기에서 로그아웃되고, 새 비밀번호로 다시 로그인해요.
      </p>
    </form>
  );
}
