import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '../../../lib/db';
import jwt from 'jsonwebtoken';

// 获取所有投稿
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

    // 获取所有投稿
    const db = await openDb();
    const submissions = await db.all('SELECT * FROM submissions ORDER BY created_at DESC');
    await db.close();

    return NextResponse.json({ submissions }, { status: 200 });
  } catch (error) {
    console.error('Error getting submissions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
