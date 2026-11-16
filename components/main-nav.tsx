"use client";

import { cn } from "@/lib/utils";
import {
  Archive,
  Brain,
  CircleCheck,
  CloudRain,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// 내비게이션 메뉴 한 칸의 정보
type MenuItem = {
  label: string; // 화면에 보이는 이름 (한국어)
  href: string; // 이동할 경로
  icon: LucideIcon; // 메뉴 아이콘
};

// 5개 메뉴. PRD의 메뉴 순서를 따른다. 메뉴를 바꾸려면 이 배열만 고치면 된다.
export const menuItems: MenuItem[] = [
  { label: "브레인 덤프", href: "/", icon: Brain },
  { label: "걱정", href: "/worries", icon: CloudRain },
  { label: "해야 할 일", href: "/todos", icon: CircleCheck },
  { label: "Archive", href: "/archive", icon: Archive },
  { label: "대시보드", href: "/dashboard", icon: LayoutDashboard },
];

// 현재 경로가 해당 메뉴인지 확인한다. "/"는 정확히 같을 때만 활성으로 본다.
function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MainNav() {
  const pathname = usePathname();

  return (
    // 모바일 너비 컬럼(430px) 아래에 고정되는 탭 바.
    // 바깥 래퍼는 클릭을 통과시키고, 안쪽 둥근 바만 클릭을 받는다.
    <nav
      aria-label="주요 메뉴"
      className="pointer-events-none fixed bottom-0 left-1/2 z-10 w-full max-w-[430px] -translate-x-1/2 px-4 pb-4"
    >
      <ul className="pointer-events-auto flex rounded-full border bg-background px-1 shadow-lg">
        {menuItems.map(({ label, href, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 text-[11px]",
                  active
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground",
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
