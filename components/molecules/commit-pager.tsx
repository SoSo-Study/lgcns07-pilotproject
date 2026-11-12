import { Fragment, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

type CommitPagerProps = Omit<ComponentProps<"div">, "children" | "onSelect"> & {
  /** 전체 슬라이드 수 */
  count: number;
  /** 지금 슬라이드 (0부터) */
  selected: number;
  /** 점을 누르면 그 번호(0부터)를 알려 줘요 — 할 일은 부모가 */
  onSelect: (index: number) => void;
};

/**
 * 커밋 그래프 모양 페이저 — `●─○─○ 1/3`
 * 캐러셀의 점(dots)과 같은 일을 해요. 지금 슬라이드는 초록 점이에요.
 *
 * @example
 * <CommitPager count={3} selected={selected} onSelect={(i) => api?.scrollTo(i)} />
 */
export function CommitPager({
  count,
  selected,
  onSelect,
  className,
  ...props
}: CommitPagerProps) {
  return (
    <div className={cn("flex items-center", className)} {...props}>
      {Array.from({ length: count }, (_, index) => (
        <Fragment key={index}>
          {index > 0 && <span aria-hidden className="h-0.5 w-3 bg-border" />}
          {/* 누르는 자리는 넉넉하게(24px), 보이는 점은 작게(10px) */}
          <button
            type="button"
            aria-label={`${index + 1}번 슬라이드`}
            aria-current={index === selected ? "true" : undefined}
            onClick={() => onSelect(index)}
            className="group grid size-6 cursor-pointer place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span
              className={cn(
                "size-2.5 rounded-full border-2 transition-colors",
                index === selected
                  ? "border-status-open bg-status-open"
                  : "border-subtle group-hover:border-foreground",
              )}
            />
          </button>
        </Fragment>
      ))}
      <span className="ml-2 font-mono text-xs text-muted-foreground">
        {selected + 1}/{count}
      </span>
    </div>
  );
}
