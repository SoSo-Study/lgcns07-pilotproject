import Link from "next/link";
import { SignupForm } from "@/components/organisms/signup-form";
import { AuthCard } from "@/components/templates/auth-card";
import { ResetOnLeave } from "@/components/templates/reset-on-leave";
import { routes } from "@/config/routes";

// 피그마 ⑥ 회원가입 — 담당: 이슈 #3
export default function SignupPage() {
  return (
    <AuthCard
      title="개발자 스터디, 함께 시작해요"
      className="max-w-sm"
      footer={
        <div className="flex flex-col gap-2 text-center text-sm">
          <p>
            이미 계정이 있나요?{" "}
            <Link href={routes.login} className="text-link hover:underline">
              로그인
            </Link>
          </p>
          <p className="text-xs text-muted-foreground">
            🔒 진짜 개인정보는 넣지 마세요 — 모든 팀이 같은 DB를 써요.
          </p>
        </div>
      }
    >
      {/* 🔒 화면을 떠나면 입력한 이메일 · 비밀번호를 지워요 */}
      <ResetOnLeave>
        <SignupForm />
      </ResetOnLeave>
    </AuthCard>
  );
}
