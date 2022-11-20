import { useState } from 'react';

import { analyticsService, Fb } from 'core/services';
import { shuffle } from 'shared/utils';

type GameStatus = 'before' | 'ing' | 'fail' | 'win';

export function useManager() {
  const [status, setStatus] = useState<GameStatus>('before');
  const [members, setMembers] = useState<Member[]>([]);
  const [order, setOrder] = useState(0);

  async function initialSetting() {
    const data = await Fb.getArrayData();
    shuffle(data);
    setMembers(data);
    setOrder(0);
  }

  function goHome() {
    setStatus('before');
  }

  async function start() {
    await initialSetting();
    setStatus('ing');
    analyticsService.logEvent('game_start');
  }

  async function fail() {
    setStatus('fail');
    const quiz = [...members].slice(0, order + 1);

    if (quiz.length !== 0) {
      await Fb.updateDocWhenFail(quiz);
    }
    analyticsService.logEvent('game_fail');
  }

  async function win() {
    setStatus('win');
    await Fb.udpateDocWhenWin(members);
    analyticsService.logEvent('game_win');
  }

  function next() {
    setOrder((p) => {
      if (p === members.length - 1) {
        win();
        return p;
      }
      return p + 1;
    });
  }

  return {
    data: { status, members, order },
    phase: {
      start,
      next,
      fail,
      goHome,
    },
  };
}
