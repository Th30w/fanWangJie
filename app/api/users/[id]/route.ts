import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '../../../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header is required' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 401 });
    }

    const decoded = jwt.verify(token, 'your-secret-key') as any;
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username, password, role } = await request.json();
    if (!username || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { id } = await params;
    const db = await openDb();

    const targetUser = await db.get('SELECT role FROM users WHERE id = ?', id);
    if (!targetUser) {
      await db.close();
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (targetUser.role === 'admin') {
      if (role !== 'admin') {
        await db.close();
        return NextResponse.json({ error: 'Cannot change admin role' }, { status: 400 });
      }

      const existingUser = await db.get('SELECT * FROM users WHERE username = ? AND id != ?', username, id);
      if (existingUser) {
        await db.close();
        return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.run(
          'UPDATE users SET username = ?, password = ? WHERE id = ?',
          username,
          hashedPassword,
          id
        );
      } else {
        await db.run(
          'UPDATE users SET username = ? WHERE id = ?',
          username,
          id
        );
      }

      await db.close();
      return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
    }

    if (role === 'admin') {
      await db.close();
      return NextResponse.json({ error: 'Cannot assign admin role: system allows only one admin' }, { status: 400 });
    }

    const existingUser = await db.get('SELECT * FROM users WHERE username = ? AND id != ?', username, id);
    if (existingUser) {
      await db.close();
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.run(
        'UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?',
        username,
        hashedPassword,
        role,
        id
      );
    } else {
      await db.run(
        'UPDATE users SET username = ?, role = ? WHERE id = ?',
        username,
        role,
        id
      );
    }

    await db.close();

    return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header is required' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 401 });
    }

    const decoded = jwt.verify(token, 'your-secret-key') as any;
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const db = await openDb();
    const user = await db.get('SELECT role FROM users WHERE id = ?', id);
    if (user && user.role === 'admin') {
      await db.close();
      return NextResponse.json({ error: 'Cannot delete admin user' }, { status: 400 });
    }

    await db.run('DELETE FROM users WHERE id = ?', id);
    await db.close();

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
