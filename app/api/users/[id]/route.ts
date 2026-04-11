import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '../../../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 编辑用户
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
    if (!username || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await openDb();
    
    // 检查用户名是否已存在（排除当前用户）
    const existingUser = await db.get('SELECT * FROM users WHERE username = ? AND id != ?', username, params.id);
    if (existingUser) {
      await db.close();
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    // 更新用户
    if (password) {
      // 哈希密码
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.run(
        'UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?',
        username,
        hashedPassword,
        role,
        params.id
      );
    } else {
      await db.run(
        'UPDATE users SET username = ?, role = ? WHERE id = ?',
        username,
        role,
        params.id
      );
    }
    
    await db.close();

    return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 删除用户
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    // 检查是否是管理员用户
    const db = await openDb();
    const user = await db.get('SELECT role FROM users WHERE id = ?', params.id);
    if (user && user.role === 'admin') {
      await db.close();
      return NextResponse.json({ error: 'Cannot delete admin user' }, { status: 400 });
    }

    // 删除用户
    await db.run('DELETE FROM users WHERE id = ?', params.id);
    await db.close();

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
