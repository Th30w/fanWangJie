import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '../../../lib/db';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header is required' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 401 });
    }

    // 验证token
    const decoded = jwt.verify(token, 'your-secret-key') as any;
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // 获取用户信息
    const db = await openDb();
    const user = await db.get('SELECT id, username, role FROM users WHERE id = ?', decoded.id);
    await db.close();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Error getting user info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
