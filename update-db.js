const sqlite3 = require('sqlite3').verbose();

// 打开数据库连接
const db = new sqlite3.Database('./database.db');

// 先删除旧表（如果存在）
db.exec(`DROP TABLE IF EXISTS stories;`, (err) => {
  if (err) {
    console.error('Error dropping stories table:', err);
  } else {
    console.log('Old stories table dropped');
    
    // 创建新表
    db.exec(`
      CREATE TABLE IF NOT EXISTS stories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        background TEXT NOT NULL,
        timeline TEXT NOT NULL,
        parents_violence TEXT,
        victim_demands TEXT,
        social_response TEXT,
        legal_analysis TEXT,
        psychological_impact TEXT,
        expert_opinions TEXT,
        conclusion TEXT,
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `, (err) => {
      if (err) {
        console.error('Error creating stories table:', err);
      } else {
        console.log('New stories table created successfully');
      }
      
      // 关闭数据库连接
      db.close();
    });
  }
});
