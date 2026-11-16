"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

// 삭제 직후 화면 아래에 잠깐(5초) 떠 있는 "되돌리기" 안내 바.
// 앱 알림(푸시)이 아니라 화면 안에서만 보이는 안내다.
const VISIBLE_MS = 5000;

export function UndoBar({
  open,
  restartKey,
  message = "삭제했어요",
  onUndo,
  onClose,
}: {
  open: boolean; // 보일지 여부
  // 삭제한 항목이 바뀔 때마다 달라지는 값(예: 항목 id). 바뀌면 5초를 처음부터 다시 센다.
  // 안 넘기면, 바가 떠 있는 동안 또 삭제해도 처음 시작한 5초가 그대로 이어진다.
  restartKey?: string;
  message?: string;
  onUndo: () => void; // 되돌리기를 눌렀을 때
  onClose: () => void; // 시간이 지나 사라질 때
}) {
  // 부모가 onClose를 매번 새로 만들어도 타이머가 다시 시작되지 않도록 최신 값만 보관한다
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const timerId = setTimeout(() => onCloseRef.current(), VISIBLE_MS);
    return () => clearTimeout(timerId); // 닫히거나 사라질 때 타이머를 정리한다
  }, [open, restartKey]);

  if (!open) {
    return null;
  }

  return (
    // 모바일 컬럼(430px) 가운데, 하단 탭 바 바로 위에 놓는다
    <div className="pointer-events-none fixed bottom-24 left-1/2 z-20 w-full max-w-[430px] -translate-x-1/2 px-4">
      <div
        role="status"
        className="pointer-events-auto flex items-center justify-between rounded-full bg-foreground py-1 pl-5 pr-1 text-sm text-background shadow-lg"
      >
        <span>{message}</span>
        <Button
          type="button"
          variant="ghost"
          onClick={onUndo}
          className="min-h-11 rounded-full px-4 text-background hover:bg-background/20 hover:text-background"
        >
          되돌리기
        </Button>
      </div>
    </div>
  );
}
