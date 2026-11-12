import Link from "next/link";
import { PasswordResetForm } from "@/components/organisms/password-reset-form";
import { AuthCard } from "@/components/templates/auth-card";
import { ResetOnLeave } from "@/components/templates/reset-on-leave";
import { routes } from "@/config/routes";

// 비밀번호 찾기 · 다시 만들기 — 담당: 이슈 #73. 로그인 화면의 "비밀번호를 잊으셨나요?" 링크가 여기로 와요
export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="비밀번호 찾기"
      className="max-w-sm"
      footer={
        <p className="text-center text-sm">
          <Link href={routes.login} className="text-link hover:underline">
            로그인으로 돌아가기
          </Link>
        </p>
      }
    >
      {/* 🔒 화면을 떠나면 입력한 이메일 · 보안키 · 비밀번호를 지워요 */}
      <ResetOnLeave>
        <PasswordResetForm />
      </ResetOnLeave>
    </AuthCard>
  );
}
