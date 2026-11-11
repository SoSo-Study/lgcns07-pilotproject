import Link from "next/link";
import { AuthCard } from "@/components/templates/auth-card";
import { TodoBox } from "@/components/templates/todo-box";
import { routes } from "@/config/routes";

// 피그마 ⑥ 회원가입 — 담당: 이슈 #3
export default function SignupPage() {
  return (
    <AuthCard
      title="개발자 스터디, 함께 시작해요"
      className="max-w-sm"
      footer={
        <p className="text-center text-sm">
          이미 계정이 있나요?{" "}
          <Link href={routes.login} className="text-link hover:underline">
            로그인
          </Link>
        </p>
      }
    >
      <TodoBox issue={3}>
        이메일 · 닉네임 · 비밀번호 입력 폼이 들어갈 자리예요.
      </TodoBox>
    </AuthCard>
  );
}
