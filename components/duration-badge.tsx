import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { durationLabels, type Duration } from "@/lib/types";

// 걸리는 시간 배지.
// Quick은 초록, Focus는 노랑으로 칠하고, 색만으로 구분하지 않도록 글자를 항상 함께 보여 준다.
// 초록·노랑 색은 이 컴포넌트에서만 쓴다.
const colorClasses: Record<Duration, string> = {
  quick:
    "border-green-300 bg-green-100 text-green-900 dark:border-green-700 dark:bg-green-950 dark:text-green-200",
  focus:
    "border-yellow-300 bg-yellow-100 text-yellow-900 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-200",
};

export function DurationBadge({ duration }: { duration: Duration }) {
  return (
    <Badge variant="outline" className={cn(colorClasses[duration])}>
      {durationLabels[duration]}
    </Badge>
  );
}
