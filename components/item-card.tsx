import { DurationBadge } from "@/components/duration-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { whenLabels, type Item } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

// 카드 아래에 놓이는 버튼 한 개의 정보
export type ItemAction = {
  label: string; // 버튼 글자 (한국어)
  icon: LucideIcon; // 버튼 아이콘
  onClick: () => void; // 눌렀을 때 할 일
};

// 항목 한 개를 보여 주는 카드.
// - 내용과, 해야 할 일이면 걸리는 시간 배지와 시점을 보여 준다.
// - meta: 내용 아래에 덧붙일 표시 (예: "행동으로 옮김")
// - actions: 아래에 나란히 놓일 버튼들 (화면마다 필요한 것만 넘긴다)
// - children: 버튼 아래로 펼쳐지는 영역 (예: 시간·언제 선택, 행동 입력)
export function ItemCard({
  item,
  meta,
  actions = [],
  children,
}: {
  item: Item;
  meta?: React.ReactNode;
  actions?: ItemAction[];
  children?: React.ReactNode;
}) {
  return (
    <Card className="space-y-3 p-4">
      <p className="break-words">{item.content}</p>

      {(item.duration || item.when || meta) && (
        <div className="flex flex-wrap items-center gap-2">
          {item.duration && <DurationBadge duration={item.duration} />}
          {item.when && (
            <span className="text-xs text-muted-foreground">
              {whenLabels[item.when]}
            </span>
          )}
          {meta}
        </div>
      )}

      {actions.length > 0 && (
        // 버튼이 4개(브레인 덤프 분류)이면 2×2로 가지런히, 그 외에는 한 줄에 맞춰 나열한다
        <div
          className={cn(
            actions.length === 4
              ? "grid grid-cols-2 gap-2"
              : "flex flex-wrap gap-2",
          )}
        >
          {actions.map(({ label, icon: Icon, onClick }) => (
            <Button
              key={label}
              type="button"
              variant="outline"
              size="sm"
              onClick={onClick}
              className="min-h-11 flex-1 px-3"
            >
              <Icon aria-hidden="true" />
              {label}
            </Button>
          ))}
        </div>
      )}

      {children}
    </Card>
  );
}
