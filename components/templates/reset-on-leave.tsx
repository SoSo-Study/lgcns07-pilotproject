"use client";

import { Fragment, useLayoutEffect, useState, type ReactNode } from "react";

type ResetOnLeaveProps = {
  /** 화면을 떠나면 처음 상태로 되돌릴 부분 (폼 등) */
  children: ReactNode;
};

/**
 * 이 화면을 떠나면 안쪽을 처음 상태로 되돌려요 — 입력값 · 에러 문구 · 인증 진행 상태 전부.
 * 🔒 이메일 · 비밀번호처럼 남아 있으면 안 되는 입력이 있는 폼을 감싸요.
 *
 * 왜 필요한가요?
 * `cacheComponents`를 켜면 Next는 화면을 떠날 때 지우지 않고 숨겨만 둬요(React `<Activity>`).
 * 그래서 다른 화면에 갔다 돌아오면 입력해 둔 값이 그대로 보여요. 최근 화면 3개까지 그래요.
 *
 * 어떻게 지우나요?
 * 화면이 숨겨질 때 effect의 정리 함수가 불려요. 그때 `key`를 바꿔서 안쪽을 새로 만들어요.
 * (Next 문서 "Preserving UI state"의 방법: useLayoutEffect 정리 함수에서 되돌리기)
 *
 * @example
 * <ResetOnLeave>
 *   <SignupForm />
 * </ResetOnLeave>
 */
export function ResetOnLeave({ children }: ResetOnLeaveProps) {
  const [resetKey, setResetKey] = useState(0);

  useLayoutEffect(() => {
    // 정리 함수 = 이 화면이 숨겨지는 순간. 숨겨지기 전에 바로 지워요
    return () => setResetKey((current) => current + 1);
  }, []);

  // key가 바뀌면 React가 안쪽을 버리고 새로 만들어요 → 입력칸도 상태도 처음으로
  return <Fragment key={resetKey}>{children}</Fragment>;
}
