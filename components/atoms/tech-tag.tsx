import { cn } from "@/lib/utils";

type TechTagProps = {
  label: string;
  className?: string;
};

// 피그마 TechTag — 파란 글씨 기술 태그
// 사용: {study.techTags.map((tag) => <TechTag key={tag} label={tag} />)}
export function TechTag({ label, className }: TechTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-link-subtle px-2 py-0.5 text-xs whitespace-nowrap text-link",
        className,
      )}
    >
      {label}
    </span>
  );
}
