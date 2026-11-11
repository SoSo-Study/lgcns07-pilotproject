// app/(main)/studies/write/page.tsx
import { Suspense } from "react";
import { PageHeader } from "@/components/templates/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import FormFields from "./form-field";

export default function StudyWritePage() {
  return (
    <section
      style={{
        backgroundColor: "var(--bg-main, #12141c)",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <Suspense fallback={<Skeleton className="h-24 w-full" />}>
        <div style={{ maxWidth: "800px", color: "var(--text-main, #ffffff)" }}>
          <PageHeader title="새 모집글 등록" />
          <p
            style={{
              color: "var(--text-muted, #6b7280)",
              fontSize: "0.875rem",
              marginTop: "-1.5rem",
              marginBottom: "2rem",
            }}
          >
            새로운 스터디 그룹을 개설하고 함께 공부할 멤버를 모아보세요.
          </p>
          <FormFields />
        </div>
      </Suspense>
    </section>
  );
}
