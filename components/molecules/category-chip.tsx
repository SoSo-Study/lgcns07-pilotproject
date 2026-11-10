import Link from "next/link";
import { Asterisk } from "lucide-react";
import { studyCategories } from "@/config/study-category";
import type { StudyCategory } from "@/types/study";
import { cn } from "@/lib/utils";

type CategoryChipProps = {
  category: StudyCategory | "ALL"; // "ALL" = 전체
  href: string; // 누르면 갈 주소 (거르기 조건은 주소에: ?category=FRONTEND)
  selected?: boolean;
  count?: number;
};

// 피그마 CategoryChip — 분야 거르기 칩. 선택되면 그 분야 색으로 바뀜
// 사용: <CategoryChip category="FRONTEND" href="/studies?category=FRONTEND" selected count={4} />
export function CategoryChip({
  category,
  href,
  selected = false,
  count,
}: CategoryChipProps) {
  const isAll = category === "ALL";
  const label = isAll ? "전체" : studyCategories[category].label;

  const selectedStyle = isAll
    ? "border-foreground bg-muted font-bold text-foreground"
    : cn("font-bold", studyCategories[category].chip);

  return (
    <Link
      href={href}
      aria-current={selected ? "true" : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs whitespace-nowrap transition-colors",
        selected
          ? selectedStyle
          : "border-border text-foreground hover:bg-muted",
      )}
    >
      {isAll ? (
        <Asterisk className="size-3 text-muted-foreground" aria-hidden />
      ) : (
        <span
          aria-hidden
          className={cn("size-2 rounded-full", studyCategories[category].dot)}
        />
      )}
      {label}
      {count !== undefined && (
        <span className="font-mono text-muted-foreground">{count}</span>
      )}
    </Link>
  );
}
