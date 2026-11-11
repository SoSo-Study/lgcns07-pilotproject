import Link from "next/link";
import { AuthCard } from "@/components/templates/auth-card";
import { TodoBox } from "@/components/templates/todo-box";
import { routes } from "@/config/routes";

// 비밀번호 찾기 — 담당: 이슈 #4 (여유). 로그인 화면의 "비밀번호를 잊으셨나요?" 링크가 여기로 와요
export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="비밀번호 찾기"
      className="max-w-xs"
      footer={
        <p className="text-center text-sm">
          <Link href={routes.login} className="text-link hover:underline">
            로그인으로 돌아가기
          </Link>
        </p>
      }
    >
      <TodoBox issue={4}>
        가입한 이메일로 비밀번호 재설정 보안키를 받는 화면이 들어갈 자리예요.
      </TodoBox>
    </AuthCard>
  );
}
