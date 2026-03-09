import { createClient } from '@/lib/supabase/server';

/**
 * Get the current authenticated admin user from Supabase session.
 * Use this in Server Components / Route Handlers.
 */
export async function getSession() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  return {
    id: user.id,
    email: user.email ?? '',
    role: user.role ?? 'authenticated',
  };
}
