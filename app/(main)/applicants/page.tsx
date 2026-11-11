import { Suspense } from "react";
import { ApplicantStats } from "./applicant-stats";
import { ApplicantTable } from "./applicant-table";
import { StudySelect } from "./study-select";
import { getApplicationsAction } from "@/actions/application-actions";
import { PageHeader } from "@/components/templates/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { mockStudies } from "@/lib/mock-studies";

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

// 🧪 로그인이 붙기 전까지 "내 스터디" 대신 가짜 스터디 전체를 써요
// TODO(API 연결 후): 스터디 정보도 API에서 받기 — 승인하면 서버가 인원을 올려 줘서 숫자가 맞게 돼요
const myStudies = mockStudies;
const DEFAULT_STUDY_ID = 2; // 🧪 주소에 studyId가 없을 때 처음 보여 줄 스터디

async function Applicants({
  searchParams,
}: Pick<PageProps<"/applicants">, "searchParams">) {
  const { studyId } = await searchParams;

  // 주소의 studyId(글자) → 숫자. 없으면 기본 스터디
  const selectedId =
    typeof studyId === "string" ? Number(studyId) : DEFAULT_STUDY_ID;
  const study = myStudies.find((item) => item.studyId === selectedId);

  // 이 스터디에 들어온 신청 목록 (화면 → actions → service)
  const result = await getApplicationsAction(selectedId);
  const applications = result.success ? result.data : [];

  // 자리가 다 찼는지 (다 찼으면 [승인] 버튼을 막아요. 서버도 한 번 더 막아요)
  const isFull = study ? study.currentMembers >= study.maxMembers : false;

  return (
    <>
      <PageHeader
        title="신청자 관리"
        description="내 스터디에 들어온 신청을 승인하거나 거절해요."
        action={<StudySelect studies={myStudies} selectedId={selectedId} />}
      />

      {study ? (
        <>
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
      ) : (
        <p className="text-sm text-destructive">스터디를 찾을 수 없어요.</p>
      )}
    </>
  );
}
