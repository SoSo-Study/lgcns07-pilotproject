import Link from "next/link";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";
import type { ProfileTab } from "@/schema/profile-schema";

type ProfileTabsProps = {
  current: ProfileTab;
  appliedCount: number;
  mineCount: number;
};

// 피그마 ⑧ 탭 — 주소(?tab=)를 바꾸는 링크라서 클라이언트 상태가 필요 없어요
// 찜한 스터디는 "찜 목록" API가 아직 없어서 여유(#11)로 표시만
export function ProfileTabs({
  current,
  appliedCount,
  mineCount,
}: ProfileTabsProps) {
  const tabs = [
    { key: "applied", label: "신청한 스터디", count: appliedCount },
    { key: "mine", label: "내 모집글", count: mineCount },
  ] as const;

  return (
    <nav aria-label="프로필 탭" className="flex gap-6 border-b border-border">
      {tabs.map((tab) => {
        const selected = current === tab.key;
        return (
          <Link
            key={tab.key}
            href={`${routes.profile}?tab=${tab.key}`}
            aria-current={selected ? "page" : undefined}
            className={cn(
              "-mb-px flex items-center gap-1.5 border-b-2 pb-2 text-sm",
              selected
                ? "border-marker font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
            <span className="rounded-full bg-muted px-1.5 font-mono text-xs text-muted-foreground">
              {tab.count}
            </span>
          </Link>
        );
      })}
      <span className="-mb-px flex items-center gap-1.5 border-b-2 border-transparent pb-2 text-sm text-subtle">
        찜한 스터디
        <span className="rounded-full border border-border px-1.5 text-xs">
          여유
        </span>
      </span>
    </nav>
  );
}
