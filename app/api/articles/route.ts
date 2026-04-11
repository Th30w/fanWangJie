import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '../../../lib/db';
import jwt from 'jsonwebtoken';

// 获取所有文章
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

    // 获取所有文章，包括作者信息
    const db = await openDb();
    const articles = await db.all(`
      SELECT articles.id, articles.title, articles.content, articles.author_id, articles.created_at, users.username as author_username
      FROM articles
      LEFT JOIN users ON articles.author_id = users.id
      ORDER BY articles.created_at DESC
    `);
    await db.close();

    return NextResponse.json({ articles }, { status: 200 });
  } catch (error) {
    console.error('Error getting articles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 添加文章
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
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { title, content } = await request.json();
    if (!title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 添加文章
    const db = await openDb();
    await db.run(
      'INSERT INTO articles (title, content, author_id) VALUES (?, ?, ?)',
      title,
      content,
      decoded.id
    );
    await db.close();

    return NextResponse.json({ message: 'Article added successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error adding article:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
