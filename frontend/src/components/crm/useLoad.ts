import type { DependencyList, Dispatch, SetStateAction } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { errorMessage } from '@/components/admin/ui';
import { t } from '@/lib/i18n';

/**
 * Loads data when deps change and ignores responses that arrive after the
 * inputs changed again. `setData` allows optimistic edits; `reload` refetches.
 */
export function useLoad<T>(fn: () => Promise<T>, deps: DependencyList): {
  data: T | null; error: string | null; reload: () => void; setData: Dispatch<SetStateAction<T | null>>;
} {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let alive = true;
    fn().then(
      (d) => { if (alive) { setData(d); setError(null); } },
      (err) => { if (alive) setError(errorMessage(err, t('crm.loadFailed', 'Could not load data.'))); },
    );
    return () => { alive = false; };
    // fn is recreated every render; deps describe its inputs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const reload = useCallback(() => setTick((n) => n + 1), []);
  return { data, error, reload, setData };
}
