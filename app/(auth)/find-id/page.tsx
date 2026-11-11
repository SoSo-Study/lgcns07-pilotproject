import Link from "next/link";
import { AuthCard } from "@/components/templates/auth-card";
import { TodoBox } from "@/components/templates/todo-box";
import { routes } from "@/config/routes";

// 아이디(이메일) 찾기 — 담당: 이슈 #4 (여유). 로그인 화면의 "아이디 찾기" 링크가 여기로 와요
export default function FindIdPage() {
  return (
    <AuthCard
      title="아이디 찾기"
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
        이름이나 이메일로 가입한 아이디(이메일)를 찾는 화면이 들어갈 자리예요.
      </TodoBox>
    </AuthCard>
  );
}
