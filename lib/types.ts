// Untangle의 데이터 모델.
// 생각, 걱정, 할 일을 모두 "항목(Item)" 하나의 모델로 다룬다.
// Java의 enum + class처럼 읽으면 된다.

// 항목의 현재 상태 (어느 화면에 보이는지를 결정한다)
// 삭제는 상태가 아니다. 삭제하면 목록에서 제거한다.
export type ItemStatus =
  | "brainDump" // 브레인 덤프: 아직 분류하지 않은 항목
  | "worry" // 걱정
  | "todo" // 해야 할 일
  | "archive"; // Archive: 끝낸 일 또는 치워 둔 생각

// 걸리는 시간 (해야 할 일에만 쓴다)
export type Duration =
  | "quick" // 10분 이하, 초록색으로 표시
  | "focus"; // 30분 이상, 노란색으로 표시

// 언제 할지 (해야 할 일에만 쓴다)
export type When =
  | "today" // 오늘
  | "thisWeek" // 이번 주
  | "someday"; // 언젠가

// 항목 한 개
export type Item = {
  // 항목을 구분하는 고유 값
  id: string;

  // 사용자가 입력한 한 줄
  content: string;

  // 현재 상태
  status: ItemStatus;

  // 걸리는 시간. status가 "todo"일 때만 값이 있다.
  duration?: Duration;

  // 언제 할지. status가 "todo"일 때만 값이 있다.
  when?: When;

  // 원래 걱정의 id. 걱정을 "행동으로 바꿔서" 만든 해야 할 일에만 값이 있다.
  // 걱정 쪽에는 별도 필드를 두지 않는다. 걱정에 "행동으로 옮김"을 표시할지는
  // "이 걱정을 가리키는 해야 할 일이 있는가"로 계산한다.
  originWorryId?: string;

  // 만든 시각 (밀리초, Date.now() 값). 최신순 정렬에 쓴다.
  createdAt: number;

  // 마지막으로 바뀐 시각 (밀리초). 상태가 바뀔 때마다 갱신한다.
  updatedAt: number;
};

// 화면에 보여 줄 한국어 이름
export const statusLabels: Record<ItemStatus, string> = {
  brainDump: "브레인 덤프",
  worry: "걱정",
  todo: "해야 할 일",
  archive: "Archive",
};

export const durationLabels: Record<Duration, string> = {
  quick: "Quick",
  focus: "Focus",
};

export const whenLabels: Record<When, string> = {
  today: "오늘",
  thisWeek: "이번 주",
  someday: "언젠가",
};
