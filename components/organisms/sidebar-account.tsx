import Link from "next/link";
import { LogIn } from "lucide-react";
import { loadMe } from "@/actions/auth-actions";
import { LogoutButton } from "@/components/molecules/logout-button";
import { SidebarUser } from "@/components/molecules/sidebar-user";
import { routes } from "@/config/routes";

/**
 * 사이드바 아래 자리 — 로그인했으면 "내 이름 · 로그인됨 + 로그아웃", 아니면 "로그인" 링크.
 * 로그인 정보는 요청이 와야 알 수 있어서, 쓰는 쪽에서 `<Suspense>`로 감싸 주세요.
 *
 * @example
 * <Suspense fallback={<Skeleton className="h-8 w-full" />}>
 *   <SidebarAccount />
 * </Suspense>
 */
export async function SidebarAccount() {
  const me = await loadMe();

  if (!me) {
    return (
      <Link
        href={routes.login}
        className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
      >
        <LogIn className="size-4" aria-hidden />
        로그인
      </Link>
    );
  }

  return (
    <SidebarUser nickname={me.nickname} href={routes.profile}>
      <LogoutButton />
    </SidebarUser>
  );
}
