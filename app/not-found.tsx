import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/atoms/logo";
import { EmptyState } from "@/components/templates/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없어요",
};

// 없는 주소(/asdf · /studies/1/extra · /login/x)로 오면 나오는 화면 (#95)
// 루트 layout 안에서만 그려져서 사이드바가 없어요 → 로그인 화면처럼 로고 + 가운데 안내
// (없는 글 번호 /studies/99999는 상세 폴더의 not-found.tsx가 따로 맡아요)
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center bg-background px-4 pt-16 pb-12">
      <Link href={routes.studies} className="mb-4">
        <Logo size={48} alt="soso.study 홈으로" />
      </Link>
      <EmptyState
        title="페이지를 찾을 수 없어요"
        description="주소가 잘못됐거나 사라진 페이지예요."
        action={
          <Link
            href={routes.studies}
            className={buttonVariants({ variant: "outline" })}
          >
            목록으로
          </Link>
        }
      />
    </main>
  );
}
