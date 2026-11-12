import { z } from "zod";

// 알림 하나 열기 — 폼에서 온 번호 검사 (서버 액션에서) (#83)
export const openNotificationSchema = z.object({
  notificationId: z.coerce.number().int().positive(),
});
