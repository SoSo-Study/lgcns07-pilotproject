"use client";

import { useActionState, useState, type FormEvent } from "react";
import Link from "next/link";
import { findIdAction, type FindIdState } from "@/actions/auth-actions";
import { SubmitButton } from "@/components/atoms/submit-button";
import { FormAlert } from "@/components/molecules/form-alert";
import { FormField } from "@/components/molecules/form-field";
import { InputBox } from "@/components/molecules/input-box";
import { Button, buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { fieldErrors } from "@/lib/field-errors";
import { findIdSchema } from "@/schema/auth-schema";

/**
 * 이메일 찾기 카드 안쪽 — 닉네임 → 가입한 이메일의 일부(u***@example.com).
 * 칸 검사는 화면에서 먼저(zod `findIdSchema`), 찾기는 서버 액션(`findIdAction`)으로 보내요.
 * 🔒 화면에는 가려진 이메일까지만 나와요.
 *
 * 🧪 시연용 기능이에요. 닉네임은 목록 · 댓글에 공개된 값이라, 실서비스라면
 * 본인 인증(문자 등) 없이 닉네임만으로 남의 이메일 일부를 보여 주면 안 돼요 (#72).
 *
 * @example
 * <FindIdForm />
 */
export function FindIdForm() {
  const [state, formAction] = useActionState<FindIdState, FormData>(
    findIdAction,
    {},
  );
  const [clientErrors, setClientErrors] = useState<FindIdState["errors"]>({});
  // "다시 찾기"를 누르면 결과를 접고 폼을 다시 보여 줘요
  const [searchAgain, setSearchAgain] = useState(false);

  // 보내기 전에 화면에서 먼저 검사 — 틀렸으면 서버로 보내지 않아요
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const parsed = findIdSchema.safeParse({
      nickname: formData.get("nickname") ?? "",
    });
    const errors = parsed.success ? {} : fieldErrors(parsed.error);

    setClientErrors(errors);
    setSearchAgain(false);
    if (Object.keys(errors).length > 0) {
      event.preventDefault(); // form action(서버로 보내기)을 멈춰요
    }
  }

  // ── 결과 ──
  if (state.result && !searchAgain) {
    const { maskedEmails } = state.result;
    const found = maskedEmails.length > 0;

    return (
      <div className="flex flex-col gap-4">
        {found ? (
          <>
            <FormAlert tone="success">가입한 이메일을 찾았어요.</FormAlert>
            <ul
              aria-label="찾은 이메일"
              className="flex flex-col gap-1 rounded-md border border-border bg-inset p-3 font-mono text-sm"
            >
              {maskedEmails.map((email) => (
                <li key={email} className="break-all">
                  {email}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">
              가입한 이메일의 일부예요. 기억나는 주소로 로그인해 보세요.
            </p>
          </>
        ) : (
          <FormAlert>그 닉네임으로 가입한 계정을 찾지 못했어요.</FormAlert>
        )}

        {/* 찾았으면 "로그인하러 가기"가, 못 찾았으면 "다시 찾기"가 주 버튼 */}
        <div className="flex flex-col gap-2">
          <Link
            href={routes.login}
            className={buttonVariants({
              variant: found ? "default" : "outline",
              className: found ? "order-1" : "order-2",
            })}
          >
            로그인하러 가기
          </Link>
          <Button
            type="button"
            variant={found ? "outline" : "default"}
            className={
              found
                ? "order-2 enabled:cursor-pointer"
                : "order-1 enabled:cursor-pointer"
            }
            onClick={() => setSearchAgain(true)}
          >
            다시 찾기
          </Button>
        </div>
      </div>
    );
  }

  // ── 폼 ──
  // 화면 검사 결과가 먼저, 서버가 돌려준 결과는 그다음
  const errors = { ...state.errors, ...clientErrors };

  return (
    <form
      noValidate
      action={formAction}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <p className="text-sm text-muted-foreground">
        소소스터디는 이메일로 로그인해요. 닉네임을 넣으면 가입한 이메일의 일부를
        알려 드려요.
      </p>

      <FormField id="nickname" label="닉네임" error={errors.nickname}>
        {(field) => (
          <InputBox
            {...field}
            name="nickname"
            autoComplete="nickname"
            placeholder="가입할 때 쓴 닉네임"
          />
        )}
      </FormField>

      {state.formError && <FormAlert tone="error">{state.formError}</FormAlert>}

      <SubmitButton pendingText="찾는 중…" className="w-full">
        이메일 찾기
      </SubmitButton>
    </form>
  );
}
