import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/organisms/login-form";
import { AuthCard } from "@/components/templates/auth-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthNotice } from "@/config/auth-notice";
import { routes } from "@/config/routes";
import { safeCallbackUrl } from "@/lib/safe-callback-url";

// 피그마 ⑤ 로그인 — 담당: 이슈 #4
// 강사님 방식: page는 동기 함수로 두고, searchParams를 await 하는 부분은 Suspense 안 자식에서
export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <AuthCard
      title="soso.study에 로그인"
      className="max-w-xs"
      footer={
        <div className="rounded-md border border-border p-4 text-center text-sm">
          <p>
            처음이신가요?{" "}
            <Link href={routes.signup} className="text-link hover:underline">
              회원가입
            </Link>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            가입한 이메일이 기억나지 않나요?{" "}
            <Link href={routes.findId} className="text-link hover:underline">
              아이디 찾기
            </Link>
          </p>
        </div>
      }
    >
      <Suspense fallback={<Skeleton className="h-52 w-full" />}>
        <LoginFormWithParams searchParams={searchParams} />
      </Suspense>
    </AuthCard>
  );
}

// 주소의 ?callbackUrl= · ?notice= 를 검사해서 폼에 넘겨요 (서버에서)
async function LoginFormWithParams({
  searchParams,
}: Pick<PageProps<"/login">, "searchParams">) {
  const { callbackUrl, notice } = await searchParams;
  return (
    <LoginForm
      callbackUrl={safeCallbackUrl(callbackUrl)}
      notice={getAuthNotice(notice)}
    />
  );
}
