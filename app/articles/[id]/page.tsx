"use client";
import { useState, useEffect } from 'react';
import { Card, Typography, Spin, Button } from 'antd';
import Link from 'next/link';
import MarkdownIt from 'markdown-it';

const { Title, Paragraph, Text } = Typography;
const md = new MarkdownIt();

interface Article {
  id: number;
  title: string;
  content: string;
  author_id: number;
  author_username: string;
  created_at: string;
}

export default function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [articleId, setArticleId] = useState<string>('');

  useEffect(() => {
    const getArticleId = async () => {
      const { id } = await params;
      setArticleId(id);
    };
    getArticleId();
  }, [params]);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) return;
      
      try {
        const response = await fetch(`/api/articles/${articleId}`);
        if (response.ok) {
          const data = await response.json();
          setArticle(data.article);
        }
      } catch (error) {
        console.error('获取文章失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  return (
    <section style={{ padding: '48px 0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
            <Spin size="large" />
          </div>
        ) : article ? (
          <>
            <Button style={{ marginBottom: '24px' }}>
              <Link href="/articles">返回文章列表</Link>
            </Button>
            
            <Card>
              <Title level={2} style={{ marginBottom: '8px' }}>{article.title}</Title>
              <div style={{ marginBottom: '24px', display: 'flex', gap: '24px' }}>
                <Text type="secondary">作者：{article.author_username}</Text>
                <Text type="secondary">发布时间：{new Date(article.created_at).toLocaleString()}</Text>
              </div>
              
              <div 
                style={{ lineHeight: '1.8' }}
                dangerouslySetInnerHTML={{ __html: md.render(article.content) }}
              />
            </Card>
          </>
        ) : (
          <Card style={{ padding: '64px 0', textAlign: 'center' }}>
            <Text type="secondary">文章不存在</Text>
            <Button style={{ marginTop: '16px' }}>
              <Link href="/articles">返回文章列表</Link>
            </Button>
          </Card>
        )}
      </div>
    </section>
  );
}
