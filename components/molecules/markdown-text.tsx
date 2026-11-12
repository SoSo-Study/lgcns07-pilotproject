import Markdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

type MarkdownTextProps = {
  /** 마크다운으로 쓴 글 (스터디 소개 · 나중에 댓글도) */
  children: string;
  className?: string;
};

/**
 * 마크다운 글을 꾸며서 보여 줘요 (#26) — 소제목 · 목록 · 굵게 · 링크 · 줄바꿈
 *
 * - remark-gfm: 주소만 써도 링크로, 표 · 체크리스트 같은 GitHub식 문법
 * - remark-breaks: 엔터 한 번도 줄바꿈 (예전에 평범하게 쓴 글도 그대로 보여요)
 * - 🔒 rehype-raw는 쓰지 않아요 → `<script>` 같은 HTML은 실행되지 않고,
 *   `javascript:` 링크는 react-markdown이 알아서 지워요
 *
 * @example
 * <MarkdownText>{study.content}</MarkdownText>
 */
export function MarkdownText({ children, className }: MarkdownTextProps) {
  return (
    <div
      className={cn(
        "max-w-prose wrap-break-word break-keep",
        // 문단 사이 간격 (맨 위 · 맨 아래는 빼고)
        "*:my-3 *:first:mt-0 *:last:mb-0",
        // 소제목 (# · ## · ###)
        "[&_h1]:text-base [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-bold [&_h3]:font-bold",
        // 목록 (- · 1.)
        "[&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5",
        // 굵게 · 코드 · 인용 · 가로줄
        "[&_strong]:font-bold [&_strong]:text-foreground",
        "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:font-mono [&_code]:text-xs",
        "[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground",
        "[&_hr]:border-border",
        className,
      )}
    >
      <Markdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          // 🔒 링크는 새 탭 + noopener noreferrer (열린 탭이 이 화면을 건드리지 못하게)
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-link hover:underline"
            >
              {children}
            </a>
          ),
        }}
      >
        {children}
      </Markdown>
    </div>
  );
}
