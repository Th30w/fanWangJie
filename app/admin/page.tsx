'use client';
import { useState } from 'react';
import { Card, Typography, Form, Input, Button, message } from 'antd';

const { Title } = Typography;

export default function AdminLogin() {
  const [form] = Form.useForm();
  const [error, setError] = useState('');

  const handleSubmit = async (values: any) => {
    setError('');
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        window.location.href = '/admin/dashboard';
      } else {
        const data = await response.json();
        setError(data.error || '登录失败，请检查用户名和密码');
        message.error(data.error || '登录失败，请检查用户名和密码');
      }
    } catch (error) {
      setError('登录失败，请稍后再试');
      message.error('登录失败，请稍后再试');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' }}>
      <Card style={{ width: '100%', maxWidth: '400px', padding: '32px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>管理后台登录</Title>
        {error && (
          <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#fff2f0', color: '#ff4d4f', borderRadius: '4px' }}>
            {error}
          </div>
        )}
        <Form form={form} onFinish={handleSubmit}>
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
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
