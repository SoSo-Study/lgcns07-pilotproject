import Link from "next/link";
import { CodeXml } from "lucide-react";
import { routes } from "@/config/routes";

// 로그인 · 회원가입 · 찾기: 사이드바 없이 가운데 위쪽에 로고 + 화면 (피그마 ⑤ · ⑥)
// 제목 · 카드는 각 화면이 AuthCard(components/templates/auth-card)로 그려요.
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="flex min-h-dvh flex-col items-center bg-background px-4 pt-16 pb-12">
      <Link
        href={routes.studies}
        aria-label="soso.study 홈으로"
        className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"
      >
        <CodeXml className="size-6" aria-hidden />
      </Link>
      {children}
    </main>
  );
}
