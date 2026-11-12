import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckCheck } from "lucide-react";
import {
  loadStudyNotifications,
  openNotificationAction,
  readAllNotificationsAction,
} from "@/actions/notification-actions";
import { SubmitButton } from "@/components/atoms/submit-button";
import { EmptyState } from "@/components/templates/empty-state";
import { PageHeader } from "@/components/templates/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { timeAgo } from "@/lib/time-ago";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "알림" };

const TITLE = "알림";
const DESCRIPTION = "참여 신청 · 승인 · 거절 · 취소 소식을 모아 보여 줘요.";

// 🔔 알림 화면 (#83) — 사이드바 "알림"을 누르면 와요 (로그인한 사람만, proxy가 막아요)
// 강사님 방식: page는 동기 함수로 두고, 기다리는 부분은 Suspense 안 자식에서
export default function NotificationsPage() {
  return (
    <section>
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <Notifications />
      </Suspense>
    </section>
  );
}

async function Notifications() {
  const result = await loadStudyNotifications();
  const notifications = result.data;
  const hasUnread = notifications.some((notification) => !notification.read);

  return (
    <>
      <PageHeader
        title={TITLE}
        description={DESCRIPTION}
        action={
          hasUnread && (
            <form action={readAllNotificationsAction}>
              <SubmitButton size="sm" variant="outline" pendingText="읽는 중…">
                <CheckCheck aria-hidden />
                모두 읽음
              </SubmitButton>
            </form>
          )
        }
      />

      {!result.success && (
        <p role="alert" className="mb-3 text-sm text-destructive">
          {result.message}
        </p>
      )}

      {result.success && notifications.length === 0 ? (
        <div className="rounded-md border border-border bg-card">
          <EmptyState
            title="아직 알림이 없어요"
            description="참여 신청이 들어오거나 내 신청이 처리되면 여기에 보여요."
          />
        </div>
      ) : (
        <ul className="overflow-hidden rounded-md border border-border bg-card">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="border-t border-border first:border-t-0"
            >
              {/* 누르면 읽음 처리 + 그 화면으로 이동 (갈 곳은 서버가 정해요) */}
              <form action={openNotificationAction}>
                <input
                  type="hidden"
                  name="notificationId"
                  value={notification.id}
                />
                <button
                  type="submit"
                  className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-muted/40"
                >
                  {/* 안 읽은 알림은 앞에 파란 점 */}
                  <span
                    aria-hidden
                    className={cn(
                      "mt-1.5 size-2 shrink-0 rounded-full",
                      notification.read ? "bg-transparent" : "bg-link",
                    )}
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-sm",
                          notification.read
                            ? "text-muted-foreground"
                            : "font-bold",
                        )}
                      >
                        {notification.title}
                      </span>
                      {!notification.read && (
                        <span className="sr-only">(안 읽음)</span>
                      )}
                      <span className="font-mono text-xs text-muted-foreground">
                        {timeAgo(notification.createdAt)}
                      </span>
                    </span>
                    <span className="text-sm break-keep text-muted-foreground">
                      {notification.body}
                    </span>
                  </span>
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
