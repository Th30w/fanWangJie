import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '../../../../lib/db';
import jwt from 'jsonwebtoken';

// 更新投稿状态
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

    const { status } = await request.json();
    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // 检查投稿是否存在
    const db = await openDb();
    const submission = await db.get('SELECT * FROM submissions WHERE id = ?', params.id);
    if (!submission) {
      await db.close();
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // 更新投稿状态
    await db.run(
      'UPDATE submissions SET status = ? WHERE id = ?',
      status,
      params.id
    );
    await db.close();

    return NextResponse.json({ message: 'Submission status updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating submission status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 删除投稿
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

    // 检查投稿是否存在
    const db = await openDb();
    const submission = await db.get('SELECT * FROM submissions WHERE id = ?', params.id);
    if (!submission) {
      await db.close();
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // 删除投稿
    await db.run('DELETE FROM submissions WHERE id = ?', params.id);
    await db.close();

    return NextResponse.json({ message: 'Submission deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
