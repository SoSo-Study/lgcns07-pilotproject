import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type TextFieldProps = ComponentProps<"input"> & {
  name: string;
  label: string;
  error?: string; // 서버 액션이 돌려준 에러 문구
};

// 피그마 TextField — 라벨 + 입력창 + 에러 문구
// 사용: <TextField label="아이디" name="loginId" required error={state.errors?.loginId} />
export function TextField({
  label,
  name,
  error,
  id,
  className,
  ...inputProps
}: TextFieldProps) {
  const inputId = id ?? name;
  const errorId = `${inputId}-error`;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={inputId}>{label}</Label>
      <Input
        id={inputId}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="h-9 bg-inset dark:bg-inset"
        {...inputProps}
      />
      {error && (
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
