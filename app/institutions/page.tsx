'use client'
import { useState, useEffect } from 'react';
import { Input, Button, Table, Pagination, Card, Typography, Space, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Institution {
  id: number;
  name: string;
  province: string;
  city: string;
  key_person: string;
  status: string;
  system_tags: string;
  created_at: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ApiResponse {
  success: boolean;
  data: {
    institutions: Institution[];
    pagination: PaginationData;
  };
  error?: string;
}

export default function InstitutionsPage() {
  const [searchText, setSearchText] = useState('');
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0
  });

  const fetchInstitutions = async (page: number = 1, search: string = '') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/institutions?search=${encodeURIComponent(search)}&page=${page}&limit=${pagination.limit}`);
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setInstitutions(data.data.institutions);
        setPagination(data.data.pagination);
      } else {
        message.error(data.error || '获取机构列表失败');
      }
    } catch (error) {
      console.error('获取机构列表失败:', error);
      message.error('获取机构列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutions(pagination.page, searchText);
  }, []);

  const handleSearch = () => {
    fetchInstitutions(1, searchText);
  };

  const handlePaginationChange = (page: number) => {
    fetchInstitutions(page, searchText);
  };

  const columns = [
    {
      title: '机构名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: 250,
    },
    {
      title: '省份',
      dataIndex: 'province',
      key: 'province',
      width: 100,
    },
    {
      title: '城市/区县',
      dataIndex: 'city',
      key: 'city',
      width: 120,
    },
    {
      title: '关键关联人',
      dataIndex: 'key_person',
      key: 'key_person',
      ellipsis: true,
      width: 150,
    },
    {
      title: '经营状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
    },
    {
      title: '体系/关联标签',
      dataIndex: 'system_tags',
      key: 'system_tags',
      ellipsis: true,
      width: 150,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>戒网瘾学校查询</Title>
        
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
          <Space style={{ width: '100%', maxWidth: '600px' }}>
            <Input
              placeholder="输入关键词搜索（机构名称、省份、城市、关联人等）"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
              style={{ flex: 1 }}
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              搜索
            </Button>
          </Space>
        </div>
        
        <Table
          columns={columns}
          dataSource={institutions.map(item => ({ ...item, key: item.id }))}
          loading={loading}
          pagination={false}
          scroll={{ x: 1000 }}
        />
        
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
          <Pagination
            current={pagination.page}
            pageSize={pagination.limit}
            total={pagination.total}
            onChange={handlePaginationChange}
            showTotal={(total) => `共 ${total} 条记录`}
            showSizeChanger={false}
          />
        </div>
        
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Text type="secondary">
            本查询系统提供戒网瘾机构的基本信息，仅供参考。如有疑问，请联系相关部门。
          </Text>
        </div>
      </Card>
    </div>
  );
}
