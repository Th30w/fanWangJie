"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, Typography, Row, Col, Spin, message } from 'antd';

const { Title, Paragraph, Text } = Typography;

export default function Stories() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/stories');
      if (response.ok) {
        const data = await response.json();
        setStories(data.stories);
      } else {
        message.error('获取真实故事失败');
      }
    } catch (error) {
      message.error('获取真实故事失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <section style={{ padding: '48px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <Title level={2} style={{ marginBottom: '32px' }}>真实故事</Title>

        {stories.length === 0 ? (
          <Card>
            <Title level={3}>暂无故事</Title>
            <Paragraph>目前还没有添加任何真实故事</Paragraph>
          </Card>
        ) : (
          <Row gutter={[24, 24]}>
            {stories.map((story) => (
              <Col xs={24} sm={12} md={8} key={story.id}>
                <Link href={`/stories/${story.id}`} style={{ textDecoration: 'none' }}>
                  <Card
                    hoverable
                    cover={
                      story.image ? (
                        <div style={{ width: '100%', height: '300px', overflow: 'hidden' }}>
                          <img
                            src={story.image}
                            alt={story.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      ) : (
                        <div style={{ width: '100%', height: '300px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Text type="secondary">暂无图片</Text>
                        </div>
                      )
                    }
                  >
                    <Card.Meta
                      title={story.name}
                      description={
                        <Paragraph ellipsis={{ rows: 3 }}>
                          {story.background}
                        </Paragraph>
                      }
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </section>
  );
}
