import { Check, X } from "lucide-react";
import { DecisionButtons } from "./decision-buttons";
import { Pill } from "@/components/atoms/pill";
import { EmptyState } from "@/components/templates/empty-state";
import { formatDate } from "@/lib/format-date";
import type { Application } from "@/types/study";

type ApplicantTableProps = {
  applications: Application[];
  isFull: boolean; // 스터디 자리가 다 찼는지 → 다 찼으면 [승인]을 막아요
};

// 대기 중인 신청을 맨 위로, 같은 상태끼리는 최신 신청이 위로
// (스터디장이 처리해야 할 것부터 보이게)
function pendingFirst(a: Application, b: Application) {
  const aPending = a.status === "PENDING" ? 0 : 1;
  const bPending = b.status === "PENDING" ? 0 : 1;
  if (aPending !== bPending) return aPending - bPending;
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
  const sorted = [...applications].sort(pendingFirst);

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
            <tr
              key={application.applicationId}
              className="border-t border-border"
            >
              <td className="px-4 py-3">
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="flex size-6 items-center justify-center rounded-full bg-link-subtle font-mono text-xs font-bold text-link"
                  >
                    {application.applicantNickname.charAt(0).toUpperCase()}
                  </span>
                  <span className="font-mono">
                    {application.applicantNickname}
                  </span>
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
  if (application.status === "APPROVED") {
    return (
      <Pill tone="success" icon={Check}>
        승인됨
      </Pill>
    );
  }

  if (application.status === "REJECTED") {
    return <Pill icon={X}>거절됨</Pill>;
  }

  return (
    <DecisionButtons
      applicationId={application.applicationId}
      canApprove={!isFull}
    />
  );
}
