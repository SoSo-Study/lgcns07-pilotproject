import type { Application, ApplicationStatus } from "@/types/study";

type ApplicantStatsProps = {
  applications: Application[];
  currentMembers: number;
  maxMembers: number;
};

// 피그마 ④ 위쪽 숫자 카드 5개 — 대기 · 승인 · 거절 · 취소 · 모집 인원
// 받은 신청 목록에서 상태별 개수를 세서 보여 줘요.
// 취소(CANCELLED)는 신청자가 직접 취소한 신청이에요 — 지우지 않고 기록으로 남아요 (#81)
export function ApplicantStats({
  applications,
  currentMembers,
  maxMembers,
}: ApplicantStatsProps) {
  // 상태 하나를 주면 그 상태인 신청이 몇 개인지 세요
  const count = (status: ApplicationStatus) =>
    applications.filter((application) => application.status === status).length;

  const stats = [
    {
      label: "대기 중",
      value: String(count("PENDING")),
      color: "text-attention",
    },
    {
      label: "승인",
      value: String(count("APPROVED")),
      color: "text-status-open",
    },
    {
      label: "거절",
      value: String(count("REJECTED")),
      color: "text-destructive",
    },
    {
      label: "취소",
      value: String(count("CANCELLED")),
      color: "text-muted-foreground",
    },
    {
      label: "모집 인원",
      value: `${currentMembers} / ${maxMembers}`,
      color: "text-link",
    },
  ];

  return (
    <dl className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
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
