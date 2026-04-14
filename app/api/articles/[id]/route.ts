import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '../../../../lib/db';
import jwt from 'jsonwebtoken';

// 获取单个文章详情
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await openDb();
    const article = await db.get(`
      SELECT articles.id, articles.title, articles.content, articles.author_id, articles.created_at, users.username as author_username
      FROM articles
      LEFT JOIN users ON articles.author_id = users.id
      WHERE articles.id = ?
    `, id);
    await db.close();

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ article }, { status: 200 });
  } catch (error) {
    console.error('Error getting article:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { title, content } = await request.json();
    if (!title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { id } = await params;
    const db = await openDb();
    const article = await db.get('SELECT * FROM articles WHERE id = ?', id);
    if (!article) {
      await db.close();
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    if (article.author_id !== decoded.id && decoded.role !== 'admin') {
      await db.close();
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await db.run(
      'UPDATE articles SET title = ?, content = ? WHERE id = ?',
      title,
      content,
      id
    );
    await db.close();

    return NextResponse.json({ message: 'Article updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating article:', error);
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
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { id } = await params;
    const db = await openDb();
    const article = await db.get('SELECT * FROM articles WHERE id = ?', id);
    if (!article) {
      await db.close();
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    if (article.author_id !== decoded.id && decoded.role !== 'admin') {
      await db.close();
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await db.run('DELETE FROM articles WHERE id = ?', id);
    await db.close();

    return NextResponse.json({ message: 'Article deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
