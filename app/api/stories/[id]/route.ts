import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '../../../../lib/db';
import jwt from 'jsonwebtoken';

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // const id = parseInt(params.id);
    const { id: rawId } = await params; 
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return NextResponse.json({ error: '无效的ID' }, { status: 400 });
    }

    const db = await openDb();
    const story = await db.get('SELECT id, name, background, timeline, parents_violence, victim_demands, social_response, legal_analysis, psychological_impact, expert_opinions, conclusion, image, created_at FROM stories WHERE id = ?', id);
    await db.close();

    if (!story) {
      return NextResponse.json({ error: '人物专栏不存在' }, { status: 404 });
    }

    return NextResponse.json({ story: { ...story, timeline: JSON.parse(story.timeline) } });
  } catch (error) {
    console.error('Error fetching story:', error);
    return NextResponse.json({ error: '获取人物专栏失败' }, { status: 500 });
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
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: rawId } = await params;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return NextResponse.json({ error: '无效的ID' }, { status: 400 });
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const background = formData.get('background') as string;
    const timeline = JSON.parse(formData.get('timeline') as string);
    const parents_violence = formData.get('parents_violence') as string;
    const victim_demands = formData.get('victim_demands') as string;
    const social_response = formData.get('social_response') as string;
    const legal_analysis = formData.get('legal_analysis') as string;
    const psychological_impact = formData.get('psychological_impact') as string;
    const expert_opinions = formData.get('expert_opinions') as string;
    const conclusion = formData.get('conclusion') as string;
    const image = formData.get('image') as File | null;

    if (!name || !background || !timeline) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    let imageBase64 = '';
    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mimeType = image.type || 'image/jpeg';
      imageBase64 = `data:${mimeType};base64,${buffer.toString('base64')}`;
    } else {
      const db = await openDb();
      const existing = await db.get('SELECT image FROM stories WHERE id = ?', id);
      await db.close();
      imageBase64 = existing?.image || '';
    }

    const db = await openDb();
    await db.run(
      'UPDATE stories SET name = ?, background = ?, timeline = ?, parents_violence = ?, victim_demands = ?, social_response = ?, legal_analysis = ?, psychological_impact = ?, expert_opinions = ?, conclusion = ?, image = ? WHERE id = ?',
      name,
      background,
      JSON.stringify(timeline),
      parents_violence,
      victim_demands,
      social_response,
      legal_analysis,
      psychological_impact,
      expert_opinions,
      conclusion,
      imageBase64,
      id
    );
    
    const story = await db.get('SELECT id, name, background, timeline, parents_violence, victim_demands, social_response, legal_analysis, psychological_impact, expert_opinions, conclusion, image, created_at FROM stories WHERE id = ?', id);
    await db.close();

    return NextResponse.json({ story: { ...story, timeline: JSON.parse(story.timeline) } });
  } catch (error) {
    console.error('Error updating story:', error);
    return NextResponse.json({ error: '更新人物专栏失败' }, { status: 500 });
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
    await db.run('DELETE FROM stories WHERE id = ?', id);
    await db.close();

    return NextResponse.json({ message: '删除人物专栏成功' });
  } catch (error) {
    console.error('Error deleting story:', error);
    return NextResponse.json({ error: '删除人物专栏失败' }, { status: 500 });
  }
}
