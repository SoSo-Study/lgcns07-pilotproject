import Link from "next/link";
import { CalendarDays, User, Users } from "lucide-react";
import { CategoryLabel } from "@/components/atoms/category-label";
import { StatusBadge } from "@/components/atoms/status-badge";
import { TechTag } from "@/components/atoms/tech-tag";
import { routes } from "@/config/routes";
import { formatDate } from "@/lib/format-date";
import type { StudySummary } from "@/types/study";

type StudyRowProps = {
  study: StudySummary;
};

// 칸 너비 — 표 머리(StudyTable)와 같이 써서 줄이 맞게
// 표 모양은 1024px(lg) 이상에서만. 그보다 좁으면 칸 너비 없이 카드 모양
export const studyColumns = {
  status: "lg:w-21 lg:shrink-0",
  members: "lg:w-20 lg:shrink-0",
  deadline: "lg:w-28 lg:shrink-0",
  author: "lg:w-28 lg:shrink-0",
} as const;

// 피그마 StudyRow — 목록 한 줄 (받은 값만 그림. 데이터 불러오기는 page · service에서)
// 1024px 이상: 한 줄 표 · 그보다 좁으면: 상태 → 제목 · 태그 → 인원 · 마감일 · 스터디장 순서로 쌓은 카드
// 사용: {studies.map((study) => <StudyRow key={study.id} study={study} />)}
export function StudyRow({ study }: StudyRowProps) {
  return (
    <li className="flex flex-col gap-2 border-t border-border px-4 py-3 hover:bg-muted/40 lg:flex-row lg:items-center lg:gap-4">
      <div className={studyColumns.status}>
        <StatusBadge status={study.status} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link
          href={routes.study(study.id)}
          className="truncate font-bold hover:text-link hover:underline"
        >
          {study.title}
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <CategoryLabel category={study.category} />
          {study.techTags.map((tag) => (
            <TechTag key={tag} label={tag} />
          ))}
        </div>
      </div>

      {/* 좁은 화면: 세 칸을 한 줄에 모아 줄바꿈 · lg 이상: 묶음 상자를 없애(contents) 각자 표 칸으로 */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 lg:contents">
        <span
          className={`${studyColumns.members} flex items-center gap-1.5 font-mono text-xs text-muted-foreground`}
        >
          <Users className="size-3.5" aria-hidden />
          <span className="sr-only">인원</span>
          {study.currentMembers} / {study.maxMembers}
        </span>
        <span
          className={`${studyColumns.deadline} flex items-center gap-1.5 font-mono text-xs text-muted-foreground`}
        >
          <CalendarDays className="size-3.5" aria-hidden />
          <span className="sr-only">마감일</span>
          {formatDate(study.deadline)}
        </span>
        <span
          className={`${studyColumns.author} flex min-w-0 items-center gap-1.5 font-mono text-xs text-muted-foreground`}
        >
          <User className="size-3.5 shrink-0" aria-hidden />
          <span className="sr-only">스터디장</span>
          <span className="truncate">{study.authorName}</span>
        </span>
      </div>
    </li>
  );
}
