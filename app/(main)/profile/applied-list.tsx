import Link from "next/link";
import { Check, CircleDot, Compass, Undo2, X } from "lucide-react";
import { CancelApplicationButton } from "./cancel-application-button";
import { CategoryLabel } from "@/components/atoms/category-label";
import { Pill } from "@/components/atoms/pill";
import { EmptyState } from "@/components/templates/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { formatDate } from "@/lib/format-date";
import type { MyApplication } from "@/types/study";

type AppliedListProps = {
  applications: MyApplication[];
};

// 피그마 ⑧ "신청한 스터디" 표 — 스터디 · 신청일 · 상태/처리
// 1024px 이상은 한 줄 표, 그보다 좁으면 카드처럼 쌓여요 (#24 반응형 규칙)
export function AppliedList({ applications }: AppliedListProps) {
  if (applications.length === 0) {
    return (
      <div className="rounded-md border border-border bg-card">
        <EmptyState
          title="아직 신청한 스터디가 없어요"
          description="마음에 드는 스터디를 찾아 신청해 보세요."
          action={
            <Link href={routes.studies} className={buttonVariants()}>
              <Compass aria-hidden />
              스터디 둘러보기
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <ul className="overflow-hidden rounded-md border border-border bg-card">
        {applications.map((application) => (
          <li
            key={application.id}
            className="flex flex-col gap-2 border-t border-border px-4 py-3 first:border-t-0 lg:flex-row lg:items-center lg:gap-4"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <Link
                href={routes.study(application.study.id)}
                className="truncate font-bold hover:text-link hover:underline"
              >
                {application.study.title}
              </Link>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <CategoryLabel category={application.study.category} />
                <span className="font-mono">
                  · 스터디장 {application.study.authorName}
                </span>
              </div>
            </div>
            <span className="font-mono text-xs text-muted-foreground lg:w-24 lg:shrink-0">
              {formatDate(application.createdAt)}
            </span>
            <div className="flex items-center gap-2 lg:w-52 lg:shrink-0">
              <StatusPill status={application.status} />
              {/* 취소 버튼은 대기 중 · 승인됨일 때만 (거절 · 취소한 신청은 끝난 기록) */}
              {(application.status === "PENDING" ||
                application.status === "APPROVED") && (
                <CancelApplicationButton
                  studyId={application.study.id}
                  approved={application.status === "APPROVED"}
                />
              )}
            </div>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground">
        신청 취소는 대기 중 · 승인된 뒤 모두 할 수 있어요. 승인된 뒤 취소하면
        인원이 1명 줄고, 마감일 전이면 모집이 다시 열려요(서버에서 처리). 취소한
        신청은 &lsquo;취소함&rsquo;으로 남고, 같은 스터디에 다시 신청할 수
        있어요.
      </p>
    </div>
  );
}

function StatusPill({ status }: { status: MyApplication["status"] }) {
  if (status === "APPROVED") {
    return (
      <Pill tone="success" icon={Check}>
        승인됨
      </Pill>
    );
  }
  if (status === "REJECTED") return <Pill icon={X}>거절됨</Pill>;
  // 내가 취소한 신청 — 지우지 않고 기록으로 남아요. 같은 스터디에 다시 신청할 수 있어요 (#81)
  if (status === "CANCELLED") return <Pill icon={Undo2}>취소함</Pill>;
  return (
    <Pill tone="accent" icon={CircleDot}>
      대기 중
    </Pill>
  );
}
