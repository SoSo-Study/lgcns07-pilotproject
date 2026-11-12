import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { ApplicantStats } from "./applicant-stats";
import { ApplicantTable } from "./applicant-table";
import { StudySelect } from "./study-select";
import { getApplicationsAction } from "@/actions/application-actions";
import { loadMyStudies } from "@/actions/study-actions";
import { EmptyState } from "@/components/templates/empty-state";
import { PageHeader } from "@/components/templates/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { routes } from "@/config/routes";

// 피그마 ④ 신청자 관리 — 담당: 이슈 #10
// 스터디 고르기는 주소로: /applicants?studyId=3
// 강사님 방식: page는 동기 함수로 두고, searchParams를 await 하는 부분은 Suspense 안 자식에서
export default function ApplicantsPage({
  searchParams,
}: PageProps<"/applicants">) {
  return (
    <section>
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <Applicants searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

const TITLE = "신청자 관리";
const DESCRIPTION = "내 스터디에 들어온 신청을 승인하거나 거절해요.";

async function Applicants({
  searchParams,
}: Pick<PageProps<"/applicants">, "searchParams">) {
  const { studyId } = await searchParams;

  // 1. 내 스터디 목록 (⑦ 내 모집글과 같은 함수 — 로그인한 사람 기준)
  const myStudiesResult = await loadMyStudies();
  if (!myStudiesResult.success || !myStudiesResult.data) {
    return (
      <>
        <PageHeader title={TITLE} description={DESCRIPTION} />
        <p role="alert" className="text-sm text-destructive">
          {myStudiesResult.message}
        </p>
      </>
    );
  }
  const myStudies = myStudiesResult.data.items;

  // 2. 내 스터디가 하나도 없으면 → 만들러 가기
  if (myStudies.length === 0) {
    return (
      <>
        <PageHeader title={TITLE} description={DESCRIPTION} />
        <div className="rounded-md border border-border bg-card">
          <EmptyState
            title="아직 만든 스터디가 없어요"
            description="스터디를 만들면 들어온 신청을 여기서 관리할 수 있어요."
            action={
              <Link href={routes.studyWrite} className={buttonVariants()}>
                <Plus aria-hidden />
                모집글 등록
              </Link>
            }
          />
        </div>
      </>
    );
  }

  // 3. 주소의 studyId(글자) → 숫자. 없으면 내 스터디 중 첫 번째(가장 최근)
  const selectedId =
    typeof studyId === "string" ? Number(studyId) : myStudies[0].id;
  const study = myStudies.find((item) => item.id === selectedId);

  const header = (
    <PageHeader
      title={TITLE}
      description={DESCRIPTION}
      action={<StudySelect studies={myStudies} selectedId={selectedId} />}
    />
  );

  // 4. 내 스터디가 아닌 번호로 들어오면 막기 (남의 스터디 · 없는 스터디)
  if (!study) {
    return (
      <>
        {header}
        <p role="alert" className="text-sm text-destructive">
          내 스터디가 아니거나 없는 스터디예요. 오른쪽 위에서 내 스터디를 골라
          주세요.
        </p>
      </>
    );
  }

  // 5. 이 스터디에 들어온 신청 목록 (화면 → actions → service, 스터디장 확인 포함)
  const result = await getApplicationsAction(selectedId);
  const applications = result.success ? result.data : [];

  // 자리가 다 찼는지 (다 찼으면 [승인] 버튼을 막아요. 서버도 한 번 더 막아요)
  const isFull = study.currentMembers >= study.maxMembers;

  return (
    <>
      {header}
      <ApplicantStats
        applications={applications}
        currentMembers={study.currentMembers}
        maxMembers={study.maxMembers}
      />
      {isFull && (
        <p className="mb-3 text-sm text-muted-foreground">
          모집 인원이 다 차서 더 승인할 수 없어요. 거절은 할 수 있어요.
        </p>
      )}
      <ApplicantTable applications={applications} isFull={isFull} />
      <p className="mt-3 text-xs text-muted-foreground">
        승인하면 남은 자리가 줄고, 자리가 0이 되면 모집 상태가 자동으로
        &lsquo;마감&rsquo;으로 바뀌어요.
      </p>
    </>
  );
}
