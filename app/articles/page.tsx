"use client";
import { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Spin, Button } from 'antd';
import Link from 'next/link';

const { Title, Paragraph, Text } = Typography;

interface Article {
  id: number;
  title: string;
  content: string;
  author_id: number;
  author_username: string;
  created_at: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles');
        if (response.ok) {
          const data = await response.json();
          setArticles(data.articles);
        }
      } catch (error) {
        console.error('获取文章失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const truncateContent = (content: string, maxLength: number) => {
    // 简单去除Markdown标记
    const plainText = content.replace(/#+\s/g, '').replace(/\*\*/g, '').replace(/\*/g, '').replace(/`/g, '');
    return plainText.length > maxLength ? `${plainText.substring(0, maxLength)}...` : plainText;
  };

  return (
    <section style={{ padding: '48px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <Title level={2} style={{ marginBottom: '32px' }}>文章列表</Title>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
            <Spin size="large" />
          </div>
        ) : articles.length > 0 ? (
          <Row gutter={[16, 16]}>
            {articles.map((article) => (
              <Col key={article.id} xs={24} md={12} lg={8}>
                <Card
                  hoverable
                  style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ flex: 1 }}>
                    <Link href={`/articles/${article.id}`}>
                      <Title level={4} style={{ marginBottom: '8px', cursor: 'pointer' }}>
                        {article.title}
                      </Title>
                    </Link>
                    <Paragraph style={{ marginBottom: '16px' }}>
                      {truncateContent(article.content, 100)}
                    </Paragraph>
                  </div>
                  <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text type="secondary">
                      作者：{article.author_username}
                    </Text>
                    <Text type="secondary">
                      {new Date(article.created_at).toLocaleString()}
                    </Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Card style={{ padding: '64px 0', textAlign: 'center' }}>
            <Text type="secondary">暂无文章</Text>
          </Card>
        )}
      </div>
    </section>
  );
}
