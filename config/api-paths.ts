// 강사님 API 주소 모음 — 서버 주소 앞부분은 .env.local의 API_URL (lib/env.ts에서 읽어요)
// 11/11 스웨거로 확인한 실제 주소예요. 주소가 바뀌면 이 파일만 고치면 돼요.
export const apiPaths = {
  auth: {
    login: "/api/v1/auth/login",
    refresh: "/api/v1/auth/refresh",
    logout: "/api/v1/auth/logout",
    me: "/api/v1/auth/me",
    signup: "/api/v1/auth/register",
    checkEmail: "/api/v1/auth/check-email",
    sendCode: "/api/v1/auth/email/send-code",
    verifyCode: "/api/v1/auth/email/verify-code",
    findId: "/api/v1/auth/find-id",
    passwordForgot: "/api/v1/auth/password/forgot",
    passwordReset: "/api/v1/auth/password/reset",
    changePassword: "/api/v1/users/me/password", // 로그인한 채 바꾸기
  },
  study: {
    list: "/api/v1/studies",
    detail: (studyId: number | string) => `/api/v1/studies/${studyId}`,
    create: "/api/v1/studies",
    update: (studyId: number | string) => `/api/v1/studies/${studyId}`,
    remove: (studyId: number | string) => `/api/v1/studies/${studyId}`,
    mine: "/api/v1/studies/me",
    comments: (studyId: number | string) =>
      `/api/v1/studies/${studyId}/comments`,
    bookmarks: (studyId: number | string) =>
      `/api/v1/studies/${studyId}/bookmarks`,
    tags: "/api/v1/tags",
  },
  application: {
    apply: (studyId: number | string) =>
      `/api/v1/studies/${studyId}/applications`,
    cancel: (studyId: number | string) =>
      `/api/v1/studies/${studyId}/applications/me`,
    listByStudy: (studyId: number | string) =>
      `/api/v1/studies/${studyId}/applications`,
    decide: (applicationId: number | string) =>
      `/api/v1/applications/${applicationId}`,
    mine: "/api/v1/applications/me",
  },
  // 🔔 알림 (#83) — 스터디 알림 종류는 API 요청 17번
  notification: {
    list: "/api/v1/notifications", // ?unreadOnly=false&limit=50
    read: (notificationId: number | string) =>
      `/api/v1/notifications/${notificationId}/read`, // PATCH 하나 읽음
    readMany: "/api/v1/notifications/read", // POST { ids } 여러 개 읽음
  },
} as const;
