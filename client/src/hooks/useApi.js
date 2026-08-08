import { useCallback, useEffect, useState } from "react";

/**
 * Wraps any promise-returning function with consistent loading/error/data
 * state, plus a refetch() for retry-after-error and manual refresh.
 *
 * `deps` controls when the call re-runs, same semantics as useEffect deps.
 * The apiFn itself is intentionally excluded from the effect's dependency
 * check (see eslint-disable below) — it's expected to be an inline arrow
 * function that closes over stable values already listed in deps.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useApi(() => dashboardApi.admin(), []);
 */
export function useApi(apiFn, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    apiFn()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadToken]);

  const refetch = useCallback(() => setReloadToken((t) => t + 1), []);

  return { data, error, loading, refetch };
}
