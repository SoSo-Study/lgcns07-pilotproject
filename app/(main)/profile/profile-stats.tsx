type ProfileStatsProps = {
  createdCount: number;
  appliedCount: number;
  approvedCount: number;
  pendingCount: number;
};

// 피그마 ⑧ 숫자 카드 4개 (④ 신청자 관리 숫자 카드와 같은 모양)
// 참여 중 · 대기 중은 "내가 신청한 스터디" 목록에서 화면이 세요
export function ProfileStats({
  createdCount,
  appliedCount,
  approvedCount,
  pendingCount,
}: ProfileStatsProps) {
  const stats = [
    { label: "만든 스터디", value: createdCount, color: "text-link" },
    { label: "신청한 스터디", value: appliedCount, color: "text-foreground" },
    { label: "참여 중", value: approvedCount, color: "text-status-open" },
    { label: "대기 중", value: pendingCount, color: "text-attention" },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col gap-0.5 rounded-md border border-border bg-card px-4 py-3"
        >
          <dt className="text-xs text-muted-foreground">{stat.label}</dt>
          <dd className={`font-mono text-2xl font-bold ${stat.color}`}>
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
