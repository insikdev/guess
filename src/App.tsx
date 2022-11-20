import React, { useEffect, useRef } from 'react';

import { Quiz, Timer } from 'core/components';
import { useManager, useViewportHeight } from 'core/hooks';

export function App() {
  useViewportHeight();
  const answerRef = useRef<HTMLInputElement | null>(null);
  const { data, phase } = useManager();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (answerRef.current?.value === '') return;

    if (answerRef.current?.value.trim() === data.members[data.order].ko) {
      answerRef.current.value = '';
      phase.next();
    } else {
      phase.fail();
    }
  }

  useEffect(() => {
    answerRef.current?.focus();
  }, [data.order]);

  return (
    <>
      {data.status === 'before' ? (
        <main>
          <section className="mt-[5vh] text-primary">
            <div className="mb-5 text-2xl font-semibold">게임 방법</div>
            <ul className="flex flex-col gap-4 text-center">
              <li>영어 이름을 보고 한글 이름을 맞춰보세요</li>
              <li>
                <strong>5초</strong> 안에 정답을 맞추지 못하면
                <br /> 게임이 종료됩니다
              </li>
            </ul>
          </section>
          <section className="center w-full">
            <button
              className="text-[1.5rem] font-medium leading-none"
              onClick={phase.start}
            >
              게임 시작
            </button>
          </section>
        </main>
      ) : null}
      {data.status === 'ing' && data.members.length !== 0 ? (
        <main>
          <Timer key={data.order + 'timer'} callback={phase.fail} />
          <Quiz
            order={data.order}
            key={data.order + 'quiz'}
            members={data.members}
          />
          <section>
            <form onSubmit={handleSubmit} className="mx-auto flex gap-4 px-4">
              <input
                inputMode="search"
                ref={answerRef}
                type="text"
                placeholder="이름을 입력하세요."
                className="w-full rounded-md border p-4 text-center text-xl leading-none outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="w-20 bg-primary"
                onClick={handleSubmit}
              >
                제출
              </button>
            </form>
          </section>
        </main>
      ) : null}
      {data.status === 'fail' ? (
        <main className="mt-[30vh]">
          <div className="mb-10">
            <strong className="font-bold text-primary">
              {data.members[data.order].en}
            </strong>
            의 이름은..?
          </div>
          <button onClick={phase.start}>
            <div>{data.order} 문제 정답!</div>
            <div className="text-[2rem]">재도전</div>
          </button>
        </main>
      ) : null}
      {data.status === 'win' ? (
        <main className="mt-[30vh] text-primary">
          <div className="text-[3rem] leading-none">축하합니다</div>
          <div className="mt-10 cursor-pointer" onClick={phase.goHome}>
            홈으로
          </div>
        </main>
      ) : null}
    </>
  );
}
