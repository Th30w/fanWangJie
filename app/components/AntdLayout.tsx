"use client";

import React from 'react';
import { Layout, Menu, ConfigProvider } from 'antd';
import Link from 'next/link';
import zhCN from 'antd/locale/zh_CN';

const { Header, Content, Footer } = Layout;

export default function AntdLayout({ children }: { children: React.ReactNode }) {
  // 菜单项配置
  const menuItems = [
    { key: '/', label: <Link href="/">首页</Link> },
    { key: '/about', label: <Link href="/about">关于网戒</Link> },
    { key: '/stories', label: <Link href="/stories">真实故事</Link> },
    { key: '/resources', label: <Link href="/resources">帮助资源</Link> },
    { key: '/contact', label: <Link href="/contact">联系投稿</Link> },
  ];

  const footerMenuItems = [
    ...menuItems,
    { key: '/admin', label: <Link href="/admin">管理后台</Link> },
  ];

  return (
    <ConfigProvider locale={zhCN}>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center', padding: '0 24px' }}>
          <div className="logo" style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', marginRight: '48px' }}>
            反网戒
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['/']}
            items={menuItems}
            style={{ flex: 1, minWidth: 0, justifyContent: 'flex-end' }}
          />
        </Header>

        <Content style={{ padding: '48px 0', background: '#fff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            {children}
          </div>
        </Content>

        <Footer style={{ background: '#f5f5f5' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>反网戒</div>
            <Menu 
              mode="horizontal" 
              selectable={false} 
              items={footerMenuItems} 
              style={{ background: 'transparent', borderBottom: 'none' }}
            />
          </div>
          <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e8e8e8', color: '#888' }}>
            <p>&copy; 2026 反网戒宣传平台. 保留所有权利.</p>
          </div>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}