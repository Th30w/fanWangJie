"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Typography, Row, Col, Timeline, Spin, message, Button, List } from 'antd';
import { ArrowLeftOutlined, PaperClipOutlined, DownloadOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function StoryDetail() {
  const params = useParams();
  const router = useRouter();
  const [story, setStory] = useState<any>(null);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchStory(params.id as string);
      fetchAttachments(params.id as string);
    }
  }, [params.id]);

  const fetchStory = async (id: string) => {
    try {
      const response = await fetch(`/api/stories/${id}`);
      if (response.ok) {
        const data = await response.json();
        setStory(data.story);
      } else {
        message.error('获取故事详情失败');
      }
    } catch (error) {
      message.error('获取故事详情失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttachments = async (storyId: string) => {
    try {
      const response = await fetch(`/api/attachments?story_id=${storyId}`);
      if (response.ok) {
        const data = await response.json();
        setAttachments(data.attachments);
      }
    } catch (error) {
      // silently fail
    }
  };

  const handleDownload = async (attachment: any) => {
    try {
      const response = await fetch(`/api/attachments/${attachment.id}`);
      if (response.ok) {
        const data = await response.json();
        const link = document.createElement('a');
        link.href = data.attachment.data;
        link.download = attachment.filename;
        link.click();
      } else {
        message.error('下载附件失败');
      }
    } catch (error) {
      message.error('下载附件失败');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!story) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' }}>
        <Card>
          <Title level={3}>故事不存在</Title>
          <Button type="primary" onClick={() => router.push('/stories')}>
            返回列表
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <section style={{ padding: '48px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push('/stories')}
          style={{ marginBottom: '24px' }}
        >
          返回列表
        </Button>

        <Card style={{ marginBottom: '48px' }}>
          <Title level={3} style={{ marginBottom: '24px' }}>{story.name}的经历</Title>
          <Row gutter={32}>
            <Col xs={24} md={12}>
              {story.image ? (
                <img
                  src={story.image}
                  alt={`${story.name}的故事`}
                  style={{ width: '100%', height: 'auto', marginBottom: '24px' }}
                />
              ) : (
                <div style={{ width: '100%', height: '300px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                  <Text type="secondary">暂无图片</Text>
                </div>
              )}
            </Col>
            <Col xs={24} md={12}>
              <Title level={4} style={{ marginBottom: '16px' }}>背景</Title>
              <Paragraph style={{ marginBottom: '24px' }}>
                {story.background}
              </Paragraph>
              <Title level={4} style={{ marginBottom: '16px' }}>事件时间线</Title>
              <Timeline>
                {story.timeline.map((item: any, index: number) => (
                  <Timeline.Item key={index}>
                    <Text strong>{item.date}</Text>
                    <Paragraph>
                      {item.content}
                    </Paragraph>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Col>
          </Row>
        </Card>

        {story.parents_violence && (
          <Card style={{ marginBottom: '48px' }}>
            <Title level={3} style={{ marginBottom: '16px' }}>父母的暴力行为</Title>
            <ul style={{ paddingLeft: '24px' }}>
              {story.parents_violence.split('\n').map((item: string, index: number) => (
                item.trim() && <li key={index} style={{ marginBottom: '12px' }}>{item.trim()}</li>
              ))}
            </ul>
          </Card>
        )}

        {story.victim_demands && (
          <Card style={{ marginBottom: '48px' }}>
            <Title level={3} style={{ marginBottom: '16px' }}>受害者的诉求</Title>
            <ul style={{ paddingLeft: '24px' }}>
              {story.victim_demands.split('\n').map((item: string, index: number) => (
                item.trim() && <li key={index} style={{ marginBottom: '12px' }}>{item.trim()}</li>
              ))}
            </ul>
          </Card>
        )}

        {story.social_response && (
          <Card style={{ marginBottom: '48px' }}>
            <Title level={3} style={{ marginBottom: '16px' }}>社会反响</Title>
            <Paragraph style={{ marginBottom: '16px' }}>
              {story.social_response}
            </Paragraph>
          </Card>
        )}

        {story.legal_analysis && (
          <Card style={{ marginBottom: '48px' }}>
            <Title level={3} style={{ marginBottom: '16px' }}>法律分析</Title>
            <Paragraph style={{ marginBottom: '16px' }}>
              {story.legal_analysis}
            </Paragraph>
          </Card>
        )}

        {story.psychological_impact && (
          <Card style={{ marginBottom: '48px' }}>
            <Title level={3} style={{ marginBottom: '16px' }}>心理影响</Title>
            <Paragraph style={{ marginBottom: '16px' }}>
              {story.psychological_impact}
            </Paragraph>
          </Card>
        )}

        {story.expert_opinions && (
          <Card style={{ marginBottom: '48px' }}>
            <Title level={3} style={{ marginBottom: '16px' }}>专家观点</Title>
            <Paragraph style={{ marginBottom: '16px' }}>
              {story.expert_opinions}
            </Paragraph>
          </Card>
        )}

        {story.conclusion && (
          <Card style={{ marginBottom: '48px' }}>
            <Title level={3} style={{ marginBottom: '16px' }}>结论</Title>
            <Paragraph style={{ marginBottom: '16px' }}>
              {story.conclusion}
            </Paragraph>
          </Card>
        )}

        {attachments.length > 0 && (
          <Card style={{ marginBottom: '48px' }}>
            <Title level={3} style={{ marginBottom: '16px' }}>相关附件</Title>
            <List
              dataSource={attachments}
              renderItem={(item: any) => (
                <List.Item
                  actions={[
                    <Button
                      type="link"
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownload(item)}
                    >
                      下载
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<PaperClipOutlined style={{ fontSize: '20px', color: '#1890ff' }} />}
                    title={item.filename}
                    description={item.mimetype}
                  />
                </List.Item>
              )}
            />
          </Card>
        )}
      </div>
    </section>
  );
}
