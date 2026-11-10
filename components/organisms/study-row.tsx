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
export const studyColumns = {
  status: "w-21 shrink-0",
  members: "w-20 shrink-0",
  deadline: "w-28 shrink-0",
  author: "w-28 shrink-0",
} as const;

// 피그마 StudyRow — 목록 한 줄 (받은 값만 그림. 데이터 불러오기는 page · service에서)
// 사용: {studies.map((study) => <StudyRow key={study.studyId} study={study} />)}
export function StudyRow({ study }: StudyRowProps) {
  return (
    <li className="flex items-center gap-4 border-t border-border px-4 py-3 hover:bg-muted/40">
      <div className={studyColumns.status}>
        <StatusBadge status={study.status} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link
          href={routes.study(study.studyId)}
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
        <span className="truncate">{study.authorNickname}</span>
      </span>
    </li>
  );
}
