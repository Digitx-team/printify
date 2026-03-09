import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// TEMPORARY route — delete after creating the admin user!
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY not set in .env.local. Get it from Supabase Dashboard → Settings → API → service_role key' },
      { status: 500 }
    );
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Delete old broken user if exists
  const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
  const existingAdmin = existingUsers?.users?.find(u => u.email === 'admin@printify.dz');
  if (existingAdmin) {
    await supabaseAdmin.auth.admin.deleteUser(existingAdmin.id);
  }

  // Create admin user properly via Supabase Admin API
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: 'admin@printify.dz',
    password: 'printify@2026!',
    email_confirm: true,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'Admin user created! Now DELETE this file: src/app/api/setup-admin/route.ts',
    user: { id: data.user.id, email: data.user.email },
  });
}
