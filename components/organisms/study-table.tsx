import type { ReactNode } from "react";
import { CircleCheck, CircleDot } from "lucide-react";
import { studyColumns, StudyRow } from "@/components/organisms/study-row";
import { EmptyState } from "@/components/templates/empty-state";
import type { StudySummary } from "@/types/study";

type StudyTableProps = {
  studies: StudySummary[];
  /** 머리줄 "모집 중 9" — 안 주면 받은 목록에서 세요. 쪽이 나뉜 목록은 서버가 준 전체 숫자를 넘겨요 */
  openCount?: number;
  /** 머리줄 "마감 3" — 안 주면 받은 목록에서 세요 */
  closedCount?: number;
  empty?: ReactNode; // 비었을 때 보여 줄 것 (없으면 기본 문구)
};

// 피그마 ① 스터디 표 — 머리줄 + StudyRow 여러 줄 + 비었을 때 화면
// 사용: <StudyTable studies={studies} /> · 쪽 번호가 있는 목록: <StudyTable studies={studies} openCount={9} closedCount={3} />
export function StudyTable({
  studies,
  openCount = studies.filter((study) => study.status === "OPEN").length,
  closedCount = studies.filter((study) => study.status === "CLOSED").length,
  empty,
}: StudyTableProps) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-card">
      <div className="flex items-center gap-4 bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground">
        <div className="flex flex-1 items-center gap-4">
          <span className="flex items-center gap-1.5 font-bold text-foreground">
            <CircleDot className="size-4" aria-hidden />
            모집 중
            <Count value={openCount} />
          </span>
          <span className="flex items-center gap-1.5">
            <CircleCheck className="size-4" aria-hidden />
            마감
            <Count value={closedCount} />
          </span>
        </div>
        {/* 칸 이름은 표 모양(1024px 이상)일 때만 */}
        <span className={`hidden lg:block ${studyColumns.members}`}>인원</span>
        <span className={`hidden lg:block ${studyColumns.deadline}`}>
          마감일
        </span>
        <span className={`hidden lg:block ${studyColumns.author}`}>
          스터디장
        </span>
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
            <StudyRow key={study.id} study={study} />
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
