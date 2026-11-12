import { z } from "zod";
import { newPasswordField } from "@/schema/auth-schema";

// ⑧ 내 프로필 — 주소의 ?tab= 검사 (이상한 값은 기본 탭으로)
export const profileTabSchema = z
  .enum(["applied", "mine", "password"])
  .catch("applied");

export type ProfileTab = z.infer<typeof profileTabSchema>;

// 신청 취소 폼 — 서버 액션에서 한 번 더 검사
export const cancelApplicationSchema = z.object({
  studyId: z.coerce.number().int().positive(),
});

// 비밀번호 바꾸기 폼 (화면 · 서버 같은 규칙)
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "지금 비밀번호를 입력해 주세요"),
    newPassword: newPasswordField,
    newPasswordConfirm: z
      .string()
      .min(1, "새 비밀번호를 한 번 더 입력해 주세요"),
  })
  .refine((v) => v.newPassword === v.newPasswordConfirm, {
    path: ["newPasswordConfirm"],
    message: "새 비밀번호가 서로 달라요",
  })
  .refine((v) => v.newPassword !== v.currentPassword, {
    path: ["newPassword"],
    message: "지금 비밀번호와 다르게 써 주세요",
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
