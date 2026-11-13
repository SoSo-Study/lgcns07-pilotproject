import { apiPaths } from "@/config/api-paths";
import { apiRequest } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api-response";
import type { AppNotification } from "@/types/notification";

// 🔔 알림 API를 부르는 곳 (#83) — 로그인 토큰이 꼭 필요해요
// "내 알림"은 토큰으로 서버가 정해요. 내 id를 보내지 않아요

// 내 알림 목록 — GET /api/v1/notifications
// unreadOnly: true면 안 읽은 것만 (서버 기본값이 true라서 전체를 보려면 false로 보내요)
export async function getNotifications(
  token: string,
  { unreadOnly, limit = 50 }: { unreadOnly: boolean; limit?: number },
): Promise<ApiResponse<AppNotification[] | null>> {
  return apiRequest<AppNotification[]>(apiPaths.notification.list, {
    token,
    query: { unreadOnly: String(unreadOnly), limit },
  });
}

// 알림 하나 읽음 — PATCH /api/v1/notifications/{id}/read
// 응답으로 그 알림(linkPath 포함)을 돌려줘요
export async function markNotificationRead(
  token: string,
  notificationId: number,
): Promise<ApiResponse<AppNotification | null>> {
  return apiRequest<AppNotification>(
    apiPaths.notification.read(notificationId),
    { method: "PATCH", token },
  );
}

// 여러 알림 읽음 — POST /api/v1/notifications/read { ids }
// readAll을 쓰면 다른 서비스 알림까지 읽음이 돼서, 스터디 알림 id만 골라 보내요
export async function markNotificationsRead(
  token: string,
  ids: number[],
): Promise<ApiResponse<{ updated: number } | null>> {
  return apiRequest<{ updated: number }>(apiPaths.notification.readMany, {
    method: "POST",
    token,
    body: { ids },
  });
}
