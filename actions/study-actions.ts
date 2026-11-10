"use server";

import { findStudy, getStudies } from "@/service/study-service";

// 팀 규칙: page → actions → service (화면은 서비스를 직접 부르지 않기)

// 스터디 목록 입구 — 목록 #5
export async function loadStudyList() {
  const response = await getStudies();
  return response;
}

// 스터디 하나 입구 — 상세 #6
export async function getStudyDetail(studyId: string) {
  return findStudy(studyId);
}
