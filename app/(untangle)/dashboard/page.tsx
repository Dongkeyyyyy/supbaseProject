"use client";

import { DurationBadge } from "@/components/duration-badge";
import { EmptyState } from "@/components/empty-state";
import { QuickAddInput } from "@/components/quick-add-input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  createItem,
  getItems,
  getItemsByStatus,
  sortByNewest,
} from "@/lib/items";
import { cn } from "@/lib/utils";
import type { Item } from "@/lib/types";
import Link from "next/link";
import { useState } from "react";

// 대시보드: 오늘 해야 할 일과 아직 정리하지 않은 생각의 개수만 한눈에 보여 준다.
// 완료율, 연속 기록, 지연 표시 같은 압박 요소는 넣지 않는다.
// 주의: Phase 2에서는 화면 모양 확인용이라 완료 체크는 이 화면에서만 표시된다.
export default function DashboardPage() {
  const [items, setItems] = useState<Item[]>(() => getItems());
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  // 오늘 할 일, 그리고 아직 분류하지 않은 항목의 개수
  const todayTodos = sortByNewest(
    getItemsByStatus(items, "todo").filter((item) => item.when === "today"),
  );
  const unsortedCount = getItemsByStatus(items, "brainDump").length;

  // 입력창에서 추가한 한 줄은 브레인 덤프 항목이 된다. (저장은 Task 005, 006에서)
  function addItem(content: string) {
    const newItem = createItem({ content, status: "brainDump" });
    setItems((current) => [newItem, ...current]);
  }

  function toggleChecked(id: string, checked: boolean) {
    setCheckedIds((current) =>
      checked ? [...current, id] : current.filter((value) => value !== id),
    );
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">대시보드</h1>

      <QuickAddInput onAdd={addItem} />

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">오늘 해야 할 일</h2>
        {todayTodos.length === 0 ? (
          <EmptyState message="오늘 정해 둔 일이 없어요." />
        ) : (
          <ul className="space-y-2">
            {todayTodos.map((item) => {
              const checked = checkedIds.includes(item.id);
              return (
                <li key={item.id}>
                  <Card>
                    {/* 줄 전체를 눌러도 체크되도록 label로 감싸고, 높이는 44px 이상 */}
                    <label className="flex min-h-11 items-center gap-3 px-4 py-2">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(value) =>
                          toggleChecked(item.id, value === true)
                        }
                        aria-label={`${item.content} 완료`}
                      />
                      <span
                        className={cn(
                          "min-w-0 flex-1 break-words",
                          checked && "text-muted-foreground line-through",
                        )}
                      >
                        {item.content}
                      </span>
                      {item.duration && (
                        <DurationBadge duration={item.duration} />
                      )}
                    </label>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Link href="/" className="block">
        <Card className="flex min-h-11 items-center justify-between px-4 py-3">
          <span className="text-sm text-muted-foreground">
            정리를 기다리는 생각
          </span>
          <span className="text-2xl font-semibold">{unsortedCount}</span>
        </Card>
      </Link>
    </section>
  );
}
