'use client'; // 关键：声明为客户端组件
import { useEffect, useState } from 'react';
import { Layout, Menu, Table, Button, Modal, Form, Input, Typography, Space, message, Spin } from 'antd';
import Link from 'next/link';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

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

export default function Articles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<any>(null);
  const [form] = Form.useForm();

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
    // 获取所有文章
    const fetchArticles = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/articles', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setArticles(data.articles);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchArticles();
    }
  }, [user]);

  const handleAddArticle = async (values: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        setShowAddModal(false);
        form.resetFields();
        // 重新获取文章列表
        const response = await fetch('/api/articles', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setArticles(data.articles);
        }
        message.success('添加文章成功');
      } else {
        const data = await response.json();
        message.error(data.error || '添加文章失败');
      }
    } catch (error) {
      message.error('添加文章失败');
    }
  };

  const handleEditArticle = async (values: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !currentArticle) return;

      const response = await fetch(`/api/articles/${currentArticle.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        setShowEditModal(false);
        setCurrentArticle(null);
        form.resetFields();
        // 重新获取文章列表
        const response = await fetch('/api/articles', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setArticles(data.articles);
        }
        message.success('编辑文章成功');
      } else {
        const data = await response.json();
        message.error(data.error || '编辑文章失败');
      }
    } catch (error) {
      message.error('编辑文章失败');
    }
  };

  const handleDeleteArticle = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // 重新获取文章列表
        const response = await fetch('/api/articles', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setArticles(data.articles);
        }
        message.success('删除文章成功');
      } else {
        const data = await response.json();
        message.error(data.error || '删除文章失败');
      }
    } catch (error) {
      message.error('删除文章失败');
    }
  };

  const openEditModal = (article: any) => {
    setCurrentArticle(article);
    form.setFieldsValue({ title: article.title, content: article.content });
    setShowEditModal(true);
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
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '作者',
      dataIndex: 'author_username',
      key: 'author_username',
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
          <Button type="primary" onClick={() => openEditModal(record)}>编辑</Button>
          <Button danger onClick={() => handleDeleteArticle(record.id)}>删除</Button>
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
            defaultSelectedKeys={['/admin/articles']}
            style={{ height: '100%', borderRight: 0 }}
            items={getMenuItems(user?.role)}
          />
        </Sider>
        <Content style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <Title level={2} style={{ margin: 0 }}>文章管理</Title>
            <Button type="primary" onClick={() => setShowAddModal(true)}>
              添加文章
            </Button>
          </div>
          <Table columns={columns} dataSource={articles} rowKey="id" />

          {/* 添加文章模态框 */}
          <Modal
            title="添加文章"
            open={showAddModal}
            onCancel={() => {
              setShowAddModal(false);
              form.resetFields();
            }}
            footer={null}
          >
            <Form form={form} onFinish={handleAddArticle}>
              <Form.Item
                name="title"
                label="标题"
                rules={[{ required: true, message: '请输入标题' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="content"
                label="内容"
                rules={[{ required: true, message: '请输入内容' }]}
              >
                <TextArea rows={10} />
              </Form.Item>
              <Form.Item>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Button onClick={() => {
                    setShowAddModal(false);
                    form.resetFields();
                  }}>
                    取消
                  </Button>
                  <Button type="primary" htmlType="submit">
                    保存
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>

          {/* 编辑文章模态框 */}
          <Modal
            title="编辑文章"
            open={showEditModal}
            onCancel={() => {
              setShowEditModal(false);
              setCurrentArticle(null);
              form.resetFields();
            }}
            footer={null}
          >
            <Form form={form} onFinish={handleEditArticle}>
              <Form.Item
                name="title"
                label="标题"
                rules={[{ required: true, message: '请输入标题' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="content"
                label="内容"
                rules={[{ required: true, message: '请输入内容' }]}
              >
                <TextArea rows={10} />
              </Form.Item>
              <Form.Item>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Button onClick={() => {
                    setShowEditModal(false);
                    setCurrentArticle(null);
                    form.resetFields();
                  }}>
                    取消
                  </Button>
                  <Button type="primary" htmlType="submit">
                    保存
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
}
