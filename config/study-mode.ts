import type { StudyMode } from "@/types/study";

// 진행 방식 한국어 이름. 화면에 "ONLINE" 같은 코드를 그대로 보여 주지 않기 위해 씀
// 사용: studyModeLabels[study.mode] → "온라인"
export const studyModeLabels: Record<StudyMode, string> = {
  ONLINE: "온라인",
  OFFLINE: "오프라인",
  BOTH: "온·오프라인",
};
