import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getStudyDetail } from "@/actions/study-actions";
import { StatusBadge } from "@/components/atoms/status-badge";
import { Panel } from "@/components/molecules/panel";
import { StudyInfoCard } from "@/components/organisms/study-info-card";
import { PageHeader } from "@/components/templates/page-header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { routes } from "@/config/routes";
import { formatDate } from "@/lib/format-date";

// 피그마 ② 스터디 상세 + 신청 — 담당: 이슈 #6 (신청 버튼은 #8)
// 강사님 방식: page는 동기 함수로 두고, params를 await 하는 부분은 Suspense 안 자식에서
export default function StudyDetailPage({
  params,
}: PageProps<"/studies/[studyId]">) {
  return (
    <Suspense fallback={<StudyDetailSkeleton />}>
      <StudyDetail params={params} />
    </Suspense>
  );
}

async function StudyDetail({
  params,
}: Pick<PageProps<"/studies/[studyId]">, "params">) {
  const { studyId } = await params;
  // 정보 카드가 오늘 날짜(new Date)로 D-n을 계산해요.
  // cacheComponents에서는 "요청이 왔을 때만 실행"이라고 먼저 알려야 해요.
  await connection();
  const study = await getStudyDetail(studyId);
  if (!study) notFound(); // 같은 폴더의 not-found.tsx가 대신 나와요

  const author = (
    <span className="font-mono font-bold text-foreground">
      {study.authorNickname}
    </span>
  );

  return (
    <>
      <Breadcrumb className="mb-2">
        <BreadcrumbList className="text-xs">
          <BreadcrumbItem>
            <BreadcrumbLink
              render={<Link href={routes.studies} />}
              className="text-link"
            >
              둘러보기
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-60 truncate">
              {study.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        className="border-b border-border pb-4"
        title={
          <>
            <span className="break-keep">{study.title}</span>{" "}
            <span className="font-normal text-subtle">#{study.studyId}</span>
          </>
        }
        description={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={study.status} />
            <span>
              {author} 님이 {formatDate(study.createdAt)}에 모집을 시작했어요
            </span>
          </div>
        }
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <Panel className="min-w-0 flex-1" header={<>{author} · 스터디 소개</>}>
          <p className="break-words break-keep whitespace-pre-line">
            {study.content}
          </p>
        </Panel>

        <aside className="lg:w-72 lg:shrink-0">
          <StudyInfoCard study={study}>
            {/* #8 참여 신청: 이 버튼을 신청 폼으로 바꿔요 */}
            <Button disabled className="w-full">
              참여 신청하기
            </Button>
          </StudyInfoCard>
        </aside>
      </div>
    </>
  );
}

// 불러오는 동안 보이는 회색 자리 (제목 줄 + 2단 모양)
function StudyDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 border-b border-border pb-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-5 w-72" />
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <Skeleton className="h-48 flex-1" />
        <Skeleton className="h-64 lg:w-72" />
      </div>
    </div>
  );
}
