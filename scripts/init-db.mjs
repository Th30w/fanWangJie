import { initDb } from '../lib/db.ts';

async function main() {
  try {
    await initDb();
    console.log('数据库初始化成功');
  } catch (error) {
    console.error('数据库初始化失败:', error);
  }
}

main();
