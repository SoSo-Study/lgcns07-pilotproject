import { Sidebar } from "@/components/organisms/sidebar";
import { MobileHeader } from "@/components/organisms/mobile-header";

// 768px 이상: 왼쪽 사이드바 + 오른쪽 본문 · 폰: 위 헤더(☰) + 아래 본문
// (목록 · 상세 · 등록 · 내 모집글 · 신청자 관리)
export default function MainLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <MobileHeader />
      <Sidebar />
      <main className="mx-auto flex w-full max-w-6xl min-w-0 flex-1 flex-col px-4 py-8 md:px-8">
        {children}
      </main>
    </div>
  );
}
