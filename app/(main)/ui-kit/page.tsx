import type { ReactNode } from "react";
import Link from "next/link";
import { CircleDot, Clock, Lock, Mail, Plus, Search } from "lucide-react";
import { CategoryLabel } from "@/components/atoms/category-label";
import { Pill } from "@/components/atoms/pill";
import { StatusBadge } from "@/components/atoms/status-badge";
import { SubmitButton } from "@/components/atoms/submit-button";
import { TechTag } from "@/components/atoms/tech-tag";
import { CategoryChip } from "@/components/molecules/category-chip";
import { FormAlert } from "@/components/molecules/form-alert";
import { FormField } from "@/components/molecules/form-field";
import { InputBox } from "@/components/molecules/input-box";
import { Pagination } from "@/components/molecules/pagination";
import { PasswordInput } from "@/components/molecules/password-input";
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
        title="Pill (atoms/pill) — 글자 · 색 · 아이콘을 props로. 새 뱃지가 필요하면 이걸로"
        code={`<Pill tone="success" icon={CircleDot} outlined>모집 중</Pill> · <Pill tone="accent">React</Pill> · <Pill>D-3</Pill>`}
      >
        <Pill>neutral</Pill>
        <Pill tone="success">success</Pill>
        <Pill tone="done">done</Pill>
        <Pill tone="accent">accent</Pill>
        <Pill tone="danger">danger</Pill>
        <Pill tone="success" icon={CircleDot} outlined>
          모집 중
        </Pill>
        <Pill tone="neutral" icon={Clock} outlined>
          신청 대기
        </Pill>
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
        title="InputBox (molecules/input-box) — 입력칸 하나로 글자 · 이메일 · 숫자 + 앞뒤 아이콘 · 글자"
        code={`<InputBox type="email" name="email" start={<Mail />} /> · <InputBox type="number" name="maxMembers" end="명" size="sm" className="w-32" /> · <InputBox name="email" aria-invalid />`}
      >
        <div className="grid w-full gap-4 md:grid-cols-2">
          <InputBox
            type="email"
            name="sample-email"
            aria-label="이메일 견본"
            start={<Mail />}
            placeholder="you@soso.study"
          />
          <InputBox
            type="search"
            name="sample-search"
            aria-label="검색 견본"
            start={<Search />}
            placeholder="제목 · 기술 태그"
          />
          <div className="flex items-center gap-3">
            <InputBox
              type="number"
              name="sample-members"
              aria-label="인원 견본"
              end="명"
              size="sm"
              className="w-32"
              defaultValue={5}
            />
            <InputBox
              name="sample-plain"
              aria-label="아이콘 없는 견본"
              size="lg"
              placeholder="size lg · 아이콘 없음"
            />
          </div>
          <InputBox
            type="email"
            name="sample-invalid"
            aria-label="에러 견본"
            aria-invalid
            start={<Mail />}
            defaultValue="not-an-email"
          />
        </div>
      </Sample>

      <Sample
        title="PasswordInput (molecules/password-input) — 비밀번호 칸 + 보기/숨기기 버튼"
        code={`<PasswordInput name="password" autoComplete="current-password" /> · <PasswordInput name="password" autoComplete="new-password" start={<Lock />} />`}
      >
        <div className="grid w-full gap-4 md:grid-cols-2">
          <PasswordInput
            name="sample-password"
            aria-label="비밀번호 견본"
            autoComplete="off"
            defaultValue="password1234"
          />
          <PasswordInput
            name="sample-new-password"
            aria-label="새 비밀번호 견본"
            autoComplete="off"
            start={<Lock />}
            placeholder="8~72자"
          />
        </div>
      </Sample>

      <Sample
        title="FormField (molecules/form-field) — 라벨 + 입력칸 + 도움말 + 에러 연결"
        code={`<FormField id="email" label="이메일" error={errors.email}>{(field) => <InputBox {...field} name="email" type="email" />}</FormField>`}
      >
        <div className="grid w-full gap-4 md:grid-cols-2">
          <FormField
            id="sample-field-email"
            label="이메일"
            required
            description="로그인 아이디로 써요."
          >
            {(field) => (
              <InputBox
                {...field}
                name="sample-field-email"
                type="email"
                start={<Mail />}
                placeholder="you@soso.study"
              />
            )}
          </FormField>
          <FormField
            id="sample-field-password"
            label="비밀번호"
            labelEnd={
              <Link
                href={routes.forgotPassword}
                className="text-xs text-link hover:underline"
              >
                비밀번호를 잊으셨나요?
              </Link>
            }
            error="비밀번호는 8~72자로 써 주세요"
          >
            {(field) => (
              <PasswordInput
                {...field}
                name="sample-field-password"
                autoComplete="off"
                defaultValue="1234"
              />
            )}
          </FormField>
        </div>
      </Sample>

      <Sample
        title="FormAlert (molecules/form-alert) — 폼 위 안내 상자"
        code={`<FormAlert tone="error">이메일 또는 비밀번호가 맞지 않아요.</FormAlert> · <FormAlert>로그아웃했어요.</FormAlert> · <FormAlert tone="success">…</FormAlert>`}
      >
        <div className="grid w-full gap-3 md:grid-cols-3">
          <FormAlert tone="error">
            이메일 또는 비밀번호가 맞지 않아요.
          </FormAlert>
          <FormAlert>로그아웃했어요.</FormAlert>
          <FormAlert tone="success">가입했어요. 로그인해 주세요.</FormAlert>
        </div>
      </Sample>

      <Sample
        title="SubmitButton (atoms/submit-button) — 보내는 중이면 잠기고 글자가 바뀜"
        code={`<SubmitButton pendingText="가입 중…">가입하기</SubmitButton> · <SubmitButton pending={isPending} pendingText="로그인 중…">로그인</SubmitButton>`}
      >
        <SubmitButton className="w-40">로그인</SubmitButton>
        <SubmitButton pending pendingText="로그인 중…" className="w-40">
          로그인
        </SubmitButton>
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
