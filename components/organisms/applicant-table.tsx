import { Check, Undo2, X } from "lucide-react";
import { DecisionButtons } from "@/components/organisms/decision-buttons";
import { RevokeApprovalButton } from "@/components/organisms/revoke-approval-button";
import { Pill } from "@/components/atoms/pill";
import { EmptyState } from "@/components/templates/empty-state";
import { formatDate } from "@/lib/format-date";
import type { Application } from "@/types/study";

type ApplicantTableProps = {
  applications: Application[];
  isFull: boolean; // 스터디 자리가 다 찼는지 → 다 찼으면 [승인]을 막아요
};

// 표 순서: 대기 중(처리할 것) → 승인 · 거절 → 취소함(지나간 기록)은 맨 아래 (#81)
// 같은 묶음끼리는 최신 신청이 위로
const ORDER: Record<Application["status"], number> = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 1,
  CANCELLED: 2,
};

function byStatusThenLatest(a: Application, b: Application) {
  if (ORDER[a.status] !== ORDER[b.status]) {
    return ORDER[a.status] - ORDER[b.status];
  }
  return b.createdAt.localeCompare(a.createdAt);
}

// 피그마 ④ 신청자 표 — 신청자 · 한 줄 소개 · 신청일 · 상태/처리
export function ApplicantTable({ applications, isFull }: ApplicantTableProps) {
  // 신청이 하나도 없을 때 (팀 공통 부품)
  if (applications.length === 0) {
    return (
      <div className="rounded-md border border-border bg-card">
        <EmptyState
          title="아직 들어온 신청이 없어요"
          description="신청이 들어오면 여기에서 승인하거나 거절할 수 있어요."
        />
      </div>
    );
  }

  // 원본 목록은 그대로 두고, 복사본을 정렬해요
  const sorted = [...applications].sort(byStatusThenLatest);

  return (
    <div className="overflow-hidden rounded-md border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
          <tr>
            <th className="px-4 py-2.5 font-normal">신청자</th>
            <th className="px-4 py-2.5 font-normal">한 줄 소개</th>
            <th className="px-4 py-2.5 font-normal">신청일</th>
            <th className="px-4 py-2.5 font-normal">상태 / 처리</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((application) => (
            <tr key={application.id} className="border-t border-border">
              <td className="px-4 py-3">
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="flex size-6 items-center justify-center rounded-full bg-link-subtle font-mono text-xs font-bold text-link"
                  >
                    {application.applicantName.charAt(0).toUpperCase()}
                  </span>
                  <span className="font-mono">{application.applicantName}</span>
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {application.message}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {formatDate(application.createdAt)}
              </td>
              <td className="px-4 py-3">
                <StatusCell application={application} isFull={isFull} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 대기 중이면 승인 · 거절 버튼, 처리가 끝났으면 결과 뱃지 (팀 공통 Pill)
function StatusCell({
  application,
  isFull,
}: {
  application: Application;
  isFull: boolean;
}) {
  // 승인됨 + [승인 취소] (#82)
  if (application.status === "APPROVED") {
    return (
      <span className="flex flex-wrap items-center gap-2">
        <Pill tone="success" icon={Check}>
          승인됨
        </Pill>
        <RevokeApprovalButton applicationId={application.id} />
      </span>
    );
  }

  if (application.status === "REJECTED") {
    return <Pill icon={X}>거절됨</Pill>;
  }

  // 신청자가 직접 취소한 신청 — 버튼 없이 기록만 (#81)
  if (application.status === "CANCELLED") {
    return (
      <span className="flex flex-col items-start gap-1">
        <Pill icon={Undo2}>취소함</Pill>
        {application.cancelledAt && (
          <span className="font-mono text-xs text-muted-foreground">
            {formatDate(application.cancelledAt)} 취소
          </span>
        )}
      </span>
    );
  }

  return (
    <DecisionButtons applicationId={application.id} canApprove={!isFull} />
  );
}
