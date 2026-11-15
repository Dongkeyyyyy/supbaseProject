# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 명령어

```bash
npm run dev     # 개발 서버
npm run build   # 프로덕션 빌드
npm run start   # 빌드 결과 실행
npm run lint    # eslint .
npm run lint:fix      # eslint . --fix
npm run typecheck     # tsc --noEmit
npm run format        # prettier --write .
npm run format:check  # prettier --check .
npm run check         # lint + typecheck + format:check (작업 완료 전 실행)
```

테스트 러너는 설정되어 있지 않다.

### 코드 품질 도구

- ESLint 9 flat config(`eslint.config.mjs`)에 `eslint-config-next`와 `eslint-config-prettier`를 쓴다. `.next`, `shrimp_data`, `database.types.ts`는 린트 대상에서 제외된다.
- Prettier(`.prettierrc`)는 `prettier-plugin-tailwindcss`로 Tailwind 클래스를 정렬한다. `docs/`, `CLAUDE.md`는 포맷 대상이 아니다.
- Husky pre-commit 훅이 `lint-staged`(staged 파일에 eslint --fix, prettier)와 `npm run typecheck`를 실행한다. 실패하면 커밋이 막히므로 `--no-verify`로 우회하지 않는다.
- `.claude/settings.json`의 PostToolUse 훅이 Claude가 수정한 파일에 Prettier를 자동 적용하고, `.env*` 읽기/수정과 force push를 차단한다.

## 스택

- Next.js (App Router, `latest`), React 19, TypeScript strict
- Tailwind CSS v3 + shadcn/ui (`new-york` 스타일, `components.json`), 아이콘은 lucide-react
- Supabase 인증/DB (`@supabase/ssr`, `@supabase/supabase-js`)
- 경로 별칭 `@/*`는 프로젝트 루트를 가리킨다. `src/` 디렉터리는 없다.

## 아키텍처

### 세션 갱신과 접근 제어 (여러 파일에 걸침)

- 루트 `proxy.ts`가 모든 요청(정적 파일·이미지 제외)에서 `lib/supabase/proxy.ts`의 `updateSession`을 호출한다. Next의 `middleware` 후속 파일 규칙인 `proxy.ts`를 쓰므로 `middleware.ts`를 만들지 않는다.
- `updateSession`은 쿠키 기반 세션을 갱신하고 `supabase.auth.getClaims()`로 사용자를 확인한다. 비로그인 사용자는 `/`, `/login*`, `/auth*`, `/instruments*`를 제외한 모든 경로에서 `/auth/login`으로 리다이렉트된다. 공개 경로를 추가하려면 이 조건문을 수정한다.
- `createServerClient`와 `getClaims()` 사이에는 코드를 넣지 않는다. 반환하는 `supabaseResponse`는 그대로 반환해야 한다. 어기면 사용자가 무작위로 로그아웃된다. 새 응답을 만들 때는 쿠키를 복사해야 한다.
- `hasEnvVars`(`lib/utils.ts`)가 false이면 proxy가 인증 검사를 모두 건너뛴다. 환경 변수 누락 시 보호 경로가 열려 보이는 원인이 된다.

### Supabase 클라이언트

- `lib/supabase/server.ts`: 서버 컴포넌트·라우트 핸들러용 `createClient()`. 요청마다 새로 만들고 전역 변수에 담지 않는다.
- `lib/supabase/client.ts`: 브라우저용.
- `lib/supabase/database.types.ts`: Supabase MCP의 `generate_typescript_types`로 생성한 타입이다. 스키마를 바꾸면 다시 생성한다. 현재 `profiles` 테이블이 있다.

### 라우트

- `app/auth/*`: login, sign-up, sign-up-success, forgot-password, update-password, error 페이지와 이메일 확인용 `confirm/route.ts`.
- Google OAuth: `components/google-login-button.tsx`가 `signInWithOAuth`로 Google에 보내고, `app/auth/callback/route.ts`가 `code`를 `exchangeCodeForSession`으로 세션 쿠키로 교환한 뒤 `next`(상대 경로만 허용, 기본 `/protected`)로 이동시킨다. 이메일 확인(`confirm`, token_hash)과는 별개의 흐름이다. Google Cloud/Supabase 대시보드 설정이 필요하다.
- `app/protected`: 로그인 후 영역(자체 `layout.tsx` 포함).
- `app/instruments`: 비로그인으로 접근 가능한 Supabase 조회 예시(Suspense + 서버 컴포넌트).
- `components/ui`: shadcn 컴포넌트. 새 컴포넌트는 shadcn CLI/MCP로 추가한다.

## 환경 변수

`.env.local`에 다음 두 값이 필요하다. 값은 문서나 커밋에 쓰지 않는다.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## MCP

`.mcp.json`에 supabase, playwright, context7, sequential-thinking, shadcn, shrimp-task-manager가 정의되어 있다. 프로젝트 MCP 서버는 `.claude/settings.local.json`의 `enabledMcpjsonServers`에 이름이 있어야 활성화된다. shrimp 데이터는 `shrimp_data/`에 저장된다.

## 문서

`docs/guides/`에 한국어 개발 가이드(nextjs-15, component-patterns, project-structure, styling-guide, forms-react-hook-form)가 있다. 일부 문서는 `src/` 구조를 가정하지만 실제 저장소에는 `src/`가 없으므로 실제 구조를 따른다.

## 규약

주석·커밋 메시지·문서는 한국어, 변수명·함수명은 영어, 들여쓰기는 2칸, 스타일은 Tailwind를 쓴다.
