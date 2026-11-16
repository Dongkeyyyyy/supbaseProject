"use client";

import { DurationWhenPicker } from "@/components/duration-when-picker";
import { EmptyState } from "@/components/empty-state";
import { ItemCard } from "@/components/item-card";
import { UndoBar } from "@/components/undo-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createItem,
  getItems,
  getItemsByStatus,
  isConvertedWorry,
  sortByNewest,
  updateItem,
} from "@/lib/items";
import type { Duration, Item, When } from "@/lib/types";
import { Archive, ArrowRight, Footprints, Trash2 } from "lucide-react";
import { useState } from "react";

// 걱정 화면.
// 걱정을 그대로 두거나, 행동 한 줄을 적어 "해야 할 일"로 바꿀 수 있다.
// 주의: Phase 2에서는 화면 모양 확인용이라 이 화면의 상태만 바뀌고 저장은 하지 않는다.
// 실제 저장과 화면 간 이동은 Task 005, 007에서 만든다.
export default function WorriesPage() {
  // 걱정만이 아니라 전체 항목을 들고 있어야 "행동으로 옮김"을 계산할 수 있다
  const [items, setItems] = useState<Item[]>(() => getItems());
  // "행동으로 바꾸기" 입력이 펼쳐진 걱정의 id와, 입력한 값
  const [openId, setOpenId] = useState<string | null>(null);
  const [actionText, setActionText] = useState("");
  const [duration, setDuration] = useState<Duration | undefined>();
  const [when, setWhen] = useState<When | undefined>();
  // 되돌리기 바에 보여 줄 방금 삭제한 걱정
  const [deleted, setDeleted] = useState<Item | null>(null);

  const worries = sortByNewest(getItemsByStatus(items, "worry"));

  function openActionForm(id: string) {
    setOpenId(id);
    setActionText("");
    setDuration(undefined);
    setWhen(undefined);
  }

  // 행동 한 줄로 새 "해야 할 일"을 만들고, 원래 걱정(originWorryId)을 연결한다.
  function convertToAction(worry: Item) {
    const content = actionText.trim();
    if (content === "" || !duration || !when) {
      return;
    }
    const todo = createItem({
      content,
      status: "todo",
      duration,
      when,
      originWorryId: worry.id,
    });
    setItems((current) => [todo, ...current]);
    setOpenId(null);
  }

  function archiveWorry(id: string) {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? updateItem(item, { status: "archive" }) : item,
      ),
    );
    setOpenId(null);
  }

  function deleteWorry(worry: Item) {
    setItems((current) => current.filter((item) => item.id !== worry.id));
    setDeleted(worry);
    setOpenId(null);
  }

  function undoDelete() {
    if (deleted) {
      setItems((current) => [...current, deleted]);
    }
    setDeleted(null);
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">걱정</h1>

      {worries.length === 0 ? (
        <EmptyState message="지금 내려놓은 걱정이 없어요." />
      ) : (
        <ul className="space-y-3">
          {worries.map((worry) => {
            const converted = isConvertedWorry(worry.id, items);
            const actions = [
              {
                label: "Archive",
                icon: Archive,
                onClick: () => archiveWorry(worry.id),
              },
              {
                label: "삭제",
                icon: Trash2,
                onClick: () => deleteWorry(worry),
              },
            ];
            // 아직 행동으로 바꾸지 않은 걱정에만 "행동으로 바꾸기" 버튼을 보여 준다
            if (!converted) {
              actions.unshift({
                label: "행동으로 바꾸기",
                icon: Footprints,
                onClick: () => openActionForm(worry.id),
              });
            }

            return (
              <li key={worry.id}>
                <ItemCard
                  item={worry}
                  actions={actions}
                  meta={
                    converted && (
                      <Badge variant="secondary" className="gap-1">
                        <ArrowRight className="size-3" aria-hidden="true" />
                        행동으로 옮김
                      </Badge>
                    )
                  }
                >
                  {openId === worry.id && (
                    <form
                      className="space-y-3 border-t pt-3"
                      onSubmit={(event) => {
                        event.preventDefault();
                        convertToAction(worry);
                      }}
                    >
                      <Input
                        value={actionText}
                        onChange={(event) => setActionText(event.target.value)}
                        placeholder="지금 할 수 있는 작은 행동 한 줄"
                        aria-label="행동 한 줄"
                        className="h-11"
                      />
                      <DurationWhenPicker
                        duration={duration}
                        when={when}
                        onDurationChange={setDuration}
                        onWhenChange={setWhen}
                      />
                      <Button
                        type="submit"
                        disabled={
                          actionText.trim() === "" || !duration || !when
                        }
                        className="min-h-11 w-full"
                      >
                        해야 할 일로 만들기
                      </Button>
                    </form>
                  )}
                </ItemCard>
              </li>
            );
          })}
        </ul>
      )}

      <UndoBar
        open={deleted !== null}
        restartKey={deleted?.id}
        onUndo={undoDelete}
        onClose={() => setDeleted(null)}
      />
    </section>
  );
}
