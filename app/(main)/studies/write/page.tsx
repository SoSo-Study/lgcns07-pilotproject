import { Suspense } from "react";
import { PageHeader } from "@/components/templates/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { loadStudyForEdit } from "@/actions/study-write-actions";
import FormFields from "./form-field";

// ③ 모집글 등록 · 수정 — 수정은 주소로: /studies/write?studyId=3 (routes.studyEdit)
// 로그인은 proxy가 먼저 확인해요. 수정은 "내 글인지"를 서버에서 한 번 더 (#45 B6)
// 강사님 방식: page는 동기 함수, searchParams를 await 하는 부분은 Suspense 안 자식에서
export default function StudyWritePage({
  searchParams,
}: PageProps<"/studies/write">) {
  return (
    <Suspense fallback={<Skeleton className="h-24 w-full" />}>
      <StudyWrite searchParams={searchParams} />
    </Suspense>
  );
}

async function StudyWrite({
  searchParams,
}: Pick<PageProps<"/studies/write">, "searchParams">) {
  const { studyId } = await searchParams;

  // 등록
  if (typeof studyId !== "string") {
    return (
      <section>
        <PageHeader
          title="새 모집글 등록"
          description="새로운 스터디 그룹을 개설하고 함께 공부할 멤버를 모아보세요."
        />
        <FormFields />
      </section>
    );
  }

  // 수정 — 내 글일 때만 폼을 채워서 보여 줘요 (화면 → 액션 → 서비스)
  const result = await loadStudyForEdit(studyId);
  if (!result.ok) {
    return (
      <section>
        <PageHeader title="모집글 수정" />
        <p role="alert" className="text-sm text-destructive">
          {result.message}
        </p>
      </section>
    );
  }
  const { study } = result;

  return (
    <section>
      <PageHeader
        title="모집글 수정"
        description="바꾼 내용은 바로 목록과 상세에 반영돼요."
      />
      <FormFields
        key={study.id}
        initial={{
          id: study.id,
          title: study.title,
          category: study.category,
          techTags: study.techTags,
          maxMembers: study.maxMembers,
          deadline: study.deadline,
          mode: study.mode,
          content: study.content,
        }}
      />
    </section>
  );
}
