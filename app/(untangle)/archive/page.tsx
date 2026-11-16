"use client";

import { EmptyState } from "@/components/empty-state";
import { ItemCard } from "@/components/item-card";
import {
  getItems,
  getItemsByStatus,
  sortByRecentlyUpdated,
  updateItem,
} from "@/lib/items";
import type { Item } from "@/lib/types";
import { Trash2, Undo2 } from "lucide-react";
import { useState } from "react";

// Archive 화면. 끝낸 일과 치워 둔 생각을 지우지 않고 보관한다.
// 주의: Phase 2에서는 화면 모양 확인용이라 이 화면 목록에서만 사라지고 저장은 하지 않는다.
// (브레인 덤프로 실제 되돌리기는 Task 007에서 만든다)
export default function ArchivePage() {
  const [items, setItems] = useState<Item[]>(() => getItems());

  // 최근에 보관한(바뀐) 항목이 먼저 보이게 한다
  const archived = sortByRecentlyUpdated(getItemsByStatus(items, "archive"));

  // 브레인 덤프로 되돌린다. (이 화면에서는 상태만 바꿔 목록에서 사라지게 한다)
  function restoreItem(id: string) {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? updateItem(item, { status: "brainDump" }) : item,
      ),
    );
  }

  // 완전히 삭제한다.
  function deleteItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Archive</h1>

      {archived.length === 0 ? (
        <EmptyState message="보관한 항목이 없어요." />
      ) : (
        <ul className="space-y-3">
          {archived.map((item) => (
            <li key={item.id}>
              <ItemCard
                item={item}
                actions={[
                  {
                    label: "브레인 덤프로 되돌리기",
                    icon: Undo2,
                    onClick: () => restoreItem(item.id),
                  },
                  {
                    label: "완전히 삭제",
                    icon: Trash2,
                    onClick: () => deleteItem(item.id),
                  },
                ]}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
