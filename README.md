# 소소스터디 (soso.study)

> 모여서 각자 스터디 — 개발자 스터디 모집 웹앱 · LG CNS AM 7기 파일럿 프로젝트 2조

- 🎨 디자인(피그마): https://www.figma.com/design/W0olDz5eBBwsQpSFrFRmE0
- 🌿 브랜치: 내 브랜치 → `dev` → `main` (4절)
- 📋 할 일 보드: https://github.com/orgs/SoSo-Study/projects/1

## 1. 처음 받았을 때 (한 번만)

```bash
corepack enable          # pnpm 켜기 (한 번만)
pnpm install             # 패키지 설치 (npm install 쓰지 않기!)
cp .env.example .env.local   # 값은 팀 비공개 채팅방에서 받아 채우기
pnpm dev                 # http://localhost:3000
```

- Node 24 (`.nvmrc`) · pnpm (`package.json`의 `packageManager`)
- `package-lock.json`이 생기면 지우고 `pnpm install` 다시

## 2. 폴더 지도

```
app/
├─ (main)/            사이드바 있는 화면
│  ├─ studies/                 ① 둘러보기 (#5 · #9)
│  ├─ studies/[studyId]/       ② 상세 + 신청 (#6 · #8)
│  ├─ studies/write/           ③ 등록 · 수정 (?studyId= 있으면 수정, #7)
│  ├─ my-studies/              내 모집글 (#13)
│  └─ applicants/              ④ 신청자 관리 (#10)
└─ (auth)/            사이드바 없는 화면
   ├─ login/                   ⑤ 로그인 (#4)
   └─ signup/                  ⑥ 회원가입 (#3)
actions/      "use server" 서버 액션 (폼 제출 · 버튼)
service/      실제로 API를 부르는 곳 (fetch)
components/
├─ ui/           shadcn 원본 (고치지 말고 가져다 쓰기)
├─ atoms/        가장 작은 부품 (상태 뱃지 · 기술 태그 · 분야 칩)
├─ molecules/    작은 부품 몇 개 묶음
├─ organisms/    화면의 큰 덩어리 (사이드바 · 스터디 표)
└─ templates/    화면 틀 (제목 줄 등)
hooks/        use-로 시작하는 훅
schema/       zod 검사 규칙 (화면 · 서버가 같이 씀)
config/       routes.ts(화면 주소) · api-paths.ts(API 주소) · study-category.ts(분야 이름 · 색)
types/        study.ts(스터디 · 신청 모양) · api-response.ts(API 공통 응답)
lib/          utils.ts(cn) · mock-studies.ts(🧪 가짜 데이터 — API 연결 후 삭제)
```

## 3. 꼭 지킬 규칙 (틀만 지키면 내 파트 안에서는 자유!)

### 요청 흐름 (강사님 방식)

```
page.tsx  →  actions/  →  service/  →  강사님 Spring API
(화면)       (서버 액션)    (fetch)
```

- `page.tsx`에서 바로 `fetch` 하지 않기
- API 응답 모양은 `types/api-response.ts`의 `{ success, code, message, data }`. 실패하면 `message`를 그대로 보여 주기

### 이름

| 무엇                   | 규칙                                        | 예                                    |
| ---------------------- | ------------------------------------------- | ------------------------------------- |
| 파일 · 폴더            | **전부 소문자-하이픈** (검사 도구가 막아요) | `study-row.tsx`, `use-apply-state.ts` |
| 컴포넌트 이름(코드 안) | 대문자로 시작                               | `export function StudyRow()`          |
| 훅                     | `use`로 시작, `hooks/`에                    | `useApplyState`                       |
| 화면 주소              | `config/routes.ts`에서 꺼내 쓰기            | `routes.study(3)`                     |
| API 주소               | `config/api-paths.ts`에서 꺼내 쓰기         | `apiPaths.study.detail(3)`            |
| 파일 이름 바꾸기       | 탐색기 말고 `git mv 옛이름 새이름`          |                                       |

### 색 · 크기 (피그마 → 코드)

| 피그마 변수                                          | 코드 클래스                                                                                 |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `bg/canvas` · `bg/default` · `bg/muted` · `bg/inset` | `bg-background` · `bg-card` · `bg-muted` · `bg-inset`                                       |
| `fg/default` · `fg/muted` · `fg/subtle`              | `text-foreground` · `text-muted-foreground` · `text-subtle`                                 |
| `border/default`                                     | `border-border`                                                                             |
| `success/emphasis` (주 버튼)                         | `bg-primary` (shadcn `Button` 기본)                                                         |
| `danger/fg`                                          | `text-destructive`                                                                          |
| `accent/fg` (링크)                                   | `text-link`                                                                                 |
| 모집 중 · 마감                                       | `text-status-open` `bg-status-open-subtle` · `text-status-closed` `bg-status-closed-subtle` |
| 분야 색                                              | `config/study-category.ts`에서 꺼내 쓰기 (직접 조립 금지)                                   |

- 크기: 피그마 숫자 ÷ 4 = Tailwind 숫자 (gap 8 → `gap-2`, padding 16 → `p-4`), 모서리 6 → `rounded-md`, 동그라미 → `rounded-full`
- 글자: 12 · 14 · 16 · 24 → `text-xs` · `text-sm` · `text-base` · `text-2xl`
- ❌ `bg-[#161b22]`, `p-[13px]` 같은 직접 값 쓰지 않기 · ❌ `` `bg-category-${x}` `` 처럼 클래스 조립하지 않기 (색이 안 나와요)
- 🧩 **공통 부품 견본: `pnpm dev` → http://localhost:3000/ui-kit** (상태 뱃지 · 기술 태그 · 분야 칩 · 입력칸 · 검색창 · 스터디 표 · 쪽 번호 · 빈 화면 + 사용 코드)
- 피그마 버튼 → 코드: primary = `<Button>` · default = `<Button variant="outline">` · danger = `<Button variant="destructive">`
- 견본에 없는 공통 부품이 필요하면 **만들기 전에 팀에 먼저 물어보기**

## 4. Git 흐름 — 내 브랜치 → dev → main

```
feat/5-study-list ─PR(Squash)─▶ dev ─PR(Merge, 리더)─▶ main (발표 · 배포용 완성본)
```

| 브랜치 | 역할 | 합치는 방법 |
|---|---|---|
| `dev` (기본 브랜치) | 매일 모으는 곳. 모든 PR은 여기로 | **Squash and merge** (승인 1명) |
| `main` | 확인을 마친 완성본 (배포 · 발표) | 리더가 dev → main PR을 **Create a merge commit**으로 (승인 1명) |

1. 보드에서 내 이슈 고르기 → 이슈 오른쪽 **Assignees → assign yourself**
2. 최신 dev 받기: `git switch dev` → `git pull`
3. 브랜치 만들기: `git switch -c feat/5-study-list` (소문자-하이픈, `feat/` · `fix/` · `style/`로 시작)
4. 작업 → 커밋 (커밋할 때 자동 검사가 돌아요: ESLint + Prettier)
5. 올리기 전에 `pnpm build` 통과 확인 → `git push -u origin 브랜치이름`
6. GitHub에서 PR 만들기 — **받는 쪽(base)이 `dev`인지 확인**, 제목은 `feat: 스터디 목록 표` 처럼, 설명 맨 위에 `Closes #5`
7. 리뷰 1명 승인 + 미리보기 확인 → 리더가 **Squash and merge**
8. 합쳐지면: `git switch dev` → `git pull` → 다음 브랜치

- dev · main에는 직접 push 못 해요(보호 규칙). 하던 작업이 있는데 dev를 받아야 하면 `git stash` → `git pull` → `git stash pop`
- 처음에 main으로 clone했다면 한 번만: `git fetch` → `git switch dev`
- dev → main은 리더만, **Merge commit**으로 (Squash로 합치면 다음번 dev → main에서 충돌이 나요)

## 5. 🔒 보안

- 서버 주소 · 비밀번호 · 토큰 · `.env.local` 값은 코드 · 이슈 · 캡처 · 커밋에 넣지 않기 (`.env.example`만 커밋)
- 화면에서 검사해도 **서버(액션)에서 한 번 더** 검사하기
- 작성자 · 신청자 id는 폼에서 받지 말고 로그인 정보에서 꺼내기
- 모두 같은 DB를 써요 → 진짜 개인정보 넣지 않기 · 남의 데이터 지우지 않기
- `console.log`로 토큰 · 응답 전체 찍은 것은 PR 전에 지우기

## 6. 스크립트

| 명령          | 하는 일                                |
| ------------- | -------------------------------------- |
| `pnpm dev`    | 개발 서버                              |
| `pnpm build`  | 배포와 같은 방식으로 빌드 (PR 전에 꼭) |
| `pnpm lint`   | 규칙 검사 (파일 이름 포함)             |
| `pnpm format` | 모양 정리 (Tailwind 클래스 순서 포함)  |
