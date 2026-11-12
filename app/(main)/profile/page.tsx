import { Suspense } from "react";
import { AppliedList } from "@/components/organisms/applied-list";
import { ChangePasswordForm } from "@/components/organisms/change-password-form";
import { ProfileCard } from "@/components/organisms/profile-card";
import { ProfileStats } from "@/components/molecules/profile-stats";
import { ProfileTabs } from "@/components/molecules/profile-tabs";
import { loadProfile } from "@/actions/profile-actions";
import { StudyTable } from "@/components/organisms/study-table";
import { PageHeader } from "@/components/templates/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { type ProfileTab, profileTabSchema } from "@/schema/profile-schema";
import type { MyApplication, StudySummary } from "@/types/study";

export const metadata = { title: "내 프로필" };

// 피그마 ⑧ 내 프로필 — 이슈 #42
// 탭은 주소로: /profile?tab=applied(기본) · mine · password → 새로고침 · 링크 공유해도 같은 탭
// 로그인 안 했으면 proxy가 먼저 로그인 화면으로 보내요 (config/auth-paths.ts)
// 강사님 방식: page는 동기 함수, searchParams를 await 하는 부분은 Suspense 안 자식에서
export default function ProfilePage({ searchParams }: PageProps<"/profile">) {
  return (
    <section className="flex flex-col">
      <PageHeader
        title="내 프로필"
        description="내 정보와 스터디 활동을 한곳에서 봐요."
      />
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

async function ProfileContent({
  searchParams,
}: Pick<PageProps<"/profile">, "searchParams">) {
  const tab = profileTabSchema.parse((await searchParams).tab);
  const result = await loadProfile();

  if (!result.ok) {
    return (
      <p role="alert" className="text-sm text-destructive">
        {result.message}
      </p>
    );
  }

  const { account, applications, studies } = result;
  const applied = applications.data?.items ?? [];
  const mine = studies.data?.items ?? [];
  const appliedCount = applications.data?.totalElements ?? applied.length;
  const mineCount = studies.data?.totalElements ?? mine.length;

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <ProfileCard account={account} />

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <ProfileStats
          createdCount={mineCount}
          appliedCount={appliedCount}
          approvedCount={applied.filter((a) => a.status === "APPROVED").length}
          pendingCount={applied.filter((a) => a.status === "PENDING").length}
        />

        <ProfileTabs
          current={tab}
          appliedCount={appliedCount}
          mineCount={mineCount}
        />

        <ProfileTabPanel
          tab={tab}
          applied={applied}
          mine={mine}
          appliedError={applications.success ? undefined : applications.message}
          mineError={studies.success ? undefined : studies.message}
        />
      </div>
    </div>
  );
}

type ProfileTabPanelProps = {
  tab: ProfileTab;
  applied: MyApplication[];
  mine: StudySummary[];
  /** 목록을 못 불러왔을 때 서버가 준 문구 (불러왔으면 없음) */
  appliedError?: string;
  mineError?: string;
};

// 고른 탭 하나만 그려요 — 분기는 return 위에서 끝내요 (강의 11/5 · 11/6 "리턴은 결과만")
function ProfileTabPanel({
  tab,
  applied,
  mine,
  appliedError,
  mineError,
}: ProfileTabPanelProps) {
  if (tab === "password") return <ChangePasswordForm />;

  const error = tab === "mine" ? mineError : appliedError;
  if (error !== undefined) {
    return (
      <p role="alert" className="text-sm text-destructive">
        {error}
      </p>
    );
  }

  if (tab === "mine") return <StudyTable studies={mine} />;
  return <AppliedList applications={applied} />;
}

// 불러오는 동안 보이는 회색 자리 (왼쪽 카드 + 오른쪽 숫자 · 표)
function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <Skeleton className="h-72 w-full lg:w-72" />
      <div className="flex flex-1 flex-col gap-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
