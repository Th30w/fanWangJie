'use client'; // 关键：声明为客户端组件
import { useEffect, useState } from 'react';
import { Layout, Menu, Table, Button, Modal, Form, Input, Select, Typography, Space, message, Spin } from 'antd';
import Link from 'next/link';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

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

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
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
    // 获取所有用户
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user]);

  const handleAddUser = async (values: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/users', {
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
        // 重新获取用户列表
        const response = await fetch('/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
        }
        message.success('添加用户成功');
      } else {
        const data = await response.json();
        message.error(data.error || '添加用户失败');
      }
    } catch (error) {
      message.error('添加用户失败');
    }
  };

  const handleEditUser = async (values: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !currentUser) return;

      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        setShowEditModal(false);
        setCurrentUser(null);
        form.resetFields();
        // 重新获取用户列表
        const response = await fetch('/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
        }
        message.success('编辑用户成功');
      } else {
        const data = await response.json();
        message.error(data.error || '编辑用户失败');
      }
    } catch (error) {
      message.error('编辑用户失败');
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // 重新获取用户列表
        const response = await fetch('/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
        }
        message.success('删除用户成功');
      } else {
        const data = await response.json();
        message.error(data.error || '删除用户失败');
      }
    } catch (error) {
      message.error('删除用户失败');
    }
  };

  const openEditModal = (user: any) => {
    setCurrentUser(user);
    form.setFieldsValue({ username: user.username, password: '', role: user.role });
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
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="primary" onClick={() => openEditModal(record)}>编辑</Button>
          {record.role !== 'admin' && (
            <Button danger onClick={() => handleDeleteUser(record.id)}>删除</Button>
          )}
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
            defaultSelectedKeys={['/admin/users']}
            style={{ height: '100%', borderRight: 0 }}
            items={getMenuItems(user?.role)}
          />
        </Sider>
        <Content style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <Title level={2} style={{ margin: 0 }}>用户管理</Title>
            {user.role === 'admin' && (
              <Button type="primary" onClick={() => setShowAddModal(true)}>
                添加用户
              </Button>
            )}
          </div>
          <Table columns={columns} dataSource={users} rowKey="id" />

          {/* 添加用户模态框 */}
          <Modal
            title="添加用户"
            open={showAddModal}
            onCancel={() => {
              setShowAddModal(false);
              form.resetFields();
            }}
            footer={null}
          >
            <Form form={form} onFinish={handleAddUser}>
              <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="role"
                label="角色"
                rules={[{ required: true, message: '请选择角色' }]}
              >
                <Select disabled={currentUser?.role === 'admin'}>
                  <Select.Option value="user">用户</Select.Option>
                  {currentUser?.role === 'admin' && (
                    <Select.Option value="admin">管理员</Select.Option>
                  )}
                </Select>
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

          {/* 编辑用户模态框 */}
          <Modal
            title="编辑用户"
            open={showEditModal}
            onCancel={() => {
              setShowEditModal(false);
              setCurrentUser(null);
              form.resetFields();
            }}
            footer={null}
          >
            <Form form={form} onFinish={handleEditUser}>
              <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="密码 (留空不修改)"
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="role"
                label="角色"
                rules={[{ required: true, message: '请选择角色' }]}
              >
                <Select>
                  <Select.Option value="user">用户</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Button onClick={() => {
                    setShowEditModal(false);
                    setCurrentUser(null);
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
