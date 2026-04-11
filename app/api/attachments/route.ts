import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '../../../lib/db';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storyId = searchParams.get('story_id');

    if (!storyId) {
      return NextResponse.json({ error: '缺少story_id参数' }, { status: 400 });
    }

    const db = await openDb();
    const attachments = await db.all(
      'SELECT id, story_id, filename, mimetype, created_at FROM story_attachments WHERE story_id = ? ORDER BY created_at DESC',
      parseInt(storyId)
    );
    await db.close();

    return NextResponse.json({ attachments });
  } catch (error) {
    console.error('Error getting attachments:', error);
    return NextResponse.json({ error: '获取附件失败' }, { status: 500 });
  }
}

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

    const decoded = jwt.verify(token, 'your-secret-key') as any;
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const storyId = formData.get('story_id') as string;
    const files = formData.getAll('files') as File[];

    if (!storyId || !files || files.length === 0) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    const db = await openDb();
    const attachments = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Data = buffer.toString('base64');
      const data = `data:${file.type || 'application/octet-stream'};base64,${base64Data}`;

      const result = await db.run(
        'INSERT INTO story_attachments (story_id, filename, mimetype, data) VALUES (?, ?, ?, ?)',
        parseInt(storyId),
        file.name,
        file.type || 'application/octet-stream',
        data
      );

      attachments.push({
        id: result.lastID,
        story_id: parseInt(storyId),
        filename: file.name,
        mimetype: file.type || 'application/octet-stream',
      });
    }

    await db.close();

    return NextResponse.json({ attachments });
  } catch (error) {
    console.error('Error uploading attachments:', error);
    return NextResponse.json({ error: '上传附件失败' }, { status: 500 });
  }
}
