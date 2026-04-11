'use client'; // 关键：声明为客户端组件
import { useEffect, useState } from 'react';
import { Layout, Menu, Table, Button, Modal, Typography, Space, message, Tag, Spin } from 'antd';
import Link from 'next/link';

const { Header, Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;

const menuItems = [
  {
    key: '/admin/dashboard',
    label: <Link href="/admin/dashboard">仪表盘</Link>,
  },
  {
    key: '/admin/users',
    label: <Link href="/admin/users">用户管理</Link>,
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

export default function Submissions() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

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
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    // 获取所有投稿
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/submissions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setSubmissions(data.submissions);
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSubmissions();
    }
  }, [user]);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/submissions/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        // 重新获取投稿列表
        const response = await fetch('/api/submissions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setSubmissions(data.submissions);
        }
        message.success('更新状态成功');
      } else {
        const data = await response.json();
        message.error(data.error || '更新状态失败');
      }
    } catch (error) {
      message.error('更新状态失败');
    }
  };

  const handleDeleteSubmission = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/submissions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // 重新获取投稿列表
        const response = await fetch('/api/submissions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setSubmissions(data.submissions);
        }
        message.success('删除投稿成功');
      } else {
        const data = await response.json();
        message.error(data.error || '删除投稿失败');
      }
    } catch (error) {
      message.error('删除投稿失败');
    }
  };

  const openDetailModal = (submission: any) => {
    setSelectedSubmission(submission);
    setShowDetailModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/admin';
  };



  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="primary" onClick={() => openDetailModal(record)}>查看</Button>
          <Button danger onClick={() => handleDeleteSubmission(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

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
            defaultSelectedKeys={['/admin/submissions']}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
        </Sider>
        <Content style={{ padding: '32px' }}>
          <Title level={2} style={{ marginBottom: '24px' }}>投稿管理</Title>
          <Table columns={columns} dataSource={submissions} rowKey="id" />

          {/* 投稿详情模态框 */}
          <Modal
            title="投稿详情"
            open={showDetailModal}
            onCancel={() => {
              setShowDetailModal(false);
              setSelectedSubmission(null);
            }}
            footer={[
              <Button key="close" onClick={() => {
                setShowDetailModal(false);
                setSelectedSubmission(null);
              }}>
                关闭
              </Button>
            ]}
          >
            {selectedSubmission && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <Text strong>姓名：</Text>
                <span>{selectedSubmission.name}</span>
              </div>
              <div>
                <Text strong>邮箱：</Text>
                <span>{selectedSubmission.email}</span>
              </div>
              <div>
                <Text strong>创建时间：</Text>
                <span>{new Date(selectedSubmission.created_at).toLocaleString()}</span>
              </div>
              <div>
                <Text strong>内容：</Text>
                <Paragraph>{selectedSubmission.content}</Paragraph>
              </div>
            </div>
          )}
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
}
