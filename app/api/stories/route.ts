import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '../../../lib/db';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const db = await openDb();
    const stories = await db.all('SELECT id, name, background, timeline, parents_violence, victim_demands, social_response, legal_analysis, psychological_impact, expert_opinions, conclusion, image, created_at FROM stories ORDER BY created_at DESC');
    
    // 解析timeline字段
    const parsedStories = stories.map((story: any) => ({
      ...story,
      timeline: JSON.parse(story.timeline)
    }));
    
    await db.close();
    return NextResponse.json({ stories: parsedStories });
  } catch (error) {
    console.error('Error getting stories:', error);
    return NextResponse.json({ error: '获取人物专栏失败' }, { status: 500 });
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

    // 验证token
    const decoded = jwt.verify(token, 'your-secret-key') as any;
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    }

    const db = await openDb();
    const result = await db.run(
      'INSERT INTO stories (name, background, timeline, parents_violence, victim_demands, social_response, legal_analysis, psychological_impact, expert_opinions, conclusion, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
      imageBase64
    );
    
    const story = await db.get('SELECT id, name, background, timeline, image, created_at FROM stories WHERE id = ?', result.lastID);
    await db.close();

    return NextResponse.json({ story: { ...story, timeline: JSON.parse(story.timeline) } });
  } catch (error) {
    console.error('Error creating story:', error);
    return NextResponse.json({ error: '创建人物专栏失败' }, { status: 500 });
  }
}
