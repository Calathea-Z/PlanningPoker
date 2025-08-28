import { useEffect, useState } from 'react';

/**
 * useCountdown hook
 * @param startAt number of seconds to start at (or null to idle)
 * @returns [countdown, start, reset]
 *  - countdown: current number (null if not running)
 *  - start: function to start countdown from a given number
 *  - reset: function to stop/reset countdown
 */
export function useCountdown(startAt: number | null = null) {
  const [countdown, setCountdown] = useState<number | null>(startAt);

  useEffect(() => {
    if (countdown === null || countdown <= 0) return;

    const id = setInterval(() => {
      setCountdown(prev =>
        prev && prev > 1 ? prev - 1 : null
      );
    }, 1000);

    return () => clearInterval(id);
  }, [countdown]);

  const start = (n: number) => setCountdown(n);
  const reset = () => setCountdown(null);

  return [countdown, start, reset] as const;
}
