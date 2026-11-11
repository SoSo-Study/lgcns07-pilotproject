// 스터디 · 신청 데이터 모양 (가안 — 스웨거가 나오면 맞춰서 고치기)

export type StudyCategory =
  "FRONTEND" | "BACKEND" | "ALGORITHM" | "CS" | "INTERVIEW";

export type StudyStatus = "OPEN" | "CLOSED";

export type StudyMode = "ONLINE" | "OFFLINE" | "BOTH";

export type Study = {
  studyId: number;
  title: string;
  category: StudyCategory;
  techTags: string[];
  status: StudyStatus;
  currentMembers: number;
  maxMembers: number;
  deadline: string; // "2026-11-20"
  mode: StudyMode;
  content: string;
  authorNickname: string;
  createdAt: string;
};

// 목록 화면에서 쓰는 한 줄 (본문은 빼고)
export type StudySummary = Omit<Study, "content" | "mode">;

export type StudyListData = {
  studies: StudySummary[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  // 아래 개수는 "쪽과 상관없이" 조건에 맞는 전체 기준 (API 요청서 #14의 1번)
  openCount: number; // 표 머리줄 "모집 중 9"
  closedCount: number; // 표 머리줄 "마감 3"
  categoryCounts: Record<StudyCategory | "ALL", number>; // 분야 칩 숫자 (검색어만 반영)
};

export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type Application = {
  applicationId: number;
  studyId: number;
  applicantNickname: string;
  message: string;
  status: ApplicationStatus;
  createdAt: string;
};

// 목록을 가져올 때 보내는 조건 (주소의 ?q=&category=&sort=&page= 와 짝)
export type StudyListQuery = {
  q?: string; // 검색어
  category?: StudyCategory; // 분야
  sort?: "latest" | "oldest"; // 최신순 / 오래된순
  page?: number; // 쪽 번호 (1부터)
};
