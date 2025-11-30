import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, organization, role, reason } = body;

    const { data, error } = await supabase
      .from('admin_requests')
      .insert([
        { email, organization, role_requested: role, reason }
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}