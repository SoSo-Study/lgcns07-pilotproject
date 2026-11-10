import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: ReactNode; // 글자 또는 부품 (예: 제목 + 흐린 번호 #12)
  description?: ReactNode; // 글자 또는 부품 (예: 상태 뱃지 + 작성자 줄)
  action?: ReactNode; // 오른쪽 버튼 자리 (예: "+ 모집글 등록")
  className?: string; // 예: 아래 구분선 "border-b pb-4"
};

// 모든 화면 맨 위 제목 줄 (피그마 ① "스터디 둘러보기" 제목 모양)
export function PageHeader({
  title,
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn("mb-6 flex items-start justify-between gap-4", className)}
    >
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && (
          <div className="mt-1 text-sm text-muted-foreground">
            {description}
          </div>
        )}
      </div>
      {action}
    </header>
  );
}
