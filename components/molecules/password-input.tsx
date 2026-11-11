"use client";

import { useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";
import { InputBox } from "@/components/molecules/input-box";
import { InputGroupButton } from "@/components/ui/input-group";

type PasswordInputProps = Omit<ComponentProps<typeof InputBox>, "type" | "end">;

/**
 * 비밀번호 칸 — `InputBox` + 뒷자리 보기/숨기기 버튼.
 * 버튼을 누를 때마다 글자가 보였다(●●● → abc) 숨었다 해요.
 * `InputBox`의 다른 props(`name`, `autoComplete`, `start`, `size`, `aria-*` …)는 그대로 써요.
 *
 * - 로그인: `autoComplete="current-password"` / 가입 · 재설정: `autoComplete="new-password"`
 *   → 비밀번호 관리자가 저장 · 자동 채우기 · 새 비밀번호 제안을 해 줘요
 *
 * @example
 * <PasswordInput name="password" autoComplete="current-password" />
 * <PasswordInput name="password" autoComplete="new-password" start={<Lock />} />
 */
export function PasswordInput(props: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const label = visible ? "비밀번호 숨기기" : "비밀번호 보기";

  return (
    <InputBox
      {...props}
      type={visible ? "text" : "password"}
      end={
        <InputGroupButton
          size="icon-xs"
          aria-label={label}
          title={label}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
        </InputGroupButton>
      }
    />
  );
}
