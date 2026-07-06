import { useCallback, useEffect, useState } from 'react';

/**
 * Minimalistisches Routing über den URL-Hash (#/topic-id). Kein Router-Paket
 * nötig — hält die App leicht und teilbar (Links funktionieren, Back-Button auch).
 */
export function useHashRoute() {
  const read = () => decodeURIComponent(window.location.hash.replace(/^#\/?/, ''));
  const [route, setRoute] = useState<string>(read);

  useEffect(() => {
    const onChange = () => setRoute(read());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((id: string) => {
    window.location.hash = `#/${id}`;
    // scroll nach oben beim Themenwechsel
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return [route, navigate] as const;
}
