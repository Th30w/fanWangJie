import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '../../../../lib/db';
import jwt from 'jsonwebtoken';

// 编辑文章
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
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { title, content } = await request.json();
    if (!title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 检查文章是否存在，并且作者是否是当前用户
    const db = await openDb();
    const article = await db.get('SELECT * FROM articles WHERE id = ?', params.id);
    if (!article) {
      await db.close();
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // 只有文章作者或管理员可以编辑文章
    if (article.author_id !== decoded.id && decoded.role !== 'admin') {
      await db.close();
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 更新文章
    await db.run(
      'UPDATE articles SET title = ?, content = ? WHERE id = ?',
      title,
      content,
      params.id
    );
    await db.close();

    return NextResponse.json({ message: 'Article updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 删除文章
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
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // 检查文章是否存在，并且作者是否是当前用户
    const db = await openDb();
    const article = await db.get('SELECT * FROM articles WHERE id = ?', params.id);
    if (!article) {
      await db.close();
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // 只有文章作者或管理员可以删除文章
    if (article.author_id !== decoded.id && decoded.role !== 'admin') {
      await db.close();
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 删除文章
    await db.run('DELETE FROM articles WHERE id = ?', params.id);
    await db.close();

    return NextResponse.json({ message: 'Article deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
