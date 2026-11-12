"use client";

import { useOptimistic, useState, useTransition } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { toggleBookmarkAction } from "@/actions/study-social-actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";

type BookmarkButtonProps = {
  studyId: number;
  bookmarked: boolean;
  bookmarkCount: number;
  isLoggedIn: boolean;
};

// 피그마 ② 정보 카드 안 "☆ 찜하기 12" (#11)
// 낙관적 업데이트(강의 11/5 좋아요): 누르면 화면을 먼저 바꾸고, 서버가 실패하면 원래대로 되돌려요
// 로그인 안 했으면 누르기 전에 로그인 화면으로 안내 (강의 11/6 "로그인이 필요한 기능입니다") — 진짜 막는 건 서버 액션
export function BookmarkButton({
  studyId,
  bookmarked,
  bookmarkCount,
  isLoggedIn,
}: BookmarkButtonProps) {
  const [saved, setSaved] = useState({ bookmarked, bookmarkCount });
  const [optimistic, setOptimistic] = useOptimistic(saved);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isLoggedIn) {
    const loginHref = `${routes.login}?callbackUrl=${encodeURIComponent(routes.study(studyId))}`;
    return (
      <Link
        href={loginHref}
        className={cn(buttonVariants({ variant: "outline" }), "w-full")}
      >
        <Star aria-hidden />
        찜하기 {bookmarkCount}
      </Link>
    );
  }

  function toggle() {
    setMessage(null);
    startTransition(async () => {
      // 1. 먼저 화면을 바꿔요 (기다리지 않게)
      setOptimistic({
        bookmarked: !optimistic.bookmarked,
        bookmarkCount:
          optimistic.bookmarkCount + (optimistic.bookmarked ? -1 : 1),
      });
      // 2. 서버에 저장 — 성공하면 서버 숫자로, 실패하면 자동으로 원래대로(낙관적 값이 사라짐)
      const result = await toggleBookmarkAction(studyId);
      if (result.ok) setSaved(result.data);
      else setMessage(result.message);
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={toggle}
        disabled={isPending}
        aria-pressed={optimistic.bookmarked}
      >
        <Star
          aria-hidden
          className={cn(
            optimistic.bookmarked && "fill-attention text-attention",
          )}
        />
        {optimistic.bookmarked ? "찜했어요" : "찜하기"}{" "}
        {optimistic.bookmarkCount}
      </Button>
      {message && (
        <p role="alert" className="text-xs text-destructive">
          {message}
        </p>
      )}
    </div>
  );
}
