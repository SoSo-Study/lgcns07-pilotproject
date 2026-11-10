import type { Application } from "@/types/study";

// 🧪 API가 준비되기 전에 신청자 관리 화면(④)을 만들 때 쓰는 가짜 데이터
// studyId는 lib/mock-studies.ts의 스터디 번호와 맞춰 두었어요.
// API가 연결되면 service 파일에서 이 파일 대신 fetch를 쓰고, 이 파일은 지워요.
export const mockApplications: Application[] = [
  {
    applicationId: 1,
    studyId: 2,
    applicantNickname: "next_han",
    message: "Next.js는 처음이지만 꾸준히 참여할게요!",
    status: "PENDING",
    createdAt: "2026-11-10T10:00:00",
  },
  {
    applicationId: 2,
    studyId: 2,
    applicantNickname: "ts_lim",
    message: "TypeScript로 예제 만들어 올게요",
    status: "PENDING",
    createdAt: "2026-11-10T09:30:00",
  },
  {
    applicationId: 3,
    studyId: 2,
    applicantNickname: "react_seo",
    message: "React 1년 차, 리뷰 열심히 할게요",
    status: "APPROVED",
    createdAt: "2026-11-09T20:00:00",
  },
  {
    applicationId: 4,
    studyId: 2,
    applicantNickname: "ui_baek",
    message: "프론트 신입 준비 중입니다",
    status: "APPROVED",
    createdAt: "2026-11-09T18:00:00",
  },
  {
    applicationId: 5,
    studyId: 2,
    applicantNickname: "js_moon",
    message: "주 2회 모두 참여 가능해요",
    status: "APPROVED",
    createdAt: "2026-11-08T21:00:00",
  },
  {
    applicationId: 6,
    studyId: 2,
    applicantNickname: "late_go",
    message: "시간이 맞을지 모르겠어요",
    status: "REJECTED",
    createdAt: "2026-11-08T12:00:00",
  },
  {
    applicationId: 7,
    studyId: 1,
    applicantNickname: "py_kim",
    message: "파이썬으로 같이 풀고 싶어요",
    status: "PENDING",
    createdAt: "2026-11-10T08:00:00",
  },
];
