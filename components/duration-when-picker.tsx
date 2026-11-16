"use client";

import { Button } from "@/components/ui/button";
import {
  durationLabels,
  whenLabels,
  type Duration,
  type When,
} from "@/lib/types";

// 걸리는 시간(Quick / Focus)과 언제(오늘 / 이번 주 / 언젠가)를 고르는 UI.
// 고른 값은 부모가 들고 있고(value), 바뀔 때마다 알려 준다(onChange).
const durations: Duration[] = ["quick", "focus"];
const whens: When[] = ["today", "thisWeek", "someday"];

export function DurationWhenPicker({
  duration,
  when,
  onDurationChange,
  onWhenChange,
}: {
  duration?: Duration; // 현재 고른 걸리는 시간 (아직 안 골랐으면 없음)
  when?: When; // 현재 고른 시점 (아직 안 골랐으면 없음)
  onDurationChange: (duration: Duration) => void;
  onWhenChange: (when: When) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <p className="mb-1 text-xs text-muted-foreground">걸리는 시간</p>
        <div className="grid grid-cols-2 gap-2">
          {durations.map((value) => (
            <Button
              key={value}
              type="button"
              variant={duration === value ? "default" : "outline"}
              aria-pressed={duration === value}
              onClick={() => onDurationChange(value)}
              className="min-h-11"
            >
              {durationLabels[value]}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1 text-xs text-muted-foreground">언제</p>
        <div className="grid grid-cols-3 gap-2">
          {whens.map((value) => (
            <Button
              key={value}
              type="button"
              variant={when === value ? "default" : "outline"}
              aria-pressed={when === value}
              onClick={() => onWhenChange(value)}
              className="min-h-11"
            >
              {whenLabels[value]}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
