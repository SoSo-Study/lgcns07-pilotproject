import { Check, X } from "lucide-react";
import { decideApplicationAction } from "@/actions/application-actions";
import { Button } from "@/components/ui/button";
import type { Application } from "@/types/study";

type ApplicantTableProps = {
  applications: Application[];
};

// "2026-11-10T10:00:00" → "2026.11.10"
function formatDate(value: string) {
  return value.slice(0, 10).replaceAll("-", ".");
}

// 피그마 ④ 신청자 표 — 신청자 · 한 줄 소개 · 신청일 · 상태/처리
export function ApplicantTable({ applications }: ApplicantTableProps) {
  // 신청이 하나도 없을 때
  // (공통 부품 EmptyState가 dev에 들어오면 그걸로 바꿔요)
  if (applications.length === 0) {
    return (
      <div className="rounded-md border border-border bg-card px-6 py-16 text-center">
        <p className="font-medium">아직 들어온 신청이 없어요</p>
        <p className="mt-1 text-sm text-muted-foreground">
          신청이 들어오면 여기에서 승인하거나 거절할 수 있어요.
        </p>
      </div>
    );
  }

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
          {applications.map((application) => (
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
                <StatusCell
                  applicationId={application.applicationId}
                  status={application.status}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 대기 중이면 승인 · 거절 버튼, 처리가 끝났으면 결과 글자
function StatusCell({
  applicationId,
  status,
}: Pick<Application, "applicationId" | "status">) {
  if (status === "APPROVED") {
    return (
      <span className="flex items-center gap-1 text-xs text-status-open">
        <Check className="size-3.5" aria-hidden />
        승인됨
      </span>
    );
  }

  if (status === "REJECTED") {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <X className="size-3.5" aria-hidden />
        거절됨
      </span>
    );
  }

  // 버튼을 누르면 폼이 서버 액션(decideApplicationAction)으로 보내져요
  // 어떤 신청인지(applicationId)는 숨은 칸으로, 승인/거절(decision)은 누른 버튼의 값으로
  return (
    <form action={decideApplicationAction} className="flex gap-2">
      <input type="hidden" name="applicationId" value={applicationId} />
      <Button type="submit" name="decision" value="APPROVED" size="sm">
        승인
      </Button>
      <Button
        type="submit"
        name="decision"
        value="REJECTED"
        size="sm"
        variant="outline"
      >
        거절
      </Button>
    </form>
  );
}
