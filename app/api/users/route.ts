import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '../../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 获取所有用户
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
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: admin only' }, { status: 403 });
    }

    const db = await openDb();
    const users = await db.all('SELECT id, username, role, created_at FROM users');
    await db.close();

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Error getting users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 添加用户
export async function POST(request: NextRequest) {
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
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username, password, role } = await request.json();
    if (!username || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (role === 'admin') {
      return NextResponse.json({ error: 'Cannot create admin user: system allows only one admin' }, { status: 400 });
    }

    // 检查用户名是否已存在
    const db = await openDb();
    const existingUser = await db.get('SELECT * FROM users WHERE username = ?', username);
    if (existingUser) {
      await db.close();
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    // 哈希密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 添加用户
    await db.run(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      username,
      hashedPassword,
      role
    );
    await db.close();

    return NextResponse.json({ message: 'User added successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error adding user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
