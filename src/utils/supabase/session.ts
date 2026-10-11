import { supabase } from '../../lib/supabase';

/**
 * Keeps the Auth session alive in a Vite SPA.
 * Next.js uses middleware for this; here we refresh on tab focus
 * and pause auto-refresh while the tab is hidden.
 */
export function keepSessionRefreshed(): () => void {
  supabase.auth.startAutoRefresh();

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      supabase.auth.startAutoRefresh();
      void supabase.auth.getSession();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}
