"use server";

import { studyListQuerySchema } from "@/schema/study-list-schema";
import { findStudy, getStudies } from "@/service/study-service";
import type { StudyListQuery } from "@/types/study";

// 팀 규칙: page → actions → service (화면은 서비스를 직접 부르지 않기)

// 스터디 목록 입구 — 목록 #5 · 검색/분야/정렬/쪽 번호 #9
// 🔒 서버 액션은 화면을 거치지 않고도 부를 수 있어서, 받은 조건을 여기서 한 번 더 검사해요.
export async function loadStudyList(query: StudyListQuery = {}) {
  const parsed = studyListQuerySchema.safeParse(query);
  const response = await getStudies(parsed.success ? parsed.data : {});
  return response;
}

// 스터디 하나 입구 — 상세 #6
export async function getStudyDetail(studyId: string) {
  return findStudy(studyId);
}
