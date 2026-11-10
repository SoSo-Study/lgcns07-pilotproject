import type { StudySummary } from "@/types/study";

type StudySelectProps = {
  studies: Pick<StudySummary, "studyId" | "title">[];
  selectedId: number;
};

// 피그마 ④ 오른쪽 위 "스터디: React 심화 스터디 ▾"
// 강사님 방식 GET 폼: 고르고 "보기"를 누르면 주소가 /applicants?studyId=3 으로 바뀌어요
export function StudySelect({ studies, selectedId }: StudySelectProps) {
  return (
    <form className="flex items-center gap-2">
      <label htmlFor="studyId" className="text-xs text-muted-foreground">
        스터디
      </label>
      <select
        id="studyId"
        name="studyId"
        defaultValue={selectedId}
        className="h-8 max-w-60 truncate rounded-md border border-border bg-card px-2 text-sm"
      >
        {studies.map((study) => (
          <option key={study.studyId} value={study.studyId}>
            {study.title}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="h-8 rounded-md border border-border px-3 text-sm hover:bg-muted"
      >
        보기
      </button>
    </form>
  );
}
