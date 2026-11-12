import Link from "next/link";
import { Logo } from "@/components/atoms/logo";
import { MobileMenu } from "@/components/organisms/mobile-menu";
import { Sidebar } from "@/components/organisms/sidebar";
import { routes } from "@/config/routes";

// 폰(768px 미만)에서만 보이는 얇은 헤더 — 로고 + ☰ 메뉴 버튼
export function MobileHeader() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-sidebar-border bg-sidebar px-4 py-3 md:hidden">
      {/* 로고 — 사이드바 로고와 같은 모양 */}
      <Link href={routes.studies} className="flex items-center gap-2">
        <Logo />
        <span className="font-mono text-sm font-bold">soso.study</span>
      </Link>

      {/* ☰ 메뉴 — 누르면 왼쪽에서 사이드바가 그대로 나와요 (로그인 자리까지 같이) */}
      <MobileMenu>
        <Sidebar className="static flex h-full w-full border-r-0" />
      </MobileMenu>
    </header>
  );
}
