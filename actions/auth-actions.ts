"use server";

import { redirect } from "next/navigation";
import { env } from "@/lib/env";
import { routes } from "@/config/routes";
import { getCurrentUser } from "@/lib/current-user";
import {
  clearEmailVerified,
  isEmailVerified,
  markEmailVerified,
} from "@/lib/email-verified-cookie";
import { fieldErrors } from "@/lib/field-errors";
import {
  emailCodeField,
  emailField,
  signupSchema,
  type SignupValues,
} from "@/schema/auth-schema";
import {
  EMAIL_CODE_TTL_SECONDS,
  registerUser,
  sendEmailCode,
  verifyEmailCode,
} from "@/service/auth-service";

// 팀 규칙: 화면 → actions → (service · lib)
// 화면에서도 검사하지만, 화면을 거치지 않고 직접 부를 수도 있어서 여기서 한 번 더 검사해요.

// 지금 로그인한 사람 — 사이드바 아래 "내 이름 + 로그아웃" 자리에서 써요
// 로그인 안 했으면 null
export async function loadMe() {
  return getCurrentUser();
}

// ── 이메일 인증 ──

export type SendEmailCodeResult =
  | { ok: true; message: string; ttlSeconds: number; demoCode?: string }
  | { ok: false; message: string };

// [인증번호 받기] — 이미 가입된 이메일이면 여기서 막혀요 (중복 확인 겸)
export async function sendEmailCodeAction(
  email: string,
): Promise<SendEmailCodeResult> {
  const parsed = emailField.safeParse(email);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const response = await sendEmailCode(parsed.data);
  if (!response.success) {
    return { ok: false, message: response.message };
  }
  return {
    ok: true,
    message: response.message,
    ttlSeconds: EMAIL_CODE_TTL_SECONDS,
    // 🧪 테스트 서버의 시연용 번호 — SHOW_DEMO_CODE=true일 때만 화면으로 (실서비스에선 꺼 두기)
    demoCode: env.showDemoCode ? response.data?.demoCode : undefined,
  };
}

export type VerifyEmailCodeResult = { ok: boolean; message: string };

// [확인] — 인증번호가 맞는지
export async function verifyEmailCodeAction(
  email: string,
  code: string,
): Promise<VerifyEmailCodeResult> {
  const parsedEmail = emailField.safeParse(email);
  const parsedCode = emailCodeField.safeParse(code);
  if (!parsedEmail.success || !parsedCode.success) {
    const issue = (parsedCode.error ?? parsedEmail.error)?.issues[0];
    return { ok: false, message: issue?.message ?? "다시 확인해 주세요." };
  }

  const response = await verifyEmailCode(parsedEmail.data, parsedCode.data);
  // 🔒 성공하면 "이 이메일 인증됨"을 서명된 httpOnly 쿠키(10분)로 → 가입 액션이 확인 (#45 C3)
  if (response.success) await markEmailVerified(parsedEmail.data);
  return { ok: response.success, message: response.message };
}

// ── 회원가입 ──

export type SignupState = {
  errors?: Partial<Record<keyof SignupValues, string>>;
  formError?: string;
  /** 실패했을 때 되살릴 값 (비밀번호는 넣지 않아요) */
  values?: { email: string; nickname: string };
};

// [가입하기] — <form action={…}> + useActionState로 불러요
export async function signupAction(
  _previous: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const input = {
    email: String(formData.get("email") ?? ""),
    nickname: String(formData.get("nickname") ?? ""),
    password: String(formData.get("password") ?? ""),
    passwordConfirm: String(formData.get("passwordConfirm") ?? ""),
  };
  const values = { email: input.email, nickname: input.nickname };

  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return { errors: fieldErrors(parsed.error), values };
  }

  // 🔒 인증을 마친 이메일인지 서버에서 확인 — 화면을 건너뛰고 직접 불러도 막혀요
  if (!(await isEmailVerified(parsed.data.email))) {
    return {
      errors: { email: "이메일 인증을 먼저 해 주세요" },
      values,
    };
  }

  const response = await registerUser({
    email: parsed.data.email,
    name: parsed.data.nickname, // API 이름은 name
    password: parsed.data.password,
  });
  if (!response.success) {
    return { formError: response.message, values };
  }

  await clearEmailVerified(); // 다 썼으니 지우기
  redirect(routes.loginNotice("signed-up")); // 가입 → 로그인 화면에 "가입했어요"
}
