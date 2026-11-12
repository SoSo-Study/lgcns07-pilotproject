import Link from "next/link";
import { FindIdForm } from "@/components/organisms/find-id-form";
import { AuthCard } from "@/components/templates/auth-card";
import { ResetOnLeave } from "@/components/templates/reset-on-leave";
import { routes } from "@/config/routes";

// 이메일 찾기 — 담당: 이슈 #72. 로그인 화면의 "이메일 찾기" 링크가 여기로 와요
// (우리 서비스는 따로 만든 아이디가 없고 이메일로 로그인해서 "아이디 찾기"가 아니라 "이메일 찾기"예요)
export default function FindIdPage() {
  return (
    <AuthCard
      title="이메일 찾기"
      className="max-w-xs"
      footer={
        <p className="text-center text-sm">
          <Link href={routes.login} className="text-link hover:underline">
            로그인으로 돌아가기
          </Link>
          {" · "}
          <Link
            href={routes.forgotPassword}
            className="text-link hover:underline"
          >
            비밀번호 찾기
          </Link>
        </p>
      }
    >
      {/* 🔒 화면을 떠나면 입력한 닉네임 · 찾은 결과를 지워요 */}
      <ResetOnLeave>
        <FindIdForm />
      </ResetOnLeave>
    </AuthCard>
  );
}
