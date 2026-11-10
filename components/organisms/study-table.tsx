import type { ReactNode } from "react";
import { CircleCheck, CircleDot } from "lucide-react";
import { studyColumns, StudyRow } from "@/components/organisms/study-row";
import { EmptyState } from "@/components/templates/empty-state";
import type { StudySummary } from "@/types/study";

type StudyTableProps = {
  studies: StudySummary[];
  openCount?: number; // 머리줄 "모집 중 9" (백엔드 값이 있으면 그걸로)
  closedCount?: number; // 머리줄 "마감 3"
  empty?: ReactNode; // 비었을 때 보여 줄 것 (없으면 기본 문구)
};

// 피그마 ① 스터디 표 — 머리줄 + StudyRow 여러 줄 + 비었을 때 화면
// 사용: <StudyTable studies={data.studies} openCount={9} closedCount={3} />
export function StudyTable({
  studies,
  openCount,
  closedCount,
  empty,
}: StudyTableProps) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-card">
      <div className="flex items-center gap-4 bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground">
        <div className="flex flex-1 items-center gap-4">
          <span className="flex items-center gap-1.5 font-bold text-foreground">
            <CircleDot className="size-4" aria-hidden />
            모집 중{openCount !== undefined && <Count value={openCount} />}
          </span>
          <span className="flex items-center gap-1.5">
            <CircleCheck className="size-4" aria-hidden />
            마감
            {closedCount !== undefined && <Count value={closedCount} />}
          </span>
        </div>
        <span className={studyColumns.members}>인원</span>
        <span className={studyColumns.deadline}>마감일</span>
        <span className={studyColumns.author}>스터디장</span>
      </div>

      {studies.length === 0 ? (
        <div className="border-t border-border">
          {empty ?? (
            <EmptyState
              title="아직 스터디가 없어요"
              description="첫 모집글을 올려 보세요."
            />
          )}
        </div>
      ) : (
        <ul>
          {studies.map((study) => (
            <StudyRow key={study.studyId} study={study} />
          ))}
        </ul>
      )}
    </div>
  );
}

function Count({ value }: { value: number }) {
  return (
    <span className="rounded-full bg-muted px-1.5 font-mono text-xs text-muted-foreground">
      {value}
    </span>
  );
}
