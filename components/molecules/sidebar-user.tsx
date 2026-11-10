import type { ReactNode } from "react";

type SidebarUserProps = {
  nickname: string;
  children?: ReactNode; // 오른쪽 로그아웃 버튼 자리 (로그인 담당 #4가 넣기)
};

// 피그마 사이드바 아래 "dev_kim · 로그인됨"
// 사용: <SidebarUser nickname={session.user.name}><LogoutButton /></SidebarUser>
export function SidebarUser({ nickname, children }: SidebarUserProps) {
  return (
    <div className="flex items-center gap-2 px-1">
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
      {children}
    </div>
  );
}
