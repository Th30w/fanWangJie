import fs from 'fs';
import readline from 'readline';
import { openDb } from '../lib/db.ts';

async function importInstitutions() {
  try {
    console.log('开始导入机构数据...');
    
    // 打开数据库连接
    const db = await openDb();
    
    // 清空现有数据（如果需要）
    await db.run('DELETE FROM institutions');
    console.log('已清空现有机构数据');
    
    const csvPath = './机构列表utf8.csv';
    
    // 检查文件是否存在
    if (!fs.existsSync(csvPath)) {
      console.error('CSV文件不存在:', csvPath);
      await db.close();
      return;
    }
    
    // 使用readline逐行读取，避免一次性加载全部数据
    const fileStream = fs.createReadStream(csvPath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    
    let count = 0;
    let isFirstLine = true;
    
    for await (const line of rl) {
      if (isFirstLine) {
        isFirstLine = false;
        continue; // 跳过标题行
      }
      
      try {
        // 简单解析CSV行
        const parts = line.split(',');
        let name = parts[0] || '';
        let province = parts[1] || '';
        let city = parts[2] || '';
        let keyPerson = parts[3] || '';
        let status = parts[4] || '';
        let systemTags = parts[5] || '';
        
        // 处理包含逗号的字段（简单处理，实际CSV解析可能更复杂）
        if (name.startsWith('"')) {
          // 找到匹配的引号
          let endQuote = line.indexOf('"', 1);
          if (endQuote !== -1) {
            name = line.substring(1, endQuote);
            const remaining = line.substring(endQuote + 1).split(',');
            province = remaining[1] || '';
            city = remaining[2] || '';
            keyPerson = remaining[3] || '';
            status = remaining[4] || '';
            systemTags = remaining[5] || '';
          }
        }
        
        await db.run(
          'INSERT INTO institutions (name, province, city, key_person, status, system_tags) VALUES (?, ?, ?, ?, ?, ?)',
          name.trim(),
          province.trim(),
          city.trim(),
          keyPerson.trim(),
          status.trim(),
          systemTags.trim()
        );
        
        count++;
        if (count % 100 === 0) {
          console.log(`已导入 ${count} 条数据`);
        }
        
      } catch (error) {
        console.error('处理行失败:', line, error);
        continue;
      }
    }
    
    console.log(`成功导入 ${count} 条机构数据`);
    
    // 手动更新FTS虚拟表
    await db.run('INSERT INTO institutions_fts(institutions_fts) VALUES(rebuild)');
    console.log('已更新全文搜索索引');
    
    // 关闭数据库连接
    await db.close();
    console.log('导入完成！');
    
  } catch (error) {
    console.error('导入过程中发生错误:', error);
  }
}

// 运行导入
importInstitutions();
