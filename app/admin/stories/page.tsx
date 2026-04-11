'use client';
import { useEffect, useState } from 'react';
import { Layout, Menu, Table, Button, Modal, Form, Input, Upload, Typography, Space, message, Spin, Card, Popconfirm, DatePicker, List } from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined, EditOutlined, PaperClipOutlined, DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Link from 'next/link';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

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

const TimelineEditor = (props: any) => {
  const { value = [], onChange } = props;
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    const newItem = { _key: Date.now().toString(), date: '', content: '' };
    const newTimeline = [...value, newItem];
    onChange(newTimeline);
  };

  const handleEdit = (record: any, index: number) => {
    const formattedRecord = {
      ...record,
      date: record.date ? dayjs(record.date) : null
    };
    setEditingRecord(formattedRecord);
    setEditingIndex(index);
  };

  const handleSave = (values: any) => {
    if (editingIndex !== null) {
      const newTimeline = [...value];
      newTimeline[editingIndex] = {
        ...values,
        date: values.date ? values.date.format('YYYY-MM-DD') : '',
      };
      onChange(newTimeline);
      setEditingRecord(null);
      setEditingIndex(null);
    }
  };

  const handleDelete = (index: number) => {
    const newTimeline = value.filter((_: any, i: number) => i !== index);
    onChange(newTimeline);
  };

  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => text || '-',
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      render: (text: string) => text || '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any, index: number) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record, index)} />
          <Popconfirm
            title="确定要删除这个时间线条目吗？"
            onConfirm={() => handleDelete(index)}
            okText="确定"
            cancelText="取消"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加时间线条目
        </Button>
      </div>
      <Table
        dataSource={value}
        columns={columns}
        rowKey={(record) => record._key || Date.now().toString()}
        pagination={false}
      />
      
      {editingRecord && (
        <Modal
          title="编辑时间线条目"
          open={!!editingRecord}
          onCancel={() => {
            setEditingRecord(null);
            setEditingIndex(null);
          }}
          footer={null}
        >
          <Form
            form={form}
            initialValues={editingRecord}
            onFinish={handleSave}
          >
            <Form.Item
              name="date"
              label="日期"
              rules={[{ required: true, message: '请输入日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="content"
              label="内容"
              rules={[{ required: true, message: '请输入内容' }]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Button onClick={() => {
                  setEditingRecord(null);
                  setEditingIndex(null);
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
      )}
    </Card>
  );
};

export default function StoriesManagement() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentStory, setCurrentStory] = useState<any>(null);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [editAttachments, setEditAttachments] = useState<any[]>([]);
  const [attachmentLoading, setAttachmentLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/admin';
      return;
    }

    const fetchUserInfo = async () => {
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

    fetchUserInfo();
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/stories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const storiesWithKeys = data.stories.map((story: any) => ({
          ...story,
          timeline: (story.timeline || []).map((item: any, idx: number) => ({
            _key: item._key || `${story.id}-${idx}`,
            ...item,
          })),
        }));
        setStories(storiesWithKeys);
      }
    } catch (error) {
      message.error('获取人物专栏失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttachments = async (storyId: number) => {
    setAttachmentLoading(true);
    try {
      const response = await fetch(`/api/attachments?story_id=${storyId}`);
      if (response.ok) {
        const data = await response.json();
        setAttachments(data.attachments);
      }
    } catch (error) {
      message.error('获取附件失败');
    } finally {
      setAttachmentLoading(false);
    }
  };

  const handleAddStory = async (values: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('background', values.background);
      formData.append('timeline', JSON.stringify(values.timeline));
      formData.append('parents_violence', values.parents_violence || '');
      formData.append('victim_demands', values.victim_demands || '');
      formData.append('social_response', values.social_response || '');
      formData.append('legal_analysis', values.legal_analysis || '');
      formData.append('psychological_impact', values.psychological_impact || '');
      formData.append('expert_opinions', values.expert_opinions || '');
      formData.append('conclusion', values.conclusion || '');
      if (values.image && values.image.length > 0) {
        const file = values.image[0];
        if (file.originFileObj) {
          formData.append('image', file.originFileObj);
        }
      }

      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        const newStoryId = data.story.id;

        if (values.attachments && values.attachments.length > 0) {
          const attachFormData = new FormData();
          attachFormData.append('story_id', newStoryId.toString());
          for (const file of values.attachments) {
            attachFormData.append('files', file.originFileObj || file);
          }
          await fetch('/api/attachments', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: attachFormData
          });
        }

        message.success('添加人物专栏成功');
        setShowAddModal(false);
        form.resetFields();
        fetchStories();
      } else {
        const data = await response.json();
        message.error(data.error || '添加人物专栏失败');
      }
    } catch (error) {
      message.error('添加人物专栏失败');
    }
  };

  const handleEditStory = async (values: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !currentStory) return;

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('background', values.background);
      formData.append('timeline', JSON.stringify(values.timeline));
      formData.append('parents_violence', values.parents_violence || '');
      formData.append('victim_demands', values.victim_demands || '');
      formData.append('social_response', values.social_response || '');
      formData.append('legal_analysis', values.legal_analysis || '');
      formData.append('psychological_impact', values.psychological_impact || '');
      formData.append('expert_opinions', values.expert_opinions || '');
      formData.append('conclusion', values.conclusion || '');
      if (values.image && values.image.length > 0) {
        const file = values.image[0];
        if (file.originFileObj) {
          formData.append('image', file.originFileObj);
        }
      }

      const response = await fetch(`/api/stories/${currentStory.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        if (values.attachments && values.attachments.length > 0) {
          const attachFormData = new FormData();
          attachFormData.append('story_id', currentStory.id.toString());
          for (const file of values.attachments) {
            attachFormData.append('files', file.originFileObj || file);
          }
          await fetch('/api/attachments', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: attachFormData
          });
        }

        message.success('编辑人物专栏成功');
        setShowEditModal(false);
        setCurrentStory(null);
        form.resetFields();
        fetchStories();
      } else {
        const data = await response.json();
        message.error(data.error || '编辑人物专栏失败');
      }
    } catch (error) {
      message.error('编辑人物专栏失败');
    }
  };

  const handleDeleteStory = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/stories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        message.success('删除人物专栏成功');
        fetchStories();
      } else {
        const data = await response.json();
        message.error(data.error || '删除人物专栏失败');
      }
    } catch (error) {
      message.error('删除人物专栏失败');
    }
  };

  const handleDeleteAttachment = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/attachments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        message.success('删除附件成功');
        if (currentStory) {
          fetchAttachments(currentStory.id);
        }
      } else {
        message.error('删除附件失败');
      }
    } catch (error) {
      message.error('删除附件失败');
    }
  };

  const handleUploadAttachments = async (files: any[]) => {
    if (!currentStory || files.length === 0) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const formData = new FormData();
      formData.append('story_id', currentStory.id.toString());
      for (const file of files) {
        formData.append('files', file.originFileObj || file);
      }

      const response = await fetch('/api/attachments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        message.success('上传附件成功');
        fetchAttachments(currentStory.id);
      } else {
        message.error('上传附件失败');
      }
    } catch (error) {
      message.error('上传附件失败');
    }
  };

  const openEditModal = async (story: any) => {
    setCurrentStory(story);

    const imageFileList = story.image ? [{
      uid: '-1',
      name: 'image',
      status: 'done',
      url: story.image,
    }] : [];

    form.setFieldsValue({
      name: story.name,
      background: story.background,
      timeline: story.timeline,
      parents_violence: story.parents_violence,
      victim_demands: story.victim_demands,
      social_response: story.social_response,
      legal_analysis: story.legal_analysis,
      psychological_impact: story.psychological_impact,
      expert_opinions: story.expert_opinions,
      conclusion: story.conclusion,
      image: imageFileList,
      attachments: [],
    });

    try {
      const response = await fetch(`/api/attachments?story_id=${story.id}`);
      if (response.ok) {
        const data = await response.json();
        setEditAttachments(data.attachments);
      }
    } catch (error) {
      // silently fail
    }

    setShowEditModal(true);
  };

  const openAttachmentModal = (story: any) => {
    setCurrentStory(story);
    fetchAttachments(story.id);
    setShowAttachmentModal(true);
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
          <Button icon={<PaperClipOutlined />} onClick={() => openAttachmentModal(record)}>附件</Button>
          <Popconfirm
            title="确定要删除这个人物专栏吗？"
            description="删除后数据将无法恢复，相关附件也会一并删除。"
            onConfirm={() => handleDeleteStory(record.id)}
            okText="确定删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button danger>删除</Button>
          </Popconfirm>
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
            defaultSelectedKeys={['/admin/stories']}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
        </Sider>
        <Content style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <Title level={2} style={{ margin: 0 }}>人物专栏管理</Title>
            <Button type="primary" onClick={() => setShowAddModal(true)}>
              添加人物专栏
            </Button>
          </div>
          <Table columns={columns} dataSource={stories} rowKey="id" />

          {/* 添加人物专栏模态框 */}
          <Modal
            title="添加人物专栏"
            open={showAddModal}
            onCancel={() => {
              setShowAddModal(false);
              form.resetFields();
            }}
            footer={null}
            width={720}
          >
            <Form form={form} onFinish={handleAddStory}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="background"
                label="背景"
                rules={[{ required: true, message: '请输入背景' }]}
              >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item
                name="timeline"
                label="时间线"
                rules={[{ required: true, message: '请输入时间线' }]}
                valuePropName="value"
                getValueFromEvent={(value) => value}
              >
                <TimelineEditor />
              </Form.Item>
              <Form.Item
                name="parents_violence"
                label="父母的暴力行为"
              >
                <TextArea rows={4} placeholder="请输入父母的暴力行为，每行一条，使用换行分隔" />
              </Form.Item>
              <Form.Item
                name="victim_demands"
                label="受害者的诉求"
              >
                <TextArea rows={4} placeholder="请输入受害者的诉求，每行一条，使用换行分隔" />
              </Form.Item>
              <Form.Item
                name="social_response"
                label="社会反响"
              >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item
                name="legal_analysis"
                label="法律分析"
              >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item
                name="psychological_impact"
                label="心理影响"
              >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item
                name="expert_opinions"
                label="专家观点"
              >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item
                name="conclusion"
                label="结论"
              >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item
                name="image"
                label="图片"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) return e;
                  return e?.fileList;
                }}
              >
                <Upload
                  name="image"
                  listType="picture"
                  maxCount={1}
                  beforeUpload={() => false}
                >
                  <Button icon={<UploadOutlined />}>上传图片</Button>
                </Upload>
              </Form.Item>
              <Form.Item
                name="attachments"
                label="附件"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) return e;
                  return e?.fileList;
                }}
              >
                <Upload
                  name="files"
                  multiple
                  beforeUpload={() => false}
                >
                  <Button icon={<PaperClipOutlined />}>上传附件</Button>
                </Upload>
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

          {/* 编辑人物专栏模态框 */}
          <Modal
            title="编辑人物专栏"
            open={showEditModal}
            onCancel={() => {
              setShowEditModal(false);
              setCurrentStory(null);
              setEditAttachments([]);
              form.resetFields();
            }}
            footer={null}
            width={720}
          >
            <Form form={form} onFinish={handleEditStory}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="background"
                label="背景"
                rules={[{ required: true, message: '请输入背景' }]}
              >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item
                name="timeline"
                label="时间线"
                rules={[{ required: true, message: '请输入时间线' }]}
                valuePropName="value"
                getValueFromEvent={(value) => value}
              >
                <TimelineEditor />
              </Form.Item>
              <Form.Item
                name="parents_violence"
                label="父母的暴力行为"
              >
                <TextArea rows={4} placeholder="请输入父母的暴力行为，每行一条，使用换行分隔" />
              </Form.Item>
              <Form.Item
                name="victim_demands"
                label="受害者的诉求"
              >
                <TextArea rows={4} placeholder="请输入受害者的诉求，每行一条，使用换行分隔" />
              </Form.Item>
              <Form.Item
                name="social_response"
                label="社会反响"
              >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item
                name="legal_analysis"
                label="法律分析"
              >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item
                name="psychological_impact"
                label="心理影响"
              >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item
                name="expert_opinions"
                label="专家观点"
              >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item
                name="conclusion"
                label="结论"
              >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item
                name="image"
                label="图片"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) return e;
                  return e?.fileList;
                }}
              >
                <Upload
                  name="image"
                  listType="picture"
                  maxCount={1}
                  beforeUpload={() => false}
                >
                  <Button icon={<UploadOutlined />}>上传图片</Button>
                </Upload>
              </Form.Item>
              <Form.Item
                name="attachments"
                label="新增附件"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) return e;
                  return e?.fileList;
                }}
              >
                <Upload
                  name="files"
                  multiple
                  beforeUpload={() => false}
                >
                  <Button icon={<PaperClipOutlined />}>上传附件</Button>
                </Upload>
              </Form.Item>
              {editAttachments.length > 0 && (
                <Form.Item label="已有附件">
                  <List
                    size="small"
                    dataSource={editAttachments}
                    renderItem={(item: any) => (
                      <List.Item
                        actions={[
                          <Popconfirm
                            title="确定要删除这个附件吗？"
                            onConfirm={async () => {
                              const token = localStorage.getItem('token');
                              if (!token) return;
                              const res = await fetch(`/api/attachments/${item.id}`, {
                                method: 'DELETE',
                                headers: { 'Authorization': `Bearer ${token}` }
                              });
                              if (res.ok) {
                                message.success('删除附件成功');
                                setEditAttachments(editAttachments.filter((a: any) => a.id !== item.id));
                              }
                            }}
                            okText="确定"
                            cancelText="取消"
                          >
                            <Button type="link" danger size="small" icon={<DeleteOutlined />}>删除</Button>
                          </Popconfirm>
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<PaperClipOutlined style={{ color: '#1890ff' }} />}
                          title={item.filename}
                          description={item.mimetype}
                        />
                      </List.Item>
                    )}
                  />
                </Form.Item>
              )}
              <Form.Item>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Button onClick={() => {
                    setShowEditModal(false);
                    setCurrentStory(null);
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

          {/* 附件管理模态框 */}
          <Modal
            title={`附件管理 - ${currentStory?.name || ''}`}
            open={showAttachmentModal}
            onCancel={() => {
              setShowAttachmentModal(false);
              setCurrentStory(null);
              setAttachments([]);
            }}
            footer={null}
            width={640}
          >
            <Upload
              multiple
              beforeUpload={(file) => {
                handleUploadAttachments([file]);
                return false;
              }}
              showUploadList={false}
            >
              <Button type="primary" icon={<UploadOutlined />} style={{ marginBottom: '16px' }}>
                上传附件
              </Button>
            </Upload>

            <Spin spinning={attachmentLoading}>
              {attachments.length === 0 ? (
                <Card>
                  <Text type="secondary">暂无附件</Text>
                </Card>
              ) : (
                <List
                  dataSource={attachments}
                  renderItem={(item: any) => (
                    <List.Item
                      actions={[
                        <Button
                          type="link"
                          icon={<DownloadOutlined />}
                          onClick={async () => {
                            const response = await fetch(`/api/attachments/${item.id}`);
                            if (response.ok) {
                              const data = await response.json();
                              const link = document.createElement('a');
                              link.href = data.attachment.data;
                              link.download = item.filename;
                              link.click();
                            }
                          }}
                        >
                          下载
                        </Button>,
                        <Popconfirm
                          title="确定要删除这个附件吗？"
                          onConfirm={() => handleDeleteAttachment(item.id)}
                          okText="确定"
                          cancelText="取消"
                        >
                          <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
                        </Popconfirm>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<PaperClipOutlined style={{ fontSize: '20px', color: '#1890ff' }} />}
                        title={item.filename}
                        description={`${item.mimetype} | ${new Date(item.created_at).toLocaleString()}`}
                      />
                    </List.Item>
                  )}
                />
              )}
            </Spin>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
}
