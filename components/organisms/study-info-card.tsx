import type { ComponentProps } from "react";
import { CalendarDays, Globe, Users } from "lucide-react";
import { TechTag } from "@/components/atoms/tech-tag";
import { InfoRow } from "@/components/molecules/info-row";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { studyModeLabels } from "@/config/study-mode";
import { daysLeft, formatDaysLeft } from "@/lib/days-left";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import type { Study } from "@/types/study";

type StudyInfoCardProps = ComponentProps<typeof Card> & {
  /** 보여 줄 스터디 */
  study: Study;
};

/**
 * 피그마 ② 오른쪽 정보 카드 — 모집 인원 · 막대 · 마감일(D-n) · 진행 방식 · 기술 태그.
 * 받은 값만 그려요. `children`은 카드 아래쪽 자리로, 참여 신청(#8) 버튼이 들어가요.
 *
 * @example
 * <StudyInfoCard study={study}>
 *   <Button className="w-full">참여 신청하기</Button>
 * </StudyInfoCard>
 */
export function StudyInfoCard({
  study,
  children,
  className,
  ...props
}: StudyInfoCardProps) {
  const percent = Math.round((study.currentMembers / study.maxMembers) * 100);
  const deadline = `${formatDate(study.deadline)} (${formatDaysLeft(daysLeft(study.deadline))})`; // "2026.11.18 (D-8)"

  return (
    <Card className={cn("rounded-md px-4 ring-border", className)} {...props}>
      <dl>
        <InfoRow icon={Users} label="모집 인원">
          {study.currentMembers} / {study.maxMembers}명
        </InfoRow>
      </dl>
      <Progress value={percent} aria-label="모집 인원 비율" />
      <dl className="flex flex-col gap-3">
        <InfoRow icon={CalendarDays} label="마감일">
          {deadline}
        </InfoRow>
        <InfoRow icon={Globe} label="진행">
          {studyModeLabels[study.mode]}
        </InfoRow>
      </dl>
      <ul className="flex flex-wrap gap-1.5" aria-label="기술 태그">
        {study.techTags.map((tag) => (
          <li key={tag}>
            <TechTag label={tag} />
          </li>
        ))}
      </ul>
      {children}
    </Card>
  );
}
