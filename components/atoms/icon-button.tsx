import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 글자 위치 · 크기에 따라 모양만 바꿔요 (할 일은 쓰는 쪽이 onClick으로)
const iconButtonVariants = cva(
  // enabled:cursor-pointer → 눌리는 상태일 때만 손가락 커서 (꺼지면 자연스럽게 빠져요)
  "enabled:cursor-pointer",
  {
    variants: {
      labelPosition: {
        hidden: "",
        right: "",
        left: "flex-row-reverse",
        bottom: "h-auto flex-col gap-0.5 py-1.5 text-xs",
      },
      size: {
        sm: "[&_svg:not([class*='size-'])]:size-4",
        md: "[&_svg:not([class*='size-'])]:size-4",
        lg: "[&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      labelPosition: "hidden",
      size: "md",
    },
  },
);

type IconButtonVariants = VariantProps<typeof iconButtonVariants>;
type Size = NonNullable<IconButtonVariants["size"]>;

// 글자를 숨기면 정사각형, 보이면 글자 길이만큼 (shadcn Button 크기 이름으로)
const squareSizes = { sm: "icon-sm", md: "icon", lg: "icon-lg" } as const;
const wideSizes = { sm: "sm", md: "default", lg: "lg" } as const;

type IconButtonProps = Omit<
  ComponentProps<typeof Button>,
  "size" | "children"
> &
  IconButtonVariants & {
    /** 아이콘 · 작은 이미지 (예: `<LogOut />`, `<Image … />`) */
    icon: ReactNode;
    /** 버튼 이름 — 꼭 필요해요. 숨겨도 화면 읽기 프로그램과 툴팁에 쓰여요 */
    label: string;
    /** 보내는 중이면 ⟳로 바뀌고 잠겨요 */
    pending?: boolean;
  };

/**
 * 아이콘 버튼 — 아이콘(또는 작은 이미지) + 이름. 글자는 숨기거나 아래 · 왼쪽 · 오른쪽에 둬요.
 * 할 일은 쓰는 쪽(부모)이 `onClick`으로 넘겨요. shadcn `Button` 위에 만들었어요.
 *
 * - `labelPosition`: hidden(기본, 아이콘만) · bottom · left · right
 * - `size`: sm · md(기본) · lg / `variant`: shadcn Button 것 그대로 (기본 ghost)
 * - 눌리는 상태일 때만 손가락 커서, `disabled` · `pending`이면 커서 없이 흐리게
 *
 * @example
 * <IconButton icon={<LogOut />} label="로그아웃" onClick={handleLogout} />
 * <IconButton icon={<Star />} label="찜하기" labelPosition="right" onClick={toggle} />
 * <IconButton icon={<Pencil />} label="수정" labelPosition="bottom" />
 * <IconButton icon={<LogOut />} label="로그아웃" pending={isPending} />
 */
export function IconButton({
  icon,
  label,
  labelPosition,
  size,
  pending = false,
  variant = "ghost",
  type = "button",
  disabled,
  className,
  ...props
}: IconButtonProps) {
  const position = labelPosition ?? "hidden";
  const sizeKey: Size = size ?? "md";
  const hidden = position === "hidden";

  return (
    <Button
      type={type}
      variant={variant}
      size={hidden ? squareSizes[sizeKey] : wideSizes[sizeKey]}
      title={hidden ? label : undefined}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      className={cn(
        iconButtonVariants({ labelPosition: position, size: sizeKey }),
        className,
      )}
      {...props}
    >
      {pending ? (
        <LoaderCircle aria-hidden className="motion-safe:animate-spin" />
      ) : (
        <span aria-hidden className="contents">
          {icon}
        </span>
      )}
      <span className={hidden ? "sr-only" : undefined}>{label}</span>
    </Button>
  );
}
