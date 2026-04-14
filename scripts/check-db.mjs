import { openDb } from '../lib/db.ts';

async function checkDatabase() {
  try {
    const db = await openDb();
    
    // 检查表是否存在
    const tables = await db.all(`
      SELECT name FROM sqlite_master WHERE type='table' OR type='virtual table'
    `);
    
    console.log('数据库中的表:');
    tables.forEach(table => console.log(`- ${table.name}`));
    
    // 检查虚拟表结构
    const ftsInfo = await db.all(`
      PRAGMA table_info(institutions_fts)
    `);
    
    console.log('\n虚拟表 institutions_fts 结构:');
    ftsInfo.forEach(col => console.log(`- ${col.name} (${col.type})`));
    
    // 检查机构表数据
    const count = await db.get(`SELECT COUNT(*) as total FROM institutions`);
    console.log(`\n机构表数据量: ${count.total}`);
    
    await db.close();
    
  } catch (error) {
    console.error('检查数据库失败:', error);
  }
}

checkDatabase();
