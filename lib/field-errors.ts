import { z } from "zod";

/**
 * zod 검사 실패 → 칸별 첫 번째 에러 문구 한 개씩.
 * 폼에서 칸 아래에 바로 넣기 좋은 모양이에요.
 *
 * @example
 * const parsed = loginSchema.safeParse(values);
 * if (!parsed.success) setErrors(fieldErrors(parsed.error));
 * // → { email: "이메일 형식이 아니에요", password: "비밀번호를 입력해 주세요" }
 */
export function fieldErrors<T>(
  error: z.ZodError<T>,
): Partial<Record<keyof T, string>> {
  const { fieldErrors: all } = z.flattenError(error);
  const first: Partial<Record<keyof T, string>> = {};
  for (const key in all) {
    const messages = all[key as keyof typeof all] as string[] | undefined;
    if (messages?.[0]) first[key as keyof T] = messages[0];
  }
  return first;
}
