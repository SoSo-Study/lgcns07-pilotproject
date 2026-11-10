import type { ComponentProps } from "react";
import { Pill } from "@/components/atoms/pill";
import { cn } from "@/lib/utils";

type TechTagProps = Omit<ComponentProps<typeof Pill>, "tone" | "children"> & {
  /** 기술 이름 (예: React) */
  label: string;
};

/**
 * 피그마 TechTag — 파란 글씨 기술 태그. `<Pill tone="accent">`의 지름길이에요.
 *
 * @example
 * {study.techTags.map((tag) => <TechTag key={tag} label={tag} />)}
 */
export function TechTag({ label, className, ...props }: TechTagProps) {
  return (
    <Pill tone="accent" className={cn("font-normal", className)} {...props}>
      {label}
    </Pill>
  );
}
