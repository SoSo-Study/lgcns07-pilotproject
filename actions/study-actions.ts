"use server";

import { findStudy } from "@/service/study-service";

// 팀 규칙: page → actions → service
export async function getStudyDetail(studyId: string) {
  return findStudy(studyId);
}
