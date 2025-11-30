import { NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabaseClient';
import bcrypt from 'bcryptjs';
import { signAdminToken } from '../../../../../lib/adminAuth';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // 1. Get user from Supabase
    const { data: user, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 2. Verify Password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 3. Generate Token
    const token = signAdminToken(user);

    // 4. Create Response with Cookie
    const response = NextResponse.json({
      success: true,
      user: {
        email: user.email,
        role: user.role,
        organization: user.organization,
        country: user.country_code,
        status: user.status
      }
    });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 8 // 8 hours
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
