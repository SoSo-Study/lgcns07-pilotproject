"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { getServerAuth } from "@/lib/auth-session";
import { safeCallbackUrl } from "@/lib/safe-callback-url";
import { openNotificationSchema } from "@/schema/notification-schema";
import {
  getNotifications,
  markNotificationRead,
  markNotificationsRead,
} from "@/service/notification-service";
import {
  STUDY_NOTIFICATION_TYPES,
  type AppNotification,
} from "@/types/notification";

// 🔔 알림 (#83) — 화면 → 여기 → service → 강사님 API
// 🔒 "내 알림"은 토큰으로 서버가 정해요

// 스터디 알림 4종류만 골라요 (서버가 다른 서비스 알림도 같이 줄 수 있어서)
function onlyStudy(notifications: AppNotification[] | null) {
  return (notifications ?? []).filter((notification) =>
    (STUDY_NOTIFICATION_TYPES as readonly string[]).includes(notification.type),
  );
}

// 알림 화면 목록 — 읽은 것까지 전부, 최신순 (서버 순서 그대로)
export async function loadStudyNotifications() {
  const auth = await getServerAuth();
  if (!auth) {
    return { success: false, message: "로그인이 필요해요.", data: [] };
  }
  const result = await getNotifications(auth.accessToken, {
    unreadOnly: false,
  });
  return { ...result, data: onlyStudy(result.data) };
}

// 사이드바 뱃지 숫자 — 안 읽은 스터디 알림 수
// 로그인 안 했거나 실패하면 0 (뱃지만 안 보이면 돼요)
export async function countUnreadStudyNotifications(): Promise<number> {
  const auth = await getServerAuth();
  if (!auth) return 0;
  const result = await getNotifications(auth.accessToken, {
    unreadOnly: true,
    limit: 100,
  });
  return result.success ? onlyStudy(result.data).length : 0;
}

// 알림 하나 누르기 → 읽음 처리 → 그 알림의 화면으로 이동
export async function openNotificationAction(formData: FormData) {
  const parsed = openNotificationSchema.safeParse({
    notificationId: formData.get("notificationId"),
  });
  if (!parsed.success) redirect(routes.notifications);

  const auth = await getServerAuth();
  if (!auth) redirect(routes.login);

  // 갈 곳은 폼이 아니라 서버가 돌려준 알림의 linkPath로 정해요
  const result = await markNotificationRead(
    auth.accessToken,
    parsed.data.notificationId,
  );
  revalidatePath(routes.notifications);

  // 🔒 서버가 준 주소라도 우리 사이트 안 주소인지 검사해요 (로그인 callbackUrl과 같은 검사)
  const linkPath = result.data?.linkPath;
  redirect(linkPath ? safeCallbackUrl(linkPath) : routes.notifications);
}

// [모두 읽음] — 안 읽은 스터디 알림만 골라 읽음 처리
export async function readAllNotificationsAction() {
  const auth = await getServerAuth();
  if (!auth) redirect(routes.login);

  const unread = await getNotifications(auth.accessToken, {
    unreadOnly: true,
    limit: 100,
  });
  const ids = onlyStudy(unread.data).map((notification) => notification.id);
  if (ids.length > 0) {
    await markNotificationsRead(auth.accessToken, ids);
  }
  revalidatePath(routes.notifications);
}
