import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

// 높이만 고르고, 너비는 부모나 className이 정해요
const inputBoxVariants = cva("bg-inset dark:bg-inset", {
  variants: {
    size: {
      sm: "h-8",
      md: "h-9",
      lg: "h-10",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type InputBoxProps = Omit<ComponentProps<"input">, "size"> &
  VariantProps<typeof inputBoxVariants> & {
    /** 입력칸 앞자리: 아이콘 · 글자 · 버튼 */
    start?: ReactNode;
    /** 입력칸 뒷자리: 아이콘 · 글자 · 버튼 */
    end?: ReactNode;
    /** 안쪽 `<input>`에 줄 클래스 (`className`은 바깥 상자에 가요) */
    inputClassName?: string;
  };

/**
 * 입력칸 하나 — `type`만 바꿔서 글자 · 이메일 · 숫자 · 검색 어디든 써요.
 * 앞뒤 자리에 아이콘 · 글자 · 버튼을 넣을 수 있어요. shadcn `InputGroup` 위에 만들었어요.
 *
 * - `<input>` 속성(`name`, `type`, `placeholder`, `autoComplete`, `aria-*` …)은 그대로 전달돼요.
 * - `size`: sm(32px) · md(36px, 기본) · lg(40px) — 높이만
 * - `className`: 바깥 상자(너비 등) / `inputClassName`: 안쪽 입력칸
 * - 에러면 `aria-invalid`를 주세요 → 테두리가 빨갛게 바뀌어요
 *
 * @example
 * <InputBox type="email" name="email" start={<Mail />} placeholder="you@soso.study" />
 * <InputBox type="number" name="maxMembers" end="명" size="sm" className="w-32" />
 * <InputBox name="email" aria-invalid aria-describedby="email-error" />
 */
export function InputBox({
  start,
  end,
  size,
  className,
  inputClassName,
  ...inputProps
}: InputBoxProps) {
  return (
    <InputGroup className={cn(inputBoxVariants({ size }), className)}>
      <InputGroupInput className={inputClassName} {...inputProps} />
      {start && <InputGroupAddon align="inline-start">{start}</InputGroupAddon>}
      {end && <InputGroupAddon align="inline-end">{end}</InputGroupAddon>}
    </InputGroup>
  );
}
