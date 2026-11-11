"use client";

import { useTransition, type ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { IconButton } from "@/components/atoms/icon-button";
import { routes } from "@/config/routes";
import { requestLogout } from "@/lib/logout-request";

type LogoutButtonProps = Omit<
  ComponentProps<typeof IconButton>,
  "icon" | "label" | "pending" | "onClick"
>;

/**
 * 로그아웃 버튼 — 할 일(로그아웃)만 맡고, 모양은 `IconButton`이 그려요.
 * 누르면 로그아웃하고 로그인 화면에 "로그아웃했어요"를 잠깐 띄워요.
 * 별도 로그아웃 화면(주소)은 만들지 않아요: 주소로 로그아웃되면
 * 다른 사이트가 링크 · 이미지 한 줄로 몰래 로그아웃시킬 수 있어서, 버튼으로만 해요.
 *
 * @example
 * <SidebarUser nickname={me.nickname}>
 *   <LogoutButton />
 * </SidebarUser>
 * <LogoutButton labelPosition="right" /> // 글자도 보이게
 */
export function LogoutButton(props: LogoutButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await requestLogout();
      // replace: 뒤로 가기를 눌러도 로그인한 화면으로 돌아오지 않게
      router.replace(routes.loginNotice("logged-out"));
      router.refresh(); // 서버 화면(사이드바 등)을 로그아웃 상태로 다시 그리기
    });
  }

  return (
    <IconButton
      icon={<LogOut />}
      label="로그아웃"
      size="sm"
      pending={isPending}
      onClick={handleLogout}
      {...props}
    />
  );
}
