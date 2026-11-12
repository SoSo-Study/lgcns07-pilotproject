import Link from "next/link";
import { KeyRound } from "lucide-react";
import { LogoutButton } from "@/components/molecules/logout-button";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";
import type { MyAccount } from "@/types/auth";

type ProfileCardProps = {
  account: Pick<MyAccount, "name" | "email" | "statusMessage">;
};

// 피그마 ⑧ 왼쪽 카드 — 이니셜 · 이름 · 이메일 + 비밀번호 바꾸기 · 로그아웃
// 🔒 이메일은 본인 화면에서만 보여 줘요 (목록 · 상세 · 신청자 목록에는 안 내보내요, #45 D2)
export function ProfileCard({ account }: ProfileCardProps) {
  return (
    <aside className="flex flex-col gap-4 rounded-md border border-border bg-card p-5 lg:w-72 lg:shrink-0">
      <span
        aria-hidden
        className="flex size-20 items-center justify-center rounded-full bg-link-subtle font-mono text-3xl font-bold text-link"
      >
        {account.name.charAt(0).toUpperCase()}
      </span>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="truncate font-mono text-xl font-bold">{account.name}</p>
        <p className="truncate text-sm text-muted-foreground">
          {account.email}
        </p>
        {account.statusMessage && (
          <p className="text-sm text-muted-foreground">
            {account.statusMessage}
          </p>
        )}
      </div>

      <dl className="flex flex-col gap-2 border-t border-border pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">로그인 방식</dt>
          <dd>이메일</dd>
        </div>
      </dl>

      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <Link
          href={`${routes.profile}?tab=password`}
          className={cn(buttonVariants({ variant: "outline" }), "w-full")}
        >
          <KeyRound aria-hidden />
          비밀번호 바꾸기
        </Link>
        <LogoutButton labelPosition="right" className="w-full justify-center" />
      </div>
    </aside>
  );
}
