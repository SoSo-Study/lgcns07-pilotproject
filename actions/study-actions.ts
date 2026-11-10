"use server";

import { getStudies } from "@/service/study-service";

// 스터디 목록 입구 — 화면은 이 함수만 부른다 (서비스를 직접 부르지 않기)
export async function loadStudyList() {
  const response = await getStudies();
  return response;
}
