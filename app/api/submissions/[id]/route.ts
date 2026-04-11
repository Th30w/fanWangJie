import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '../../../../lib/db';
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
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { status } = await request.json();
    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const { id } = await params;
    const db = await openDb();
    const submission = await db.get('SELECT * FROM submissions WHERE id = ?', id);
    if (!submission) {
      await db.close();
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    await db.run(
      'UPDATE submissions SET status = ? WHERE id = ?',
      status,
      id
    );
    await db.close();

    return NextResponse.json({ message: 'Submission status updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating submission status:', error);
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
    const submission = await db.get('SELECT * FROM submissions WHERE id = ?', id);
    if (!submission) {
      await db.close();
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    await db.run('DELETE FROM submissions WHERE id = ?', id);
    await db.close();

    return NextResponse.json({ message: 'Submission deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
