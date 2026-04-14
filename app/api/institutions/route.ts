import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = await openDb();
    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    
    let institutions: any[] = [];
    let total = 0;
    
    if (search) {
      // 使用LIKE进行模糊搜索
      const searchPattern = `%${search}%`;
      institutions = await db.all(`
        SELECT * FROM institutions
        WHERE name LIKE ? OR province LIKE ? OR city LIKE ? OR key_person LIKE ? OR status LIKE ? OR system_tags LIKE ?
        LIMIT ? OFFSET ?
      `, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, limit, offset);
      
      // 获取总记录数
      const countResult = await db.get(`
        SELECT COUNT(*) as total FROM institutions
        WHERE name LIKE ? OR province LIKE ? OR city LIKE ? OR key_person LIKE ? OR status LIKE ? OR system_tags LIKE ?
      `, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
      total = countResult?.total || 0;
    } else {
      // 无搜索条件时，直接查询所有机构
      institutions = await db.all(`
        SELECT * FROM institutions
        ORDER BY id ASC
        LIMIT ? OFFSET ?
      `, limit, offset);
      
      // 获取总记录数
      const countResult = await db.get('SELECT COUNT(*) as total FROM institutions');
      total = countResult?.total || 0;
    }
    
    await db.close();
    
    return NextResponse.json({
      success: true,
      data: {
        institutions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('查询机构失败:', error);
    return NextResponse.json(
      { success: false, error: '查询机构失败' },
      { status: 500 }
    );
  }
}
