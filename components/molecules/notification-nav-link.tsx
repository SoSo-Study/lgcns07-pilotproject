"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { countUnreadStudyNotifications } from "@/actions/notification-actions";
import { SidebarNavLink } from "@/components/molecules/sidebar-nav-link";
import { routes } from "@/config/routes";

// 사이드바 "🔔 알림 3" (#83)
// 사이드바는 화면을 옮겨도 다시 그려지지 않아서, 숫자는 여기서 따로 물어봐요
// → 화면을 옮길 때마다 + 1분마다 서버에 "안 읽은 스터디 알림 몇 개?"
export function NotificationNavLink() {
  const pathname = usePathname();
  const [count, setCount] = useState(0);

  useEffect(() => {
    let ignore = false; // 화면이 바뀌어 늦게 온 답은 버려요
    const refresh = () =>
      countUnreadStudyNotifications()
        .then((next) => {
          if (!ignore) setCount(next);
        })
        .catch(() => {}); // 숫자를 못 가져와도 메뉴는 그대로

    refresh();
    const timer = setInterval(refresh, 60_000);
    return () => {
      ignore = true;
      clearInterval(timer);
    };
  }, [pathname]);

  return (
    <SidebarNavLink
      href={routes.notifications}
      icon={<Bell className="size-4" aria-hidden />}
    >
      알림
      {count > 0 && (
        <span className="ml-auto rounded-full bg-danger-subtle px-1.5 font-mono text-xs leading-5 font-bold text-destructive">
          {count > 99 ? "99+" : count}
          <span className="sr-only">개 안 읽음</span>
        </span>
      )}
    </SidebarNavLink>
  );
}
