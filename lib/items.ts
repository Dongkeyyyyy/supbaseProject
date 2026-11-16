import type { Item, ItemStatus } from "@/lib/types";

// 항목 데이터를 다루는 모듈.
// 지금은 더미 데이터를 돌려주고, Task 005에서 localStorage 저장소로 바꾼다.
// 화면은 반드시 getItems()로만 데이터를 읽는다. 읽는 방법을 바꿀 곳은 이 함수다.
// 다만 localStorage는 브라우저에서만 읽을 수 있어서, 각 화면의 useState(() => getItems()) 초기화도
// 함께 바꿔야 한다. (서버 렌더링 중에는 localStorage가 없다. Task 005에서 같이 정리한다)

// 화면 확인용 더미 데이터. createdAt이 클수록 최근에 만든 항목이다.
const dummyItems: Item[] = [
  // ----- 브레인 덤프 (아직 분류하지 않은 항목) -----
  {
    id: "b1",
    content: "이번 주말에 뭐 하지",
    status: "brainDump",
    createdAt: 1700000009000,
    updatedAt: 1700000009000,
  },
  {
    id: "b2",
    content: "치과 예약 전화하기",
    status: "brainDump",
    createdAt: 1700000008000,
    updatedAt: 1700000008000,
  },
  {
    id: "b3",
    content: "새로 나온 영화 보고 싶다",
    status: "brainDump",
    createdAt: 1700000007000,
    updatedAt: 1700000007000,
  },
  {
    id: "b4",
    content: "냉장고 속 재료 정리",
    status: "brainDump",
    createdAt: 1700000006000,
    updatedAt: 1700000006000,
  },

  // ----- 걱정 -----
  {
    id: "w1",
    content: "발표 준비가 부족한 것 같아서 불안하다",
    status: "worry",
    createdAt: 1700000005000,
    updatedAt: 1700000005000,
  },
  {
    id: "w2",
    content: "요즘 잠을 잘 못 자는 게 걱정이다",
    status: "worry",
    createdAt: 1700000004000,
    updatedAt: 1700000004000,
  },
  {
    id: "w3",
    content: "친구에게 보낸 메시지가 신경 쓰인다",
    status: "worry",
    createdAt: 1700000003000,
    updatedAt: 1700000003000,
  },

  // ----- 해야 할 일 -----
  {
    id: "t1",
    content: "빨래 널기",
    status: "todo",
    duration: "quick",
    when: "today",
    createdAt: 1700000020000,
    updatedAt: 1700000020000,
  },
  {
    id: "t2",
    content: "기획서 초안 쓰기",
    status: "todo",
    duration: "focus",
    when: "today",
    createdAt: 1700000019000,
    updatedAt: 1700000019000,
  },
  {
    // 걱정 w1("발표 준비가 부족한 것 같아서 불안하다")을 행동으로 바꿔 만든 할 일
    id: "t3",
    content: "발표 첫 장만 만들어 보기",
    status: "todo",
    duration: "quick",
    when: "today",
    originWorryId: "w1",
    createdAt: 1700000018000,
    updatedAt: 1700000018000,
  },
  {
    id: "t4",
    content: "택배 반품 접수하기",
    status: "todo",
    duration: "quick",
    when: "thisWeek",
    createdAt: 1700000017000,
    updatedAt: 1700000017000,
  },
  {
    id: "t5",
    content: "이력서 항목 정리하기",
    status: "todo",
    duration: "focus",
    when: "thisWeek",
    createdAt: 1700000016000,
    updatedAt: 1700000016000,
  },
  {
    id: "t6",
    content: "책상 서랍 정리",
    status: "todo",
    duration: "quick",
    when: "someday",
    createdAt: 1700000015000,
    updatedAt: 1700000015000,
  },

  // ----- Archive -----
  {
    id: "a1",
    content: "공과금 납부하기",
    status: "archive",
    createdAt: 1700000002000,
    updatedAt: 1700000030000,
  },
  {
    id: "a2",
    content: "사진 앨범 정리",
    status: "archive",
    createdAt: 1700000001000,
    updatedAt: 1700000029000,
  },
  {
    id: "a3",
    content: "예전에 적어 둔 아이디어 메모",
    status: "archive",
    createdAt: 1700000000000,
    updatedAt: 1700000028000,
  },
];

// 모든 항목을 돌려준다. (Task 005에서 localStorage 읽기로 교체한다)
export function getItems(): Item[] {
  return dummyItems;
}

// 새 항목 한 개를 만든다. id와 만든 시각은 여기서 정한다.
// (Task 005에서 저장 모듈이 생기면 id 만드는 방식도 이 함수 한 곳에서 바꾼다)
export function createItem(
  fields: Pick<Item, "content" | "status"> &
    Partial<Pick<Item, "duration" | "when" | "originWorryId">>,
): Item {
  const now = Date.now();
  return { id: `new-${now}`, createdAt: now, updatedAt: now, ...fields };
}

// 항목의 값을 바꾼 새 항목을 돌려주고, 바뀐 시각(updatedAt)을 지금으로 갱신한다.
// 상태나 시점을 바꾸는 곳에서는 항상 이 함수를 써서 updatedAt이 어긋나지 않게 한다.
export function updateItem(
  item: Item,
  changes: Partial<Omit<Item, "id" | "createdAt" | "updatedAt">>,
): Item {
  return { ...item, ...changes, updatedAt: Date.now() };
}

// 주어진 상태의 항목만 골라낸다.
export function getItemsByStatus(items: Item[], status: ItemStatus): Item[] {
  return items.filter((item) => item.status === status);
}

// 만든 시각이 최근인 항목이 먼저 오도록 정렬한 새 배열을 돌려준다.
export function sortByNewest(items: Item[]): Item[] {
  return [...items].sort((a, b) => b.createdAt - a.createdAt);
}

// 마지막으로 바뀐 시각이 최근인 항목이 먼저 오도록 정렬한 새 배열을 돌려준다.
// Archive처럼 "언제 보관했는지"가 중요한 목록에 쓴다.
export function sortByRecentlyUpdated(items: Item[]): Item[] {
  return [...items].sort((a, b) => b.updatedAt - a.updatedAt);
}

// 이 걱정이 이미 행동으로 바뀌었는지 확인한다.
// 걱정을 가리키는 해야 할 일(originWorryId)이 하나라도 있으면 "행동으로 옮김"이다.
export function isConvertedWorry(worryId: string, items: Item[]): boolean {
  return items.some((item) => item.originWorryId === worryId);
}
