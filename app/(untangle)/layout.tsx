import { MainNav } from "@/components/main-nav";

// Untangle 5개 화면이 함께 쓰는 공통 레이아웃
// (untangle)은 라우트 그룹이라 주소(URL)에는 나타나지 않는다.
// 데스크톱에서도 모바일 너비(최대 430px)의 가운데 컬럼으로만 보여 준다.
export default function UntangleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px] border-x">
      {/* 아래 고정 탭 바에 가리지 않도록 아래 여백을 넉넉히 둔다 */}
      <main className="p-4 pb-28">{children}</main>
      <MainNav />
    </div>
  );
}
