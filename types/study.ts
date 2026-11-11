// 스터디 · 신청 데이터 모양 — 강사님 API 응답과 같은 이름 (11/11 스웨거 확인, #46 1-3)

export type StudyCategory =
  "FRONTEND" | "BACKEND" | "ALGORITHM" | "CS" | "INTERVIEW";

export type StudyStatus = "OPEN" | "CLOSED";

export type StudyMode = "ONLINE" | "OFFLINE" | "BOTH";

export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

// GET /api/v1/studies/{id} (상세)
export type Study = {
  id: number;
  title: string;
  category: StudyCategory;
  techTags: string[];
  status: StudyStatus;
  currentMembers: number;
  maxMembers: number;
  deadline: string; // "2026-11-20" (날짜만)
  mode: StudyMode;
  content: string;
  authorId: number;
  authorName: string;
  createdAt: string; // "2026-11-11T07:29:22Z" (UTC)
  updatedAt?: string | null;
  myApplicationStatus?: ApplicationStatus | null; // 로그인했을 때만 내 기준
  commentCount?: number;
  bookmarkCount?: number;
  bookmarked?: boolean;
};

// 목록 한 줄 (GET /api/v1/studies · /studies/me의 items)
export type StudySummary = Pick<
  Study,
  | "id"
  | "title"
  | "category"
  | "techTags"
  | "status"
  | "currentMembers"
  | "maxMembers"
  | "deadline"
  | "authorId"
  | "authorName"
  | "createdAt"
> & {
  pendingCount?: number | null; // 내 모집글에서만 숫자 (대기 중 신청 수)
};

// 강사님 목록 응답 공통 모양 (PageResponse) — page는 0부터!
export type PageData<T> = {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type StudyListData = PageData<StudySummary> & {
  // 아래 개수는 "쪽과 상관없이" 조건에 맞는 전체 기준 (#14 1번)
  openCount: number; // 표 머리줄 "모집 중 9"
  closedCount: number; // 표 머리줄 "마감 3"
  categoryCounts: Record<StudyCategory | "ALL", number>; // 분야 칩 숫자 (검색어만 반영)
};

// 신청 하나 (GET /studies/{id}/applications · PATCH /applications/{id})
export type Application = {
  id: number;
  studyId?: number; // 신청자 목록(9번)엔 없고, 신청 · 승인 응답에만 있어요
  applicantId: number;
  applicantName: string;
  message: string;
  status: ApplicationStatus;
  createdAt: string;
};

// 목록을 가져올 때 보내는 조건 (주소의 ?q=&category=&sort=&page= 와 짝)
export type StudyListQuery = {
  q?: string; // 검색어
  category?: StudyCategory; // 분야
  sort?: "latest" | "oldest"; // 최신순 / 오래된순
  page?: number; // 쪽 번호 — 주소는 1부터 (API로 보낼 때 -1)
};
