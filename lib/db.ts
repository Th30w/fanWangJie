import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import bcrypt from 'bcryptjs';

// 打开数据库连接
export async function openDb() {
  return open({
    filename: './database.db',
    driver: sqlite3.Database
  });
}

// 初始化数据库
export async function initDb() {
  const db = await openDb();
  
  // 创建用户表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  // 创建文章表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id)
    );
  `);
  
  // 创建投稿表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  // 创建人物专栏表
  await db.exec(`
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
  `);

  // 创建附件表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS story_attachments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      story_id INTEGER NOT NULL,
      filename TEXT NOT NULL,
      mimetype TEXT NOT NULL,
      data TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
    );
  `);
  
  // 检查是否已有管理员用户
  const admin = await db.get('SELECT * FROM users WHERE username = ?', 'admin');
  if (!admin) {
    // 创建默认管理员用户，密码为 admin123
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.run(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      'admin',
      hashedPassword,
      'admin'
    );
  }
  
  await db.close();
}
