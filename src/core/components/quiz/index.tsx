type Props = {
  index: number;
  members: Member[];
};

export function Quiz({ index, members }: Props) {
  const current = members[index];
  const correctRate = (current.correct / current.total) * 100;

  return (
    <section className="gap-4 bg-primary text-secondary">
      <div>
        <div>
          {index + 1} / {members.length}
        </div>
        {isNaN(correctRate) ? null : (
          <div>정답률: {Math.floor(correctRate) + '%'}</div>
        )}
      </div>
      <div className="text-[2rem] font-medium leading-none">{current.en}</div>
    </section>
  );
}
