'use client'; // 关键：声明为客户端组件
import { useEffect, useState } from 'react';
import { Layout, Menu, Card, Button, Typography, Row, Col, Spin } from 'antd';
import Link from 'next/link';

const { Header, Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;

const getMenuItems = (role: string) => {
  const items = [
    {
      key: '/admin/dashboard',
      label: <Link href="/admin/dashboard">仪表盘</Link>,
    },
    {
      key: '/admin/users',
      label: <Link href="/admin/users">用户管理</Link>,
      adminOnly: true,
    },
    {
      key: '/admin/articles',
      label: <Link href="/admin/articles">文章管理</Link>,
    },
    {
      key: '/admin/submissions',
      label: <Link href="/admin/submissions">投稿管理</Link>,
    },
    {
      key: '/admin/stories',
      label: <Link href="/admin/stories">人物专栏管理</Link>,
    },
  ];
  return items.filter(item => !(item as any).adminOnly || role === 'admin');
};

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查用户是否已登录
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/admin';
      return;
    }

    // 验证token并获取用户信息
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          localStorage.removeItem('token');
          window.location.href = '/admin';
        }
      } catch (error) {
        localStorage.removeItem('token');
        window.location.href = '/admin';
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/admin';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Title level={3} style={{ margin: 0, color: '#1890ff' }}>管理后台</Title>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Text>欢迎，{user.username}</Text>
          <Button type="primary" danger onClick={handleLogout}>
            退出登录
          </Button>
        </div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['/admin/dashboard']}
            style={{ height: '100%', borderRight: 0 }}
            items={getMenuItems(user?.role)}
          />
        </Sider>
        <Content style={{ padding: '32px' }}>
          <Row gutter={16} style={{ marginBottom: '24px' }}>
            {user.role === 'admin' && (
              <Col xs={24} md={8}>
                <Card>
                  <Title level={4} style={{ marginBottom: '16px' }}>用户管理</Title>
                  <Paragraph style={{ marginBottom: '24px' }}>
                    管理系统用户，包括添加、编辑和删除用户
                  </Paragraph>
                  <Button>
                    <Link href="/admin/users">查看用户</Link>
                  </Button>
                </Card>
              </Col>
            )}
            <Col xs={24} md={8}>
              <Card>
                <Title level={4} style={{ marginBottom: '16px' }}>文章管理</Title>
                <Paragraph style={{ marginBottom: '24px' }}>
                  管理网站文章，包括发布、编辑和删除文章
                </Paragraph>
                <Button>
                  <Link href="/admin/articles">查看文章</Link>
                </Button>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Title level={4} style={{ marginBottom: '16px' }}>投稿管理</Title>
                <Paragraph style={{ marginBottom: '24px' }}>
                  管理用户投稿，包括查看、审核和处理投稿
                </Paragraph>
                <Button>
                  <Link href="/admin/submissions">查看投稿</Link>
                </Button>
              </Card>
            </Col>
          </Row>
          <Card>
            <Title level={3} style={{ marginBottom: '24px' }}>系统信息</Title>
            <Row gutter={32}>
              <Col xs={24} md={12}>
                <Title level={4} style={{ marginBottom: '16px' }}>用户信息</Title>
                <p><strong>用户名:</strong> {user.username}</p>
                <p><strong>角色:</strong> {user.role}</p>
              </Col>
              <Col xs={24} md={12}>
                <Title level={4} style={{ marginBottom: '16px' }}>系统状态</Title>
                <p><strong>数据库:</strong> SQLite</p>
                <p><strong>版本:</strong> 1.0.0</p>
              </Col>
            </Row>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}
