"use client";

import { DurationBadge } from "@/components/duration-badge";
import { DurationWhenPicker } from "@/components/duration-when-picker";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  getItems,
  getItemsByStatus,
  sortByNewest,
  updateItem,
} from "@/lib/items";
import { whenLabels, type Duration, type Item, type When } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useState } from "react";

// 섹션 표시 순서: 오늘 → 이번 주 → 언젠가
const sections: When[] = ["today", "thisWeek", "someday"];

// 해야 할 일 화면. 시점별로 묶어서 보여 주고, 완료 체크와 시간·언제 변경 UI를 제공한다.
// 주의: Phase 2에서는 화면 모양 확인용이라 완료 체크는 표시만 되고 Archive로 옮겨지지 않는다.
// (완료 시 Archive 이동은 Task 007에서 만든다)
export default function TodosPage() {
  const [items, setItems] = useState<Item[]>(() => getItems());
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  // 시간·언제 변경 UI가 펼쳐진 항목의 id
  const [openId, setOpenId] = useState<string | null>(null);

  const todos = sortByNewest(getItemsByStatus(items, "todo"));

  function toggleChecked(id: string, checked: boolean) {
    setCheckedIds((current) =>
      checked ? [...current, id] : current.filter((value) => value !== id),
    );
  }

  // 시간 또는 시점을 바꾼다. 시점이 바뀌면 항목이 다른 섹션으로 옮겨 간다.
  function changeTodo(
    id: string,
    changes: { duration?: Duration; when?: When },
  ) {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? updateItem(item, changes) : item,
      ),
    );
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">해야 할 일</h1>

      {sections.map((section) => {
        const sectionTodos = todos.filter((item) => item.when === section);
        return (
          <div key={section} className="space-y-2">
            <h2 className="text-lg font-semibold">{whenLabels[section]}</h2>
            {sectionTodos.length === 0 ? (
              <EmptyState message="여기에는 아직 없어요." />
            ) : (
              <ul className="space-y-2">
                {sectionTodos.map((item) => {
                  const checked = checkedIds.includes(item.id);
                  const open = openId === item.id;
                  return (
                    <li key={item.id}>
                      <Card className="space-y-2 p-4">
                        {/* 줄 전체를 눌러도 체크되도록 label로 감싸고, 높이는 44px 이상 */}
                        <label className="flex min-h-11 items-center gap-3">
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

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          aria-expanded={open}
                          onClick={() => setOpenId(open ? null : item.id)}
                          className="min-h-11 w-full text-muted-foreground"
                        >
                          시간·언제 바꾸기
                        </Button>

                        {open && (
                          <div className="border-t pt-3">
                            <DurationWhenPicker
                              duration={item.duration}
                              when={item.when}
                              onDurationChange={(duration) =>
                                changeTodo(item.id, { duration })
                              }
                              onWhenChange={(when) =>
                                changeTodo(item.id, { when })
                              }
                            />
                          </div>
                        )}
                      </Card>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </section>
  );
}
