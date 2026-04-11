import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    const { name, email, content } = await request.json();
    
    if (!name || !email || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const db = await openDb();
    await db.run(
      'INSERT INTO submissions (name, email, content, status) VALUES (?, ?, ?, ?)',
      name,
      email,
      content,
      'pending'
    );
    await db.close();
    
    return NextResponse.json({ message: 'Submission successful' }, { status: 200 });
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
