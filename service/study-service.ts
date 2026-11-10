import type { ApiResponse } from "@/types/api-response";
import type { StudyListData } from "@/types/study";
import { mockStudies } from "@/lib/mock-studies";

// 스터디 목록 가져오기 (🧪 지금은 가짜 데이터, API가 오면 fetch로 바꿈)
export async function getStudies(): Promise<ApiResponse<StudyListData>> {
  return {
    success: true,
    code: 200,
    message: "",
    data: {
      studies: mockStudies,
      currentPage: 1,
      totalPages: 1,
      totalItems: mockStudies.length,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };
}
