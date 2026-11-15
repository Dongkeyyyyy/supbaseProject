import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

// 오픈 리다이렉트 방지: 같은 사이트의 상대 경로만 허용한다
function getSafeNextPath(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/protected";
  }
  return next;
}

// OAuth(Google) 로그인 후 돌아오는 콜백. 인증 코드를 세션으로 교환한다.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeNextPath(searchParams.get("next"));

  // 사용자가 Google 동의 화면에서 취소하는 등 provider가 오류를 돌려준 경우
  const providerError = searchParams.get("error_description");
  if (providerError) {
    return NextResponse.redirect(
      `${origin}/auth/error?error=${encodeURIComponent(providerError)}`,
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 로드밸런서 뒤에서는 원래 호스트가 x-forwarded-host로 전달된다
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocal = process.env.NODE_ENV === "development";

      if (!isLocal && forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }

    return NextResponse.redirect(
      `${origin}/auth/error?error=${encodeURIComponent(error.message)}`,
    );
  }

  return NextResponse.redirect(
    `${origin}/auth/error?error=${encodeURIComponent("인증 코드가 없습니다")}`,
  );
}
