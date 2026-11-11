import Link from "next/link";
import { Suspense } from "react";
import { Compass, FileText, LogIn, Plus, Users } from "lucide-react";
import { Logo } from "@/components/atoms/logo";
import { SidebarNavLink } from "@/components/molecules/sidebar-nav-link";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";

type SidebarProps = {
  className?: string; // 바깥에서 모양 덧입히기 (폰 ☰ 메뉴 안에서 다시 쓸 때)
};

// 피그마 Components 판 "Sidebar" (폭 260px)
// 768px 이상: 왼쪽에 고정 · 폰: 숨기고 MobileHeader의 ☰ 메뉴 안에서 다시 써요
export function Sidebar({ className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 md:flex",
        className,
      )}
    >
      {/* 로고 */}
      <Link href={routes.studies} className="mb-6 flex items-center gap-3 px-1">
        <Logo />
        <span className="flex flex-col">
          <span className="font-mono text-sm font-bold">soso.study</span>
          <span className="text-xs text-muted-foreground">
            함께 커밋하는 스터디
          </span>
        </span>
      </Link>

      {/* 메뉴 — usePathname을 쓰는 부분은 Suspense 안에 */}
      <nav aria-label="주 메뉴" className="flex flex-col gap-1">
        <Suspense fallback={null}>
          <SidebarNavLink
            href={routes.studies}
            icon={<Compass className="size-4" aria-hidden />}
          >
            둘러보기
          </SidebarNavLink>
          <SidebarNavLink
            href={routes.myStudies}
            icon={<FileText className="size-4" aria-hidden />}
          >
            내 모집글
          </SidebarNavLink>
          <SidebarNavLink
            href={routes.studyWrite}
            icon={<Plus className="size-4" aria-hidden />}
          >
            모집글 등록
          </SidebarNavLink>
          <SidebarNavLink
            href={routes.applicants}
            icon={<Users className="size-4" aria-hidden />}
          >
            신청자 관리
          </SidebarNavLink>
        </Suspense>
      </nav>

      {/* 아래쪽 사용자 자리 — 로그인 담당(#4)이 "내 이름 + 로그아웃"으로 바꿔요 */}
      <div className="mt-auto border-t border-sidebar-border pt-4">
        <Link
          href={routes.login}
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
        >
          <LogIn className="size-4" aria-hidden />
          로그인
        </Link>
      </div>
    </aside>
  );
}
