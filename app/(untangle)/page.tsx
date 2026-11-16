"use client";

import { DurationWhenPicker } from "@/components/duration-when-picker";
import { EmptyState } from "@/components/empty-state";
import { ItemCard } from "@/components/item-card";
import { QuickAddInput } from "@/components/quick-add-input";
import { UndoBar } from "@/components/undo-bar";
import { Button } from "@/components/ui/button";
import {
  createItem,
  getItems,
  getItemsByStatus,
  sortByNewest,
} from "@/lib/items";
import type { Duration, Item, When } from "@/lib/types";
import { Archive, CircleCheck, CloudRain, Trash2 } from "lucide-react";
import { useState } from "react";

// 방금 삭제한 항목과 원래 위치 (되돌리기에 쓴다)
type DeletedItem = { item: Item; index: number };

// 브레인 덤프 (첫 화면).
// 주의: Phase 2에서는 화면 모양을 확인하는 단계라서, 분류한 항목은 이 화면 목록에서만
// 사라지고 다른 화면으로 옮겨지지는 않는다. 실제 이동과 저장은 Task 006~007에서 만든다.
export default function BrainDumpPage() {
  const [items, setItems] = useState<Item[]>(() =>
    sortByNewest(getItemsByStatus(getItems(), "brainDump")),
  );
  // "해야 할 일" 선택 UI가 펼쳐진 항목의 id와, 고른 값
  const [openId, setOpenId] = useState<string | null>(null);
  const [duration, setDuration] = useState<Duration | undefined>();
  const [when, setWhen] = useState<When | undefined>();
  // 되돌리기 바에 보여 줄 방금 삭제한 항목
  const [deleted, setDeleted] = useState<DeletedItem | null>(null);

  // 입력창에서 한 줄을 추가한다. (저장은 Task 005, 006에서)
  function addItem(content: string) {
    const newItem = createItem({ content, status: "brainDump" });
    setItems((current) => [newItem, ...current]);
  }

  // 이 화면 목록에서 항목을 뺀다. (걱정 / Archive / 해야 할 일 확정에 쓴다)
  function removeFromList(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
    setOpenId(null);
  }

  function openTodoPicker(id: string) {
    setOpenId(id);
    setDuration(undefined);
    setWhen(undefined);
  }

  function deleteItem(item: Item) {
    const index = items.findIndex((current) => current.id === item.id);
    setItems((current) => current.filter((c) => c.id !== item.id));
    setDeleted({ item, index });
    setOpenId(null);
  }

  function undoDelete() {
    if (deleted) {
      const { item, index } = deleted;
      setItems((current) => [
        ...current.slice(0, index),
        item,
        ...current.slice(index),
      ]);
    }
    setDeleted(null);
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">브레인 덤프</h1>
      <QuickAddInput onAdd={addItem} />

      {items.length === 0 ? (
        <EmptyState message="비어 있어요. 떠오르는 생각을 편하게 적어 보세요." />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id}>
              <ItemCard
                item={item}
                actions={[
                  {
                    label: "걱정",
                    icon: CloudRain,
                    onClick: () => removeFromList(item.id),
                  },
                  {
                    label: "해야 할 일",
                    icon: CircleCheck,
                    onClick: () => openTodoPicker(item.id),
                  },
                  {
                    label: "Archive",
                    icon: Archive,
                    onClick: () => removeFromList(item.id),
                  },
                  {
                    label: "삭제",
                    icon: Trash2,
                    onClick: () => deleteItem(item),
                  },
                ]}
              >
                {openId === item.id && (
                  <div className="space-y-3 border-t pt-3">
                    <DurationWhenPicker
                      duration={duration}
                      when={when}
                      onDurationChange={setDuration}
                      onWhenChange={setWhen}
                    />
                    <Button
                      type="button"
                      disabled={!duration || !when}
                      onClick={() => removeFromList(item.id)}
                      className="min-h-11 w-full"
                    >
                      해야 할 일로 정하기
                    </Button>
                  </div>
                )}
              </ItemCard>
            </li>
          ))}
        </ul>
      )}

      <UndoBar
        open={deleted !== null}
        restartKey={deleted?.item.id}
        onUndo={undoDelete}
        onClose={() => setDeleted(null)}
      />
    </section>
  );
}
