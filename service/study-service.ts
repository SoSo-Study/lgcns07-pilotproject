import { mockStudies } from "@/lib/mock-studies";
import type { Study } from "@/types/study";

// 스터디 하나 찾기 (상세 화면 #6)
// 주소가 이상하거나(/studies/abc) 없는 번호면 null → 화면에서 404로 보여 줘요.
export async function findStudy(studyId: string): Promise<Study | null> {
  const id = Number(studyId);
  if (!Number.isInteger(id) || id <= 0) return null;

  // 🧪 API 연결 전: 가짜 데이터에서 찾기
  // API가 나오면 이 줄을 fetch(apiPaths.study.detail(id))로 바꿔요.
  return mockStudies.find((study) => study.studyId === id) ?? null;
}
