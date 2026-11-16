// 목록이 비었을 때 보여 주는 한 줄 안내. 문구는 화면마다 다르게 넘긴다.
export function EmptyState({ message }: { message: string }) {
  return (
    <p className="py-10 text-center text-sm text-muted-foreground">{message}</p>
  );
}
