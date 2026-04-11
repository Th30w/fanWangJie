import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import AntdLayout from './components/AntdLayout'; // 确保路径正确
import './globals.css'; // 如果你有全局样式

export const metadata: Metadata = {
  title: '反网戒 - 反对网络成瘾戒治宣传平台',
  description: '网络成瘾不是疾病，而是需要理解和支持的心理问题',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body style={{ margin: 0 }}>
        <AntdRegistry>
          <AntdLayout>{children}</AntdLayout>
        </AntdRegistry>
      </body>
    </html>
  );
}