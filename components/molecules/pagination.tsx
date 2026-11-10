import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PaginationProps = {
  currentPage: number; // 1부터
  totalPages: number;
  hrefFor: (page: number) => string; // 쪽 번호 → 주소 (예: (p) => `/studies?page=${p}`)
};

// 쪽 번호 — 강사님 방식: 링크만 만드는 서버 컴포넌트 (쪽 번호는 주소에 ?page=)
// 사용: <Pagination currentPage={data.currentPage} totalPages={data.totalPages} hrefFor={...} />
export function Pagination({
  currentPage,
  totalPages,
  hrefFor,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const edge = "inline-flex items-center gap-1 px-2 py-1 text-sm";

  return (
    <nav
      aria-label="쪽 번호"
      className="mt-6 flex items-center justify-center gap-1"
    >
      {hasPrevious ? (
        <Link
          href={hrefFor(currentPage - 1)}
          className={cn(edge, "text-foreground hover:text-link")}
        >
          <ChevronLeft className="size-4" aria-hidden />
          이전
        </Link>
      ) : (
        <span aria-disabled className={cn(edge, "text-subtle")}>
          <ChevronLeft className="size-4" aria-hidden />
          이전
        </span>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={hrefFor(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-md font-mono text-sm",
            page === currentPage
              ? "bg-link-emphasis text-primary-foreground"
              : "text-link hover:bg-muted",
          )}
        >
          {page}
        </Link>
      ))}

      {hasNext ? (
        <Link
          href={hrefFor(currentPage + 1)}
          className={cn(edge, "text-link hover:underline")}
        >
          다음
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      ) : (
        <span aria-disabled className={cn(edge, "text-subtle")}>
          다음
          <ChevronRight className="size-4" aria-hidden />
        </span>
      )}
    </nav>
  );
}
