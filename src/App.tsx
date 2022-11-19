import { Quiz, Timer } from 'core/components';
import { useViewportHeight } from 'core/hooks';
import React, { useEffect, useRef, useState } from 'react';

import { shuffle } from 'shared/utils';
import { getAnalytics, logEvent } from 'firebase/analytics';

import { Fb } from 'core/services';
export function App() {
  const [members, setMembers] = useState<Member[]>([]);
  useViewportHeight();

  useEffect(() => {
    (async function () {
      const initialData = await Fb.getArrayData();
      setMembers(initialData);
    })();
  }, []);

  const answerRef = useRef<HTMLInputElement | null>(null);
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<'before' | 'ing' | 'fail' | 'win'>(
    'win'
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (answerRef.current?.value === '') return;

    if (answerRef.current?.value === members[index].ko) {
      answerRef.current.value = '';
      setIndex((p) => {
        if (p === members.length - 1) {
          gameWin();
          return p;
        }
        return p + 1;
      });
    } else {
      gameFail();
    }
  }

  function gameStart() {
    shuffle(members);
    setIndex(0);
    setStatus('ing');
    logEvent(getAnalytics(), 'game_start');
  }

  async function gameFail() {
    setStatus('fail');
    const quiz = [...members].slice(0, index + 1);

    if (quiz.length !== 0) {
      await Fb.updateDocWhenFail(quiz);
    }
    logEvent(getAnalytics(), 'game_fail');
  }

  async function gameWin() {
    setStatus('win');
    await Fb.udpateDocWhenWin(members);
    logEvent(getAnalytics(), 'game_win');
  }

  return (
    <>
      {status === 'before' ? (
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
              onClick={gameStart}
            >
              게임 시작
            </button>
          </section>
        </main>
      ) : null}
      {status === 'ing' ? (
        <main>
          <Timer key={index + 'timer'} callback={gameFail} />
          <Quiz index={index} key={index + 'quiz'} members={members} />
          <section>
            <form onSubmit={handleSubmit} className="mx-auto w-4/5">
              <input
                inputMode="search"
                ref={answerRef}
                type="text"
                placeholder="이름을 입력하세요."
                className="w-full rounded-md border p-4 text-center text-xl leading-none outline-none"
                autoFocus
              />
            </form>
          </section>
        </main>
      ) : null}
      {status === 'fail' ? (
        <main className="mt-[30vh]">
          <div className="mb-10">
            <strong className="font-bold text-primary">
              {members[index].en}
            </strong>
            의 이름은..?
          </div>
          <button onClick={gameStart}>
            <div>{index} 문제 정답!</div>
            <div className="text-[2rem]">재도전</div>
          </button>
        </main>
      ) : null}
      {status === 'win' ? (
        <main className="center text-[3rem]">축하합니다</main>
      ) : null}
    </>
  );
}
