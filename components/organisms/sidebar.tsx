import Link from "next/link";
import { Suspense } from "react";
import { CodeXml, Compass, FileText, LogIn, Plus, Users } from "lucide-react";
import { SidebarNavLink } from "@/components/molecules/sidebar-nav-link";
import { routes } from "@/config/routes";

// 피그마 Components 판 "Sidebar" (폭 260px)
export function Sidebar() {
  return (
    <aside className="sticky top-0 flex h-dvh w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-5">
      {/* 로고 */}
      <Link href={routes.studies} className="mb-6 flex items-center gap-3 px-1">
        <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <CodeXml className="size-5" aria-hidden />
        </span>
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
