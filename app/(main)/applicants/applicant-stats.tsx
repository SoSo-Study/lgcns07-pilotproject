import type { Application } from "@/types/study";

type ApplicantStatsProps = {
  applications: Application[];
  currentMembers: number;
  maxMembers: number;
};

// 피그마 ④ 위쪽 숫자 카드 4개 — 대기 · 승인 · 거절 · 모집 인원
// 받은 신청 목록에서 상태별 개수를 세서 보여 줘요.
export function ApplicantStats({
  applications,
  currentMembers,
  maxMembers,
}: ApplicantStatsProps) {
  const pendingCount = applications.filter(
    (application) => application.status === "PENDING",
  ).length;
  const approvedCount = applications.filter(
    (application) => application.status === "APPROVED",
  ).length;
  const rejectedCount = applications.filter(
    (application) => application.status === "REJECTED",
  ).length;

  const stats = [
    { label: "대기 중", value: String(pendingCount), color: "text-attention" },
    { label: "승인", value: String(approvedCount), color: "text-status-open" },
    { label: "거절", value: String(rejectedCount), color: "text-destructive" },
    {
      label: "모집 인원",
      value: `${currentMembers} / ${maxMembers}`,
      color: "text-link",
    },
  ];

  return (
    <dl className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-md border border-border bg-card px-4 py-3"
        >
          <dt className="text-xs text-muted-foreground">{stat.label}</dt>
          <dd className={`mt-1 font-mono text-2xl font-bold ${stat.color}`}>
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
