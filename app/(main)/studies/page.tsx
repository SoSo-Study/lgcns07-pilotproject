import { Suspense } from "react";
import { loadStudyList } from "@/actions/study-actions";
import { StudyTable } from "@/components/organisms/study-table";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/templates/page-header";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";

// 피그마 ① 스터디 둘러보기 — 담당: 이슈 #5 (검색 · 칩 · 쪽 번호는 #9)
export default function StudiesPage() {
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
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <StudyList />
      </Suspense>
    </section>
  );
}
async function StudyList() {
  const result = await loadStudyList();

  if (!result.success) {
    return (
      <p role="alert" className="text-sm text-destructive">
        {result.message}
      </p>
    );
  }
  const studies = result.data.studies;
  const openCount = studies.filter((study) => study.status === "OPEN").length;
  const closedCount = studies.filter(
    (study) => study.status === "CLOSED",
  ).length;
  return (
    <StudyTable
      studies={studies}
      openCount={openCount}
      closedCount={closedCount}
    />
  );
}
