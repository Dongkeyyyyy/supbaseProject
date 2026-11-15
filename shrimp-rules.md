# Development Guidelines

> AI Agent 전용 규칙 문서. 이 저장소(`my-app`)에서 작업할 때 반드시 따른다.

## 프로젝트 개요

- 목적: Untangle(가칭) 웹 프로토타입 구현. 브레인 덤프 → 분류(걱정 / 해야 할 일 / Archive / 삭제) → 해야 할 일 처리 흐름을 1~2주 직접 써 보며 검증한다. 최종 목표는 iPhone 앱이다.
- 스택: Next.js(App Router), React 19, TypeScript strict, Tailwind CSS v3, shadcn/ui(`new-york`), lucide-react, Supabase 스타터 코드(인증).
- 데이터 저장: 브라우저 `localStorage`만 사용한다. 서버·DB·로그인 없음(F010).
- 기준 문서: `docs/prd.md`(기능 F001~F007, F010), `docs/roadmap.md`(Task 순서), `docs/untangle-mvp-plan.md`, `CLAUDE.md`.
- 사용자는 Java/JavaScript에는 익숙하나 React/Next.js/TypeScript는 낯설다. 추상화·라이브러리를 최소화하고 읽기 쉬운 코드를 작성한다.

## 프로젝트 구조

| 경로                                             | 용도                                                     |
| ------------------------------------------------ | -------------------------------------------------------- |
| `app/`                                           | App Router 페이지. `src/` 디렉터리는 없다                |
| `app/auth/*`, `app/protected`, `app/instruments` | Supabase 스타터 코드. Untangle 기능을 여기에 넣지 않는다 |
| `components/`                                    | 공용 컴포넌트 (`kebab-case.tsx`)                         |
| `components/ui/`                                 | shadcn 컴포넌트. 직접 수정하지 않고 CLI/MCP로 추가한다   |
| `lib/`                                           | 유틸과 저장 모듈                                         |
| `lib/supabase/`                                  | Supabase 클라이언트. `database.types.ts`는 생성 파일     |
| `proxy.ts`                                       | 루트 요청 프록시 (`middleware.ts` 대체)                  |
| `docs/`                                          | 한국어 문서 (PRD, 로드맵, 가이드)                        |
| `shrimp_data/`                                   | Shrimp 작업 데이터. 수정하지 않는다                      |

- 경로 별칭 `@/*`는 프로젝트 루트다. 예: `@/components/ui/button`.
- 신규 Untangle 화면은 `app/` 아래 5개 라우트(브레인 덤프, 걱정, 해야 할 일, Archive, 대시보드)로 만든다. 첫 화면(`/`)은 브레인 덤프여야 한다.

## 코드 규약

- 주석·커밋 메시지·문서는 **한국어**, 변수명·함수명은 **영어**로 쓴다.
- 들여쓰기 2칸. Tailwind 클래스로 스타일링한다. CSS 파일을 새로 만들지 않는다.
- TypeScript strict를 지킨다. `any`를 쓰지 않는다.
- 타입 정의에는 한국어 주석을 달아 Java 클래스처럼 읽히게 한다.
- 조건부 클래스는 `lib/utils.ts`의 `cn()`을 쓴다.
- 작업 완료 전 `npm run check`(lint + typecheck + format:check)를 실행한다.
- Husky pre-commit이 실패하면 원인을 고친다. `--no-verify`를 쓰지 않는다.

```ts
// 올바른 예
// 항목 한 개를 나타낸다
type Item = { content: string; status: ItemStatus };

// 잘못된 예: any, 영어 주석 없이 의미 불명 이름
const d: any = load();
```

## Untangle 기능 구현 규칙

### 데이터 모델

- 모든 생각·걱정·할 일은 하나의 "항목" 모델로 관리한다.
- 필드: 내용, 상태(브레인 덤프 / 걱정 / 해야 할 일 / Archive), 걸리는 시간(Quick / Focus, 해야 할 일만), 언제(오늘 / 이번 주 / 언젠가, 해야 할 일만), 원래 걱정(행동으로 바꾼 경우 연결), 생성 시각 등 정렬용 보조 필드.
- 삭제는 상태가 아니다. 목록에서 제거한다.
- 걱정을 행동으로 바꾸면 새 해야 할 일 항목을 만들고 "원래 걱정"을 연결한다. 원래 걱정에는 "행동으로 옮김"을 표시한다.

### 저장

- 저장 로직은 하나의 모듈에 모으고 모든 화면이 같은 모듈을 쓴다.
- `localStorage` 접근은 클라이언트 컴포넌트/브라우저에서만 한다. 서버 컴포넌트에서 호출하지 않는다.
- 저장소가 비었거나 JSON이 깨졌을 때 앱이 죽지 않게 처리한다.

### UX 규칙

- 입력 단계에서 우선순위·날짜·태그를 묻지 않는다.
- 입력창은 항상 보이고, 추가 후에도 유지된다. 여러 줄 붙여넣기는 줄마다 항목으로 만든다. 공백만 있는 입력은 무시한다.
- 삭제 직후에는 짧게 되돌릴 수 있어야 한다.
- Quick(10분 이하)은 **초록**, Focus(30분 이상)는 **노랑**으로 표시하고, 반드시 글자(Quick / Focus)를 함께 표시한다. 색만으로 구분하지 않는다.
- 완료율, 연속 기록, 빨간 지연 표시 같은 압박 요소를 넣지 않는다.
- 모바일(iPhone 폭)에서 한 손 조작이 가능해야 한다. 입력은 Enter로 추가한다.

### PRD 밖 기능 (구현 금지)

AI, 우선순위, 프로젝트, 태그, 캘린더, 정확한 마감 시간, 반복 일정, 알림, 통계, 로그인, 서버, 소셜 기능은 만들지 않는다. 요청이 오면 PRD 변경 여부를 사용자에게 확인한다.

## 인증·프록시 (스타터 코드와 PRD 충돌 지점)

- PRD는 "로그인 없음"이지만 `lib/supabase/proxy.ts`는 비로그인 사용자를 `/auth/login`으로 보낸다. 공개 경로는 `/`, `/login*`, `/auth*`, `/instruments*`뿐이다.
- Untangle 5개 화면을 비로그인으로 쓰려면 `lib/supabase/proxy.ts`의 조건문에 해당 경로를 추가한다. 프로젝트 위치(분리 vs `my-app`) 결정은 로드맵 Task 001에서 한다. 결정 전에는 사용자에게 확인한다.
- `middleware.ts`를 만들지 않는다. `proxy.ts`를 쓴다.
- `lib/supabase/proxy.ts`에서 `createServerClient`와 `supabase.auth.getClaims()` 사이에 코드를 넣지 않는다.
- `updateSession`이 반환하는 `supabaseResponse`는 그대로 반환한다. 새 응답을 만들면 쿠키를 복사한다.
- Supabase 서버 클라이언트(`lib/supabase/server.ts`의 `createClient()`)는 요청마다 새로 만든다. 전역 변수에 담지 않는다.

## shadcn/ui·Tailwind 사용 규칙

- 새 UI 컴포넌트는 shadcn CLI 또는 shadcn MCP로 추가한다. `components/ui/*`를 손으로 새로 만들지 않는다.
- 현재 있는 컴포넌트: badge, button, card, checkbox, dropdown-menu, input, label. 있는 것을 먼저 재사용한다.
- 아이콘은 `lucide-react`만 쓴다.
- Tailwind는 v3다. v4 문법으로 마이그레이션하지 않는다.
- Prettier가 `prettier-plugin-tailwindcss`로 클래스를 정렬한다. 수동 정렬하지 않는다.

## 파일 연동 규칙

| 변경 대상                       | 함께 수정할 파일                                                          |
| ------------------------------- | ------------------------------------------------------------------------- |
| 기능 추가·삭제·변경 (F001~F010) | `docs/prd.md` → `docs/roadmap.md` → 필요 시 `docs/LEANCANVAS.md`          |
| Task 완료                       | `docs/roadmap.md`에 ✅ 표시                                               |
| 새 Task 발생                    | `docs/roadmap.md`를 먼저 갱신(우선순위 작업은 마지막 완료 Task 바로 다음) |
| Supabase 스키마 변경            | `lib/supabase/database.types.ts`를 `generate_typescript_types`로 재생성   |
| 공개 경로 추가                  | `lib/supabase/proxy.ts` 조건문                                            |
| 명령어·아키텍처·규약 변경       | `CLAUDE.md`                                                               |
| 필요한 환경 변수 변경           | `CLAUDE.md`(값은 쓰지 않음)                                               |

- `docs/guides/*`는 `src/` 구조를 가정한다. 실제 저장소는 `src/`가 없으므로 실제 구조를 따른다.

## 워크플로우

1. `docs/roadmap.md`에서 현재 Task와 수락 기준을 확인한다.
2. 구조 우선 순서: 골격 → 더미 데이터 화면 → 실제 동작 순으로 만든다.
3. 구현 후 `npm run check`를 실행한다.
4. 저장·분류 같은 비즈니스 로직은 Playwright MCP로 직접 눌러 검증한다(입력, 새로고침 유지, 상태 이동).
5. 로드맵에 ✅를 표시한다.
6. **Task가 끝나면 멈추고 다음 지시를 기다린다.** 다음 Task로 자동 진행하지 않는다.
7. 한 Task는 반나절~2일 분량으로 유지한다.

## AI 의사결정 기준

| 상황                                               | 판단                                                                   |
| -------------------------------------------------- | ---------------------------------------------------------------------- |
| 요청이 PRD 기능 목록에 없다                        | 구현하지 말고 사용자에게 PRD 반영 여부를 묻는다                        |
| 기능을 서버/DB로 구현해야 할 것 같다               | `localStorage`로 해결 가능한지 먼저 본다. 불가하면 사용자에게 확인한다 |
| 새 라이브러리가 필요해 보인다                      | 기존 의존성과 직접 구현을 우선한다. 추가 전에 사용자에게 확인한다      |
| 문서와 실제 코드가 다르다                          | 실제 코드를 따르고 문서 불일치를 사용자에게 알린다                     |
| 열린 질문(어제의 "오늘" 항목 처리, 문구 수정 범위) | Task 006 전에 사용자와 확정한다. 임의로 정하지 않는다                  |
| 라이브러리 API가 불확실하다                        | context7 MCP로 최신 문서를 확인한다                                    |

## 금지 사항

- `.env*` 파일 읽기·수정·커밋.
- force push(`git push --force`, `-f`), `rm -rf`.
- `--no-verify`로 pre-commit 우회.
- `middleware.ts` 생성.
- `components/ui/*` 직접 작성·임의 수정.
- `shrimp_data/` 수정, `lib/supabase/database.types.ts` 수동 편집.
- 한국어 규약 위반(영어 주석, 영어 커밋 메시지).
- PRD 밖 기능 추가, 압박 요소 추가.
- Task 완료 후 지시 없이 다음 Task 진행.
- `src/` 디렉터리 생성.
