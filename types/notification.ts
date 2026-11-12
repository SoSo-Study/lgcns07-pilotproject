// 알림 데이터 모양 — API(GET /api/v1/notifications) 응답과 같은 이름 (#83)

// 우리 앱에서 보여 줄 스터디 알림 4종류 (API 요청 17번)
// 서버는 다른 서비스 알림(채팅 · 상담 등)도 같이 줄 수 있어서, 이 4개만 골라 써요
export const STUDY_NOTIFICATION_TYPES = [
  "STUDY_APPLIED", // 누가 참여 신청 → 스터디장
  "STUDY_APPLICATION_CANCELLED", // 누가 참여 취소 → 스터디장
  "STUDY_APPLICATION_APPROVED", // 내 신청 승인 → 신청자
  "STUDY_APPLICATION_REJECTED", // 내 신청 거절 (승인 취소 포함) → 신청자
] as const;

export type StudyNotificationType = (typeof STUDY_NOTIFICATION_TYPES)[number];

// 알림 하나 (화면에서 쓰는 칸만)
export type AppNotification = {
  id: number;
  type: string; // 서버의 모든 종류가 올 수 있어서 글자로 받고, 스터디 것만 골라요
  actorName?: string | null; // 알림을 만든 사람 (예: 신청한 사람)
  title: string; // 예: "새 참여 신청"
  body: string; // 예: "front_kim 님이 'React 심화'에 참여를 신청했어요."
  linkPath?: string | null; // 누르면 갈 화면 (예: "/applicants?studyId=2")
  read: boolean;
  createdAt: string;
};
