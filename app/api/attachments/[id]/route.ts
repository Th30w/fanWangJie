import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '../../../../lib/db';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return NextResponse.json({ error: '无效的ID' }, { status: 400 });
    }

    const db = await openDb();
    const attachment = await db.get(
      'SELECT id, story_id, filename, mimetype, data, created_at FROM story_attachments WHERE id = ?',
      id
    );
    await db.close();

    if (!attachment) {
      return NextResponse.json({ error: '附件不存在' }, { status: 404 });
    }

    return NextResponse.json({ attachment });
  } catch (error) {
    console.error('Error getting attachment:', error);
    return NextResponse.json({ error: '获取附件失败' }, { status: 500 });
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

    const { id: rawId } = await params;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return NextResponse.json({ error: '无效的ID' }, { status: 400 });
    }

    const db = await openDb();
    await db.run('DELETE FROM story_attachments WHERE id = ?', id);
    await db.close();

    return NextResponse.json({ message: '删除附件成功' });
  } catch (error) {
    console.error('Error deleting attachment:', error);
    return NextResponse.json({ error: '删除附件失败' }, { status: 500 });
  }
}
