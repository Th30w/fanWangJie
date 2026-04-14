"use client"; // 关键：声明为客户端组件
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Row, Col, Card, Button, Typography, Space, Spin } from 'antd';
import Link from 'next/link';

const { Title, Paragraph, Text } = Typography;

interface Story {
  id: number;
  name: string;
  background: string;
  image: string;
}

export default function Home() {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestStory = async () => {
      try {
        const response = await fetch('/api/stories');
        if (response.ok) {
          const data = await response.json();
          if (data.stories && data.stories.length > 0) {
            // 获取最新的故事（按ID降序）
            const latestStory = data.stories.sort((a: Story, b: Story) => b.id - a.id)[0];
            setStory(latestStory);
          }
        }
      } catch (error) {
        console.error('获取故事失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestStory();
  }, []);

  return (
    <div>
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <Title level={1} style={{ marginBottom: '24px' }}>反对网络成瘾戒治<br />守护青少年心理健康</Title>
        <Paragraph style={{ fontSize: '18px', maxWidth: '800px', margin: '0 auto 32px' }}>
          网络成瘾不是疾病，而是需要理解和支持的心理问题
        </Paragraph>
        <Button type="primary" size="large">
          <Link href="/about" style={{ color: '#fff' }}>了解更多</Link>
        </Button>
      </div>

      <section style={{ padding: '48px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <Title level={2} style={{ marginBottom: '32px' }}>关于网戒</Title>
          <Row gutter={32} align="middle">
            <Col xs={24} md={12}>
              <Paragraph style={{ marginBottom: '16px' }}>
                网络成瘾戒治（简称网戒）是指通过各种手段，包括但不限于限制上网时间、强制隔离、心理治疗等方式，帮助所谓的“网络成瘾者”戒除网络依赖的行为。
              </Paragraph>
              <Paragraph style={{ marginBottom: '16px' }}>
                然而，许多所谓的“网戒中心”采用的方法往往极端且不科学，包括：
              </Paragraph>
              <ul style={{ marginBottom: '16px', paddingLeft: '24px' }}>
                <li>强制隔离与封闭管理</li>
                <li>身体惩罚与精神虐待</li>
                <li>洗脑式的思想控制</li>
                <li>忽视个体差异的统一治疗方案</li>
              </ul>
              <Paragraph>
                这些方法不仅不能有效解决问题，反而会对青少年的心理健康造成严重伤害，甚至导致悲剧发生。
              </Paragraph>
            </Col>
            <Col xs={24} md={12}>
              <Image 
                src="/index.png" 
                alt="青少年合理使用网络" 
                width={600} 
                height={400} 
                style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', width: '100%', height: 'auto' }}
              />
            </Col>
          </Row>
        </div>
      </section>

      <section style={{ padding: '48px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <Title level={2} style={{ marginBottom: '32px' }}>真实故事</Title>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
              <Spin size="large" />
            </div>
          ) : story ? (
            <Card style={{ padding: '32px' }}>
              <Row gutter={32} align="middle">
                <Col xs={24} md={12}>
                  <Title level={3} style={{ marginBottom: '16px' }}>{story.name}的经历</Title>
                  <Paragraph style={{ marginBottom: '16px' }}>
                    {story.background.length > 200 ? `${story.background.substring(0, 200)}...` : story.background}
                  </Paragraph>
                  <Button>
                    <Link href={`/stories?id=${story.id}`}>查看完整故事</Link>
                  </Button>
                </Col>
                <Col xs={24} md={12}>
                  {story.image ? (
                    <Image 
                      src={story.image} 
                      alt={`${story.name}的故事`} 
                      width={400} 
                      height={500} 
                      style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', width: '100%', height: 'auto' }}
                    />
                  ) : (
                    <Image 
                      src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20person%20looking%20thoughtful%20in%20a%20room&image_size=portrait_4_3" 
                      alt={`${story.name}的故事`} 
                      width={400} 
                      height={500} 
                      style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', width: '100%', height: 'auto' }}
                    />
                  )}
                </Col>
              </Row>
            </Card>
          ) : (
            <Card style={{ padding: '64px 0', textAlign: 'center' }}>
              <Text type="secondary">暂无真实故事</Text>
            </Card>
          )}
        </div>
      </section>

      <section style={{ padding: '48px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <Title level={2} style={{ marginBottom: '32px' }}>网戒的危害</Title>
          <Row gutter={16}>
            <Col xs={24} md={12} lg={6}>
              <Card>
                <div style={{ marginBottom: '16px' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <Title level={4} style={{ marginBottom: '12px' }}>心理健康问题</Title>
                <Paragraph>
                  强制隔离和虐待会导致焦虑、抑郁、创伤后应激障碍等心理问题，严重影响青少年的心理健康。
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Card>
                <div style={{ marginBottom: '16px' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <Title level={4} style={{ marginBottom: '12px' }}>身体伤害</Title>
                <Paragraph>
                  许多网戒中心采用体罚、电击等极端手段，对青少年的身体造成直接伤害，甚至导致死亡。
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Card>
                <div style={{ marginBottom: '16px' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="9" cy="7" r="4" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <Title level={4} style={{ marginBottom: '12px' }}>家庭关系破裂</Title>
                <Paragraph>
                  强制网戒会破坏亲子关系，导致家庭信任崩塌，甚至家庭关系永久破裂。
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Card>
                <div style={{ marginBottom: '16px' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="22 4 12 14.01 9 11.01" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <Title level={4} style={{ marginBottom: '12px' }}>社会适应障碍</Title>
                <Paragraph>
                  长期隔离和虐待会导致青少年社会功能受损，难以适应正常的社会生活。
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      <section style={{ padding: '48px 0', backgroundColor: '#f5f5f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <Title level={2} style={{ marginBottom: '32px' }}>帮助资源</Title>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Card>
                <Title level={4} style={{ marginBottom: '16px' }}>心理健康支持</Title>
                <ul style={{ paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '12px' }}>
                    <a href="#" style={{ color: '#1890ff' }}>心理咨询热线：400-161-9995</a>
                  </li>
                  <li style={{ marginBottom: '12px' }}>
                    <a href="#" style={{ color: '#1890ff' }}>青少年心理健康服务</a>
                  </li>
                  <li>
                    <a href="#" style={{ color: '#1890ff' }}>家庭心理咨询</a>
                  </li>
                </ul>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Title level={4} style={{ marginBottom: '16px' }}>法律支持</Title>
                <ul style={{ paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '12px' }}>
                    <a href="#" style={{ color: '#1890ff' }}>法律援助热线：12348</a>
                  </li>
                  <li style={{ marginBottom: '12px' }}>
                    <a href="#" style={{ color: '#1890ff' }}>青少年权益保护</a>
                  </li>
                  <li>
                    <a href="#" style={{ color: '#1890ff' }}>反家庭暴力法</a>
                  </li>
                </ul>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Title level={4} style={{ marginBottom: '16px' }}>教育资源</Title>
                <ul style={{ paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '12px' }}>
                    <a href="#" style={{ color: '#1890ff' }}>网络使用指南</a>
                  </li>
                  <li style={{ marginBottom: '12px' }}>
                    <a href="#" style={{ color: '#1890ff' }}>家庭沟通技巧</a>
                  </li>
                  <li>
                    <a href="#" style={{ color: '#1890ff' }}>青少年自我保护</a>
                  </li>
                </ul>
              </Card>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
}
