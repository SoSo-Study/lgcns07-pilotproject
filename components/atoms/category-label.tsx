import { studyCategories } from "@/config/study-category";
import type { StudyCategory } from "@/types/study";
import { cn } from "@/lib/utils";

type CategoryLabelProps = {
  category: StudyCategory;
  className?: string;
};

// 분야 색 점 + 분야 이름 (목록 한 줄 · 상세에서 씀)
// 사용: <CategoryLabel category={study.category} />
export function CategoryLabel({ category, className }: CategoryLabelProps) {
  const { label, dot } = studyCategories[category];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-muted-foreground",
        className,
      )}
    >
      <span aria-hidden className={cn("size-2 rounded-full", dot)} />
      {label}
    </span>
  );
}
