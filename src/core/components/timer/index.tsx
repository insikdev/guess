import { useInterval } from 'core/hooks';
import { useEffect, useState } from 'react';

type Props = {
  callback: () => void;
};

export function Timer({ callback }: Props) {
  const [time, setTime] = useState(5);

  useInterval(
    () => {
      setTime((p) => p - 1);
    },
    time < 1 ? null : 1000
  );

  useEffect(() => {
    if (time < 1) {
      callback();
    }
  }, [time]);

  return (
    <section className="text-[2rem] font-semibold leading-none">
      <div>{time}</div>
    </section>
  );
}
