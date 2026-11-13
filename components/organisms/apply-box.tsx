import Link from "next/link";
import { Check, Clock, LogIn, Users } from "lucide-react";
import { ApplyForm } from "@/components/organisms/apply-form";
import { CancelApplyButton } from "@/components/organisms/cancel-apply-button";
import { Pill } from "@/components/atoms/pill";
import { Button, buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { daysLeft } from "@/lib/days-left";
import type { Study } from "@/types/study";

type ApplyBoxProps = {
  study: Pick<
    Study,
    | "id"
    | "status"
    | "currentMembers"
    | "maxMembers"
    | "deadline"
    | "myApplicationStatus"
  >;
  isLoggedIn: boolean;
  isAuthor: boolean;
};

// 피그마 ② 정보 카드 아래 "참여 신청" 자리 (#8)
// 내 상황에 따라 하나만 보여 줘요. 위에서부터 순서대로 걸러요.
//   내 글 → 로그인 안 함 → 승인됨 → 대기 중 → 거절됨 → 마감 → 신청 폼
// 화면은 "안내"만 하고, 진짜 막는 건 서버예요 (중복 · 자리 없음 · 마감 · 내 글 → 서버 message)
export function ApplyBox({ study, isLoggedIn, isAuthor }: ApplyBoxProps) {
  // 1. 내가 만든 스터디 → 신청 대신 ④ 신청자 관리로
  if (isAuthor) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground">내가 만든 스터디예요.</p>
        <Link
          href={`${routes.applicants}?studyId=${study.id}`}
          className={buttonVariants({
            variant: "outline",
            className: "w-full",
          })}
        >
          <Users aria-hidden />
          신청자 관리
        </Link>
      </div>
    );
  }

  // 2. 로그인 안 함 → 로그인하고 이 화면으로 돌아오기 (#4와 같은 방식)
  if (!isLoggedIn) {
    const loginHref = `${routes.login}?callbackUrl=${encodeURIComponent(routes.study(study.id))}`;
    return (
      <div className="flex flex-col gap-2">
        <Link
          href={loginHref}
          className={buttonVariants({ className: "w-full" })}
        >
          <LogIn aria-hidden />
          로그인하고 신청하기
        </Link>
        <p className="text-xs text-muted-foreground">
          참여 신청은 로그인한 뒤에 할 수 있어요.
        </p>
      </div>
    );
  }

  // 3. 이미 신청한 경우 — 서버가 내 기준으로 준 상태(myApplicationStatus)로 나눠요
  if (study.myApplicationStatus === "APPROVED") {
    return (
      <div className="flex flex-col gap-2">
        <Pill tone="success" icon={Check} className="self-start">
          참여 중이에요
        </Pill>
        <CancelApplyButton studyId={study.id} approved />
      </div>
    );
  }

  if (study.myApplicationStatus === "PENDING") {
    return (
      <div className="flex flex-col gap-2">
        <Pill tone="accent" icon={Clock} className="self-start">
          신청했어요 · 스터디장 확인 중
        </Pill>
        <CancelApplyButton studyId={study.id} approved={false} />
      </div>
    );
  }

  if (study.myApplicationStatus === "REJECTED") {
    return (
      <p className="text-xs text-muted-foreground">
        이번 스터디는 함께하지 못하게 됐어요. 거절된 스터디는 다시 신청할 수
        없어요.
      </p>
    );
  }

  // 4. 모집이 끝남 (마감 상태 · 자리 없음 · 마감일 지남)
  const isClosed =
    study.status === "CLOSED" ||
    study.currentMembers >= study.maxMembers ||
    daysLeft(study.deadline) < 0;
  if (isClosed) {
    return (
      <Button disabled className="w-full">
        모집이 마감됐어요
      </Button>
    );
  }

  // 5. 신청할 수 있어요
  return <ApplyForm studyId={study.id} />;
}
