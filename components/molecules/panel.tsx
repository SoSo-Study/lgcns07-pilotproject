import type { ComponentProps, ReactNode } from "react";
import { Card } from "@/components/ui/card";

type PanelProps = Omit<ComponentProps<"section">, "title"> & {
  /** 회색 머리줄 내용 (예: 작성자 · 스터디 소개) */
  header: ReactNode;
  /** 바깥 태그. 소개는 section(기본), 댓글 하나는 article */
  as?: "section" | "article";
};

/**
 * 피그마 ② 소개 상자 · 댓글 상자 — 회색 머리줄 + 본문 (GitHub 댓글 모양).
 * `<section>` 속성(`id`, `aria-*`, `className`)은 바깥 태그에 그대로 전달돼요.
 *
 * @example
 * <Panel header={<>front_park · 스터디 소개</>}>{study.content}</Panel>
 * <Panel as="article" header={<>next_han · 2시간 전</>}>{comment.body}</Panel>
 */
export function Panel({
  header,
  as: Tag = "section",
  children,
  ...props
}: PanelProps) {
  return (
    <Tag {...props}>
      <Card className="gap-0 rounded-md py-0 ring-border">
        <div className="border-b border-border bg-muted px-4 py-2 text-xs text-muted-foreground">
          {header}
        </div>
        <div className="p-4 text-sm leading-relaxed">{children}</div>
      </Card>
    </Tag>
  );
}
