import type { ReactNode } from "react";
import Link from "next/link";

type SidebarUserProps = {
  nickname: string;
  href?: string; // 있으면 이름 칸을 눌러 이동 (⑧ 내 프로필)
  children?: ReactNode; // 오른쪽 로그아웃 버튼 자리 (로그인 담당 #4가 넣기)
};

// 피그마 사이드바 아래 "dev_kim · 로그인됨"
// 사용: <SidebarUser nickname={session.user.name}><LogoutButton /></SidebarUser>
export function SidebarUser({ nickname, href, children }: SidebarUserProps) {
  const info = (
    <>
      <span
        aria-hidden
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-link-subtle font-mono text-sm font-bold text-link"
      >
        {nickname.charAt(0).toUpperCase()}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-mono text-sm font-bold">{nickname}</span>
        <span className="text-xs text-muted-foreground">로그인됨</span>
      </span>
    </>
  );

  return (
    <div className="flex items-center gap-2 px-1">
      {href ? (
        <Link
          href={href}
          className="-mx-1 flex min-w-0 flex-1 items-center gap-2 rounded-md px-1 py-0.5 hover:bg-sidebar-accent"
        >
          {info}
        </Link>
      ) : (
        <span className="flex min-w-0 flex-1 items-center gap-2">{info}</span>
      )}
      {children}
    </div>
  );
}
