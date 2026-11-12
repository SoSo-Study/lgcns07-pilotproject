import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getStudyDetail } from "@/actions/study-actions";
import { StatusBadge } from "@/components/atoms/status-badge";
import { MarkdownText } from "@/components/molecules/markdown-text";
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
import { Skeleton } from "@/components/ui/skeleton";
import { routes } from "@/config/routes";
import { getCurrentUser } from "@/lib/current-user";
import { formatDate } from "@/lib/format-date";
import { ApplyBox } from "@/components/organisms/apply-box";
import { AuthorActions } from "@/components/organisms/author-actions";
import { BookmarkButton } from "@/components/organisms/bookmark-button";
import { CommentSection } from "@/components/organisms/comment-section";

// 탭 제목 · 카톡 미리보기 — 스터디마다 다르게
export async function generateMetadata({
  params,
}: PageProps<"/studies/[studyId]">): Promise<Metadata> {
  const { studyId } = await params;
  const study = await getStudyDetail(studyId);
  if (!study) return { title: "스터디를 찾을 수 없어요" };

  // 소개 앞부분 100자 (줄바꿈은 띄어쓰기로)
  const description = study.content.replace(/\s+/g, " ").slice(0, 100);

  return {
    title: study.title,
    description,
    openGraph: { title: study.title, description },
  };
}

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
  const [study, me] = await Promise.all([
    getStudyDetail(studyId),
    getCurrentUser(),
  ]);
  if (!study) notFound(); // 같은 폴더의 not-found.tsx가 대신 나와요
  const isAuthor = me?.userId === study.authorId; // 내 글이면 [수정] · [삭제]

  const author = (
    <span className="font-mono font-bold text-foreground">
      {study.authorName}
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
        action={isAuthor ? <AuthorActions studyId={study.id} /> : undefined}
        title={
          <>
            <span className="break-keep">{study.title}</span>{" "}
            <span className="font-normal text-subtle">#{study.id}</span>
          </>
        }
        description={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={study.status} />
            <span>
              {author} 님이 {formatDate(study.createdAt)}에 모집을 시작했어요
              {study.commentCount !== undefined &&
                ` · 댓글 ${study.commentCount}`}
            </span>
          </div>
        }
      />

      <div className="flex flex-col gap-6 lg:flex-1 lg:flex-row lg:items-start">
        {/* 왼쪽: 소개 + 댓글 (피그마 ②) — 댓글이 아래를 채워서 "화면 꽉 채우기"는 소개 상자 대신 이 묶음이 해요 */}
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <Panel header={<>{author} · 스터디 소개</>}>
            {/* #26 소개 글 서식 — 소제목 · 목록 · 굵게 · 링크 */}
            <MarkdownText>{study.content}</MarkdownText>
          </Panel>
          <CommentSection studyId={study.id} isLoggedIn={!!me} />
        </div>

        <aside className="lg:sticky lg:top-8 lg:w-72 lg:shrink-0">
          <StudyInfoCard study={study}>
            {/* #8 참여 신청 · 신청 취소 — 내 상황에 맞는 버튼 하나 */}
            <ApplyBox study={study} isLoggedIn={!!me} isAuthor={isAuthor} />
            {/* #11 찜하기 — 누르면 바로 바뀌고(낙관적), 실패하면 되돌려요 */}
            <BookmarkButton
              studyId={study.id}
              bookmarked={study.bookmarked ?? false}
              bookmarkCount={study.bookmarkCount ?? 0}
              isLoggedIn={!!me}
            />
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
