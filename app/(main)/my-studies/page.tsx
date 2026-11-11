import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { loadMyStudies } from "@/actions/study-actions";
import { StudyTable } from "@/components/organisms/study-table";
import { EmptyState } from "@/components/templates/empty-state";
import { PageHeader } from "@/components/templates/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { routes } from "@/config/routes";

// 피그마 ⑦ 내 모집글 — 담당: 이슈 #13
// ① 목록과 같은 표, 검색 · 칩 · 쪽 번호는 없어요.
// 로그인 안 했으면 로그인 화면으로 보내는 건 #4(proxy 보호 주소 목록)에서 해요.
export default function MyStudiesPage() {
  return (
    <section>
      <PageHeader
        title="내 모집글"
        description="내가 만든 스터디를 모아 봐요. 신청은 사이드바 '신청자 관리'에서 확인해요."
        action={
          <Link href={routes.studyWrite} className={buttonVariants()}>
            <Plus aria-hidden />
            모집글 등록
          </Link>
        }
      />
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <MyStudyList />
      </Suspense>
    </section>
  );
}

// 내 스터디를 불러와서 표로 그리는 부분 (기다리는 부분이라 Suspense 안에 둠)
async function MyStudyList() {
  const result = await loadMyStudies();

  if (!result.success || !result.data) {
    return (
      <p role="alert" className="text-sm text-destructive">
        {result.message}
      </p>
    );
  }

  const studies = result.data.items;
  const openCount = studies.filter((study) => study.status === "OPEN").length;
  const closedCount = studies.length - openCount;

  return (
    <StudyTable
      studies={studies}
      openCount={openCount}
      closedCount={closedCount}
      empty={
        <EmptyState
          title="아직 만든 스터디가 없어요"
          description="같이 공부할 사람을 모아 보세요."
          action={
            <Link href={routes.studyWrite} className={buttonVariants()}>
              <Plus aria-hidden />
              모집글 등록
            </Link>
          }
        />
      }
    />
  );
}
