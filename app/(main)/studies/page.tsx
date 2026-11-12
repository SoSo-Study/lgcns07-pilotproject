import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { loadStudyList } from "@/actions/study-actions";
import { CategoryChip } from "@/components/molecules/category-chip";
import { Pagination } from "@/components/molecules/pagination";
import { SearchForm } from "@/components/molecules/search-form";
import { StudyTable } from "@/components/organisms/study-table";
import { TerminalBanner } from "@/components/organisms/terminal-banner";
import { EmptyState } from "@/components/templates/empty-state";
import { PageHeader } from "@/components/templates/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { bannerSlides } from "@/config/banner-slides";
import { routes } from "@/config/routes";
import { studyCategoryList } from "@/config/study-category";
import { studiesHref } from "@/lib/studies-href";
import { cn } from "@/lib/utils";
import { studyListQuerySchema } from "@/schema/study-list-schema";

const sortOptions = [
  { value: "latest", label: "최신순" },
  { value: "oldest", label: "오래된순" },
] as const;

// 피그마 ① 스터디 둘러보기 — 목록 #5 · 검색/분야 칩/정렬/쪽 번호 #9
// 조건은 전부 주소에: /studies?q=리액트&category=FRONTEND&sort=oldest&page=2
// 강사님 방식: page는 동기 함수로 두고, searchParams를 await 하는 부분은 Suspense 안 자식에서
export default function StudiesPage({ searchParams }: PageProps<"/studies">) {
  return (
    <section>
      <PageHeader
        title="스터디 둘러보기"
        description="함께 성장할 개발자 스터디를 찾아보세요."
        action={
          <Link href={routes.studyWrite} className={buttonVariants()}>
            <Plus aria-hidden />
            모집글 등록
          </Link>
        }
      />
      <TerminalBanner slides={bannerSlides} className="mb-4" />
      <Suspense fallback={<StudyListSkeleton />}>
        <StudyList searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

async function StudyList({
  searchParams,
}: Pick<PageProps<"/studies">, "searchParams">) {
  // 1. 주소의 조건 읽기 — 이상한 값(?page=abc)은 기본값으로 바뀌어요
  const query = studyListQuerySchema.parse(await searchParams);
  const { q, category, sort } = query;

  // 2. 그 조건으로 목록 가져오기 (화면 → 액션 → 서비스)
  const result = await loadStudyList(query);

  if (!result.success || !result.data) {
    return (
      <p role="alert" className="text-sm text-destructive">
        {result.message}
      </p>
    );
  }

  const { items: studies, totalPages, openCount, closedCount } = result.data;
  const { categoryCounts } = result.data;
  const currentPage = result.data.page + 1; // API는 0부터, 화면 · 주소는 1부터

  // 검색 · 분야로 걸렀는데 없을 때만 따로 안내 (아니면 표의 기본 문구 "아직 스터디가 없어요")
  const hasFilter = q !== "" || category !== undefined;
  const filteredEmpty = hasFilter ? (
    <EmptyState
      title="검색 결과가 없어요"
      description="다른 단어로 찾거나 분야를 바꿔 보세요."
      action={
        <Link
          href={routes.studies}
          className={buttonVariants({ variant: "outline" })}
        >
          조건 지우기
        </Link>
      }
    />
  ) : undefined;

  return (
    <div className="flex flex-col gap-4">
      {/* 검색창 + 정렬 — 검색하면 분야 · 정렬은 유지하고 1쪽으로 */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchForm
          key={q}
          action={routes.studies}
          defaultValue={q}
          hidden={{ category, sort: sort === "oldest" ? sort : undefined }}
        />
        <nav
          aria-label="정렬"
          className="flex overflow-hidden rounded-md border border-border text-sm"
        >
          {sortOptions.map((option) => (
            <Link
              key={option.value}
              href={studiesHref({ q, category, sort: option.value })}
              aria-current={sort === option.value ? "true" : undefined}
              className={cn(
                "px-3 py-1.5 transition-colors",
                sort === option.value
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/50",
              )}
            >
              {option.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* 분야 칩 — 누르면 주소의 category가 바뀌고 1쪽으로 */}
      <nav aria-label="분야" className="flex flex-wrap gap-2">
        <CategoryChip
          category="ALL"
          href={studiesHref({ q, sort })}
          selected={category === undefined}
          count={categoryCounts.ALL}
        />
        {studyCategoryList.map((item) => (
          <CategoryChip
            key={item}
            category={item}
            href={studiesHref({ q, sort, category: item })}
            selected={category === item}
            count={categoryCounts[item]}
          />
        ))}
      </nav>

      <StudyTable
        studies={studies}
        openCount={openCount}
        closedCount={closedCount}
        empty={filteredEmpty}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        hrefFor={(page) => studiesHref({ q, category, sort, page })}
      />
    </div>
  );
}

// 불러오는 동안 보이는 회색 자리 (검색 줄 · 칩 줄 · 표)
function StudyListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-7 w-96 max-w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
