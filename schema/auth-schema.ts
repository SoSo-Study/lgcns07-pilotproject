import { z } from "zod";

// 로그인 · 회원가입 입력 검사 규칙 (화면에서 먼저 검사, 서버 액션에서 한 번 더)
// 숫자는 강사님 스웨거 RegisterRequest와 맞춰요 → 서버에 보내기 전에 미리 알려 줄 수 있어요.
//   - 비밀번호 8~72자 (72자 = 비밀번호 암호화(bcrypt)가 읽는 최대 길이)
//   - 이름 서버 2~80자 → 화면에 보이는 닉네임이라 2~20자로 좁게

// ── 칸 하나짜리 규칙 조각: 여러 폼이 나눠 써요 ──

/** 이메일 (= 로그인 아이디). 앞뒤 빈칸은 지우고 검사해요. */
export const emailField = z
  .string()
  .trim()
  .min(1, "이메일을 입력해 주세요")
  .pipe(z.email("이메일 형식이 아니에요"));

/** 새로 만드는 비밀번호 (가입 · 재설정) */
export const newPasswordField = z
  .string()
  .min(1, "비밀번호를 입력해 주세요")
  .min(8, "비밀번호는 8~72자로 써 주세요")
  .max(72, "비밀번호는 8~72자로 써 주세요");

/** 닉네임 (API 이름: name) */
export const nicknameField = z
  .string()
  .trim()
  .min(1, "닉네임을 입력해 주세요")
  .min(2, "닉네임은 2~20자로 써 주세요")
  .max(20, "닉네임은 2~20자로 써 주세요");

/** 이메일 인증번호 6자리 */
export const emailCodeField = z
  .string()
  .trim()
  .regex(/^\d{6}$/, "인증번호 6자리 숫자를 입력해 주세요");

// ── 폼 하나짜리 규칙: 위 조각을 모아서 ──

/**
 * 로그인 폼.
 * 비밀번호는 "비었는지"만 봐요. 로그인에서 길이 규칙을 알려 주면
 * 비밀번호 규칙을 남에게 알려 주는 셈이고, 규칙이 바뀌기 전 가입자는 로그인을 못 해요.
 */
export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "비밀번호를 입력해 주세요"),
});

/** 비밀번호 + 비밀번호 확인 두 칸 (가입 · 재설정이 같이 써요) */
const passwordPair = z.object({
  password: newPasswordField,
  passwordConfirm: z.string().min(1, "비밀번호를 한 번 더 입력해 주세요"),
});

/** 회원가입 폼 (이메일 인증은 따로 — 인증번호 줄에서 확인해요) */
export const signupSchema = z
  .object({
    email: emailField,
    nickname: nicknameField,
    ...passwordPair.shape,
  })
  .refine((values) => values.password === values.passwordConfirm, {
    path: ["passwordConfirm"], // 에러를 "비밀번호 확인" 칸 아래에 보여 줘요
    message: "비밀번호가 서로 달라요",
    // zod 4는 기본으로 "다른 칸이 다 맞을 때만" 비교해요.
    // when: 비밀번호 두 칸만 올바르면 닉네임이 틀려도 바로 비교해서 같이 알려 줘요
    when: (payload) => passwordPair.safeParse(payload.value).success,
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
