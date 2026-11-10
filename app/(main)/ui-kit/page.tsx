import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import { CategoryLabel } from "@/components/atoms/category-label";
import { StatusBadge } from "@/components/atoms/status-badge";
import { TechTag } from "@/components/atoms/tech-tag";
import { CategoryChip } from "@/components/molecules/category-chip";
import { Pagination } from "@/components/molecules/pagination";
import { SearchForm } from "@/components/molecules/search-form";
import { SidebarUser } from "@/components/molecules/sidebar-user";
import { TextField } from "@/components/molecules/text-field";
import { StudyTable } from "@/components/organisms/study-table";
import { EmptyState } from "@/components/templates/empty-state";
import { PageHeader } from "@/components/templates/page-header";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { mockStudies } from "@/lib/mock-studies";
import type { StudyCategory } from "@/types/study";

// 🧩 부품 모음 (/ui-kit) — 팀원용 견본 화면. 사이드바엔 없고 주소로만 들어와요.
// 부품을 고르고, 아래 "사용:" 코드를 복사해서 쓰면 돼요.
const categories: StudyCategory[] = [
  "FRONTEND",
  "BACKEND",
  "ALGORITHM",
  "CS",
  "INTERVIEW",
];

export default function UiKitPage() {
  return (
    <section className="flex flex-col gap-10">
      <PageHeader
        title="🧩 부품 모음"
        description="공통 부품 견본이에요. 필요한 부품이 없으면 만들기 전에 팀에 물어봐 주세요."
      />

      <Sample
        title="버튼 (components/ui/button)"
        code={`<Button>저장</Button> · <Button variant="outline">취소</Button> · <Button variant="destructive">삭제</Button>`}
      >
        <Button>
          <Plus aria-hidden />
          모집글 등록
        </Button>
        <Button variant="outline">취소</Button>
        <Button variant="destructive">삭제</Button>
        <Button disabled>보내는 중…</Button>
      </Sample>

      <Sample
        title="상태 뱃지 · 기술 태그 · 분야 이름 (atoms)"
        code={`<StatusBadge status="OPEN" /> · <TechTag label="React" /> · <CategoryLabel category="FRONTEND" />`}
      >
        <StatusBadge status="OPEN" />
        <StatusBadge status="CLOSED" />
        <TechTag label="React" />
        <TechTag label="Next.js" />
        {categories.map((category) => (
          <CategoryLabel key={category} category={category} />
        ))}
      </Sample>

      <Sample
        title="분야 칩 (molecules/category-chip) — 누르면 주소가 바뀜"
        code={`<CategoryChip category="FRONTEND" href="/studies?category=FRONTEND" selected count={4} />`}
      >
        <CategoryChip
          category="ALL"
          href={routes.studies}
          selected
          count={12}
        />
        {categories.map((category) => (
          <CategoryChip
            key={category}
            category={category}
            href={`${routes.studies}?category=${category}`}
            count={2}
          />
        ))}
      </Sample>
      <Sample title="분야 칩 — 선택된 모양">
        <CategoryChip category="ALL" href={routes.studies} count={12} />
        {categories.map((category) => (
          <CategoryChip
            key={category}
            category={category}
            href={`${routes.studies}?category=${category}`}
            selected
            count={2}
          />
        ))}
      </Sample>

      <Sample
        title="입력칸 (molecules/text-field) · 검색창 (molecules/search-form)"
        code={`<TextField label="아이디" name="loginId" error={state.errors?.loginId} /> · <SearchForm action={routes.studies} defaultValue={q} />`}
      >
        <div className="grid w-full gap-4 md:grid-cols-2">
          <TextField
            label="아이디"
            name="loginId"
            placeholder="입력해 주세요"
          />
          <TextField
            label="비밀번호"
            name="password"
            type="password"
            error="비밀번호는 8자 이상이어야 해요."
          />
          <div className="md:col-span-2">
            <SearchForm action={routes.studies} />
          </div>
        </div>
      </Sample>

      <Sample
        title="스터디 표 (organisms/study-table · study-row)"
        code={`<StudyTable studies={data.studies} openCount={9} closedCount={3} />`}
      >
        <div className="w-full">
          <StudyTable
            studies={mockStudies.slice(0, 3)}
            openCount={9}
            closedCount={3}
          />
        </div>
      </Sample>

      <Sample
        title="쪽 번호 (molecules/pagination)"
        code={`<Pagination currentPage={1} totalPages={3} hrefFor={(page) => \`/studies?page=\${page}\`} />`}
      >
        <div className="w-full">
          <Pagination
            currentPage={1}
            totalPages={3}
            hrefFor={(page) => `${routes.studies}?page=${page}`}
          />
        </div>
      </Sample>

      <Sample
        title="빈 화면 (templates/empty-state) · 사이드바 사용자 (molecules/sidebar-user)"
        code={`<EmptyState title="검색 결과가 없어요" /> · <SidebarUser nickname="dev_kim">{로그아웃 버튼}</SidebarUser>`}
      >
        <div className="w-full rounded-md border border-border bg-card">
          <EmptyState
            title="검색 결과가 없어요"
            description="다른 단어로 찾아보세요."
          />
        </div>
        <div className="w-64 rounded-md border border-border bg-sidebar p-3">
          <SidebarUser nickname="dev_kim" />
        </div>
      </Sample>
    </section>
  );
}

function Sample({
  title,
  code,
  children,
}: {
  title: string;
  code?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-bold">{title}</h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
      {code && (
        <pre className="overflow-x-auto rounded-md bg-inset p-3 font-mono text-xs text-muted-foreground">
          사용: {code}
        </pre>
      )}
    </div>
  );
}
