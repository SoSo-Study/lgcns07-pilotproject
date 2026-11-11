import type { ComponentProps, ReactNode } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

/** FormField가 입력칸에 넘겨주는 연결 속성 */
export type FieldControlProps = {
  id: string;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
};

type FormFieldProps = Omit<ComponentProps<typeof Field>, "children"> & {
  /** 입력칸 id — 라벨(`htmlFor`)과 이어져요 */
  id: string;
  label: ReactNode;
  /** 라벨 뒤에 * 표시 (입력칸의 `required`는 따로 주세요) */
  required?: boolean;
  /** 라벨 줄 오른쪽 자리 (예: "비밀번호를 잊으셨나요?" 링크) */
  labelEnd?: ReactNode;
  /** 입력칸 아래 흐린 도움말 */
  description?: ReactNode;
  /** 에러 문구 — 있으면 칸이 빨갛게, 화면 읽기 프로그램도 같이 읽어요 */
  error?: string;
  /** 입력칸을 그리는 함수. 받은 `field`를 입력칸에 그대로 펼쳐 주세요 */
  children: (field: FieldControlProps) => ReactNode;
};

/**
 * 라벨 + 입력칸 + 도움말 + 에러 한 묶음. shadcn `Field` 위에 만들었어요.
 * 입력칸은 아무거나(`InputBox`, `PasswordInput`, `Textarea` …) 넣을 수 있고,
 * 라벨 · 에러 연결(`id`, `aria-invalid`, `aria-describedby`)은 이 부품이 만들어 줘요.
 *
 * @example
 * <FormField id="email" label="이메일" error={errors.email}>
 *   {(field) => <InputBox {...field} name="email" type="email" start={<Mail />} />}
 * </FormField>
 *
 * <FormField id="password" label="비밀번호" labelEnd={<Link href={routes.forgotPassword}>비밀번호를 잊으셨나요?</Link>}>
 *   {(field) => <PasswordInput {...field} name="password" autoComplete="current-password" />}
 * </FormField>
 */
export function FormField({
  id,
  label,
  required,
  labelEnd,
  description,
  error,
  children,
  ...props
}: FormFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  // 도움말 · 에러 id를 띄어쓰기로 이어요 → "email-description email-error"
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ");

  return (
    <Field data-invalid={error ? true : undefined} {...props}>
      <div className="flex items-center justify-between gap-2">
        <FieldLabel htmlFor={id}>
          {label}
          {required && <span aria-hidden>*</span>}
        </FieldLabel>
        {labelEnd}
      </div>
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy || undefined,
      })}
      {description && (
        <FieldDescription id={descriptionId}>{description}</FieldDescription>
      )}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </Field>
  );
}
