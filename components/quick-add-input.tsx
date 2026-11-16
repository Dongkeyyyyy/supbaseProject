"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";

// 항상 보이는 한 줄 입력창.
// Enter(또는 추가 버튼)로 추가하고, 추가한 뒤에도 입력창은 비워진 채 그대로 남아
// 바로 다음 생각을 이어서 쓸 수 있다. 우선순위·날짜·태그는 묻지 않는다.
export function QuickAddInput({
  onAdd,
  placeholder = "생각나는 걸 한 줄로 적어요",
}: {
  onAdd: (content: string) => void; // 추가할 한 줄(앞뒤 공백 제거됨)
  placeholder?: string;
}) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // 페이지가 새로고침되지 않게 막는다
    const trimmed = text.trim();
    if (trimmed === "") {
      return; // 공백만 입력한 경우는 무시한다
    }
    onAdd(trimmed);
    setText("");
    inputRef.current?.focus(); // 버튼으로 추가해도 포커스를 입력창에 유지한다
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        ref={inputRef}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder}
        aria-label="한 줄 입력"
        className="h-11"
      />
      <Button type="submit" className="h-11 shrink-0 px-4">
        <Plus aria-hidden="true" />
        추가
      </Button>
    </form>
  );
}
