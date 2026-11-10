import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type SearchFormProps = {
  action: string; // 검색 결과를 볼 주소 (예: routes.studies)
  defaultValue?: string; // 지금 검색어 (주소의 ?q= 값)
  placeholder?: string;
  hidden?: Record<string, string | undefined>; // 검색해도 유지할 값 (예: { category: "CS" })
};

// 검색창 — 강사님 방식 GET 폼: 제출하면 주소가 ?q=검색어 로 바뀜 (자바스크립트 없이 동작)
// 사용: <SearchForm action={routes.studies} defaultValue={q} hidden={{ category }} />
export function SearchForm({
  action,
  defaultValue,
  placeholder = "스터디 제목, 기술 태그로 검색…",
  hidden,
}: SearchFormProps) {
  return (
    <form action={action} role="search" className="relative flex-1">
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-label="스터디 검색"
        maxLength={30}
        className="h-9 bg-inset pl-9 dark:bg-inset"
      />
      {hidden &&
        Object.entries(hidden).map(([key, value]) =>
          value ? (
            <input key={key} type="hidden" name={key} value={value} />
          ) : null,
        )}
    </form>
  );
}
