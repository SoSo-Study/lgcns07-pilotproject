"use client";

import Form from "next/form";
import { routes } from "@/config/routes";
import type { StudySummary } from "@/types/study";

type StudySelectProps = {
  studies: Pick<StudySummary, "id" | "title" | "pendingCount">[];
  selectedId: number;
};

// 피그마 ④ 오른쪽 위 "스터디: React 심화 스터디 ▾"
// 스터디를 고르면 바로 주소가 /applicants?studyId=3 으로 바뀌어요 ([보기] 버튼 없이) (#75)
// next/form의 Form: GET 폼인데 페이지 전체를 새로 불러오지 않고 화면만 바꿔요
export function StudySelect({ studies, selectedId }: StudySelectProps) {
  return (
    <Form action={routes.applicants} className="flex items-center gap-2">
      <label htmlFor="studyId" className="text-xs text-muted-foreground">
        스터디
      </label>
      <select
        // 뒤로 가기로 다른 스터디가 되면 선택값도 맞춰서 다시 그려요
        key={selectedId}
        id="studyId"
        name="studyId"
        defaultValue={selectedId}
        // 고르는 순간 폼을 보내요 → 주소가 바뀌고 표가 새로 그려져요
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className="h-8 max-w-60 truncate rounded-md border border-border bg-card px-2 text-sm"
      >
        {studies.map((study) => (
          <option key={study.id} value={study.id}>
            {/* 처리할 신청이 있는 스터디만 "· 대기 2"를 붙여요 (서버가 준 pendingCount) */}
            {study.pendingCount
              ? `${study.title} · 대기 ${study.pendingCount}`
              : study.title}
          </option>
        ))}
      </select>
    </Form>
  );
}
