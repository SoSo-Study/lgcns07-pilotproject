<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## 소소스터디 팀 규칙 (AI에게 코드를 물어볼 때 이 내용을 지켜 주세요)

- 버전: Next.js 16.4 App Router · React 19.3 · Tailwind CSS v4 (설정은 `app/globals.css`의 `@theme`, `tailwind.config.js` 없음) · shadcn (base-nova, `@base-ui/react`) · zod 4 · NextAuth v4 (`getServerSession(authOptions)`) · pnpm · `cacheComponents: true`
- 옛날 방식 대신: `middleware.ts` → `proxy.ts` · `params.id` → `await params` · `useFormState` → `useActionState` · `npm install` → `pnpm add`
- 요청 흐름: `page.tsx` → `actions/`("use server") → `service/`(fetch) → 강사님 Spring API. `page.tsx`에서 바로 fetch 금지
- `app/`에는 Next 파일(`page` · `layout` · `error` · `not-found` · `route` …)만. 부품은 `components/`에 (서버 액션을 부르는 부품은 `organisms/`, 보여 주기만 하는 작은 부품은 `molecules/`) — #71
- API 응답 모양: `types/api-response.ts`의 `{ success, code, message, data }`
- 파일 · 폴더 이름은 전부 kebab-case (`study-row.tsx`), 컴포넌트 이름은 PascalCase, 훅은 `hooks/use-*.ts`
- 화면 주소는 `config/routes.ts`, API 주소는 `config/api-paths.ts`, 분야 색은 `config/study-category.ts`에서 꺼내 쓰기
- 색은 `app/globals.css`에 정의된 이름만 (`bg-card`, `text-muted-foreground`, `text-status-open` …). `bg-[#…]` 같은 임의 값, `` `bg-${x}` `` 클래스 조립 금지
- 동적 `params` · `searchParams`를 await 하는 부분은 `<Suspense>` 안 자식 컴포넌트에서 (cacheComponents 때문)
- 비밀값은 `.env.local`에만. 화면 검사 + 서버 액션에서 한 번 더 검사. 작성자 id는 로그인 정보에서
