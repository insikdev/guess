type Props = {
  order: number;
  members: Member[];
};

export function Quiz({ order, members }: Props) {
  const current = members[order];
  const correctRate = (current.correct / current.total) * 100;

  return (
    <section className="gap-4 bg-primary text-secondary">
      <div>
        <div>
          {order + 1} / {members.length}
        </div>
        {isNaN(correctRate) ? null : (
          <div>정답률: {Math.floor(correctRate) + '%'}</div>
        )}
      </div>
      <div className="text-[2rem] font-medium leading-none">{current.en}</div>
    </section>
  );
}
