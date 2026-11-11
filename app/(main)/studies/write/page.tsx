import { Suspense } from "react";
import { PageHeader } from "@/components/templates/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import FormFields from "./form-field";

export default function StudyWritePage() {
  return (
    <section>
      <PageHeader
        title="새 모집글 등록"
        description="새로운 스터디 그룹을 개설하고 함께 공부할 멤버를 모아보세요."
      />
      <Suspense fallback={<Skeleton className="h-24 w-full" />}>
        <FormFields />
      </Suspense>
    </section>
  );
}
