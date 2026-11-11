import type { ComponentProps } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = Omit<
  ComponentProps<typeof Image>,
  "src" | "alt" | "width" | "height"
> & {
  /** 가로 · 세로 크기(px). 기본 32 */
  size?: number;
  /** 대신 읽을 글자. 옆에 "soso.study" 글자가 있으면 비워 두세요(꾸밈 그림) */
  alt?: string;
};

/**
 * soso.study 로고 그림 (`public/logo.svg`).
 * SVG라서 Next가 따로 줄이거나 바꾸지 않고 그대로 보내요.
 *
 * @example
 * <Logo />                     // 32px, 옆에 글자가 있을 때
 * <Logo size={40} alt="soso.study" />  // 글자 없이 로고만 있을 때
 */
export function Logo({ size = 32, alt = "", className, ...props }: LogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt={alt}
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      {...props}
    />
  );
}
