import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '../../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const db = await openDb();
    const user = await db.get('SELECT * FROM users WHERE username = ?', username);
    await db.close();
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }
    
    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }
    
    // 生成JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      'your-secret-key', // 实际使用时应该使用环境变量
      { expiresIn: '24h' }
    );
    
    return NextResponse.json({ token, user: { id: user.id, username: user.username, role: user.role } }, { status: 200 });
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
