import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

type EmptyStateProps = {
  title: string; // 예: "아직 스터디가 없어요"
  description?: string;
  action?: ReactNode; // 예: 모집글 등록 버튼
};

// 목록이 비었을 때 · 검색 결과가 없을 때
// 사용: <EmptyState title="검색 결과가 없어요" description="다른 단어로 찾아보세요." />
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <Inbox className="size-8 text-subtle" aria-hidden />
      <p className="font-medium">{title}</p>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
