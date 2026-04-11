'use client';
import { useState } from 'react';
import { Card, Row, Col, Typography, Form, Input, Button, message } from 'antd';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

export default function Contact() {
  const [form] = Form.useForm();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });
      
      if (response.ok) {
        setSubmitted(true);
        form.resetFields();
        message.success('提交成功');
      } else {
        message.error('提交失败，请稍后再试');
      }
    } catch (error) {
      message.error('提交失败，请稍后再试');
    }
  };

  return (
    <section style={{ padding: '48px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <Title level={2} style={{ marginBottom: '32px' }}>联系投稿</Title>
        <Row gutter={32}>
          <Col xs={24} md={12}>
            <Card>
              <Title level={3} style={{ marginBottom: '24px' }}>联系我们</Title>
              <Paragraph style={{ marginBottom: '24px' }}>
                如果您或您身边的人正在经历网戒相关的问题，或者需要帮助和支持，请联系我们。
              </Paragraph>
              <Paragraph style={{ marginBottom: '24px' }}>
                我们致力于反对不科学的网戒方法，推广科学的心理健康支持，保护青少年的合法权益。
              </Paragraph>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="22,6 12,13 2,6" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>contact@anti-wangjie.com</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>400-123-4567</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>北京市海淀区中关村大街1号</span>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card>
              <Title level={3} style={{ marginBottom: '24px' }}>投稿</Title>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 16px' }}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#27ae60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="22 4 12 14.01 9 11.01" stroke="#27ae60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <Title level={4} style={{ marginBottom: '8px' }}>提交成功</Title>
                  <Paragraph>
                    感谢您的投稿，我们会尽快处理。
                  </Paragraph>
                </div>
              ) : (
                <Form form={form} onFinish={handleSubmit}>
                  <Form.Item
                    name="name"
                    label="姓名"
                    rules={[{ required: true, message: '请输入姓名' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    label="邮箱"
                    rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入有效的邮箱地址' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="content"
                    label="内容"
                    rules={[{ required: true, message: '请输入内容' }]}
                  >
                    <TextArea rows={6} />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                      提交
                    </Button>
                  </Form.Item>
                </Form>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </section>
  );
}
