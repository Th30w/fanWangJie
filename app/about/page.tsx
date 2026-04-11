"use client"; // 关键：声明为客户端组件
import Image from 'next/image';
import { Row, Col, Typography, Card } from 'antd';

const { Title, Paragraph, Text } = Typography;

export default function About() {
  return (
    <section style={{ padding: '48px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <Title level={2} style={{ marginBottom: '32px' }}>关于网戒</Title>
        <Row gutter={32}>
          <Col xs={24} md={12}>
            <Title level={3} style={{ marginBottom: '16px' }}>什么是网络成瘾？</Title>
            <Paragraph style={{ marginBottom: '16px' }}>
              网络成瘾，也称为互联网成瘾障碍（Internet Addiction Disorder，IAD），是指个体对网络使用产生强烈的依赖，导致其社会功能、学业、工作或人际关系受到严重影响的一种行为问题。
            </Paragraph>
            <Paragraph style={{ marginBottom: '32px' }}>
              然而，需要明确的是，网络成瘾并不是一种正式的精神疾病。根据世界卫生组织（WHO）的《国际疾病分类》（ICD-11），只有“游戏障碍”（Gaming Disorder）被正式列为精神疾病，而不是广义的网络成瘾。
            </Paragraph>
            
            <Title level={3} style={{ marginBottom: '16px' }}>网戒中心的问题</Title>
            <Paragraph style={{ marginBottom: '16px' }}>
              许多所谓的“网戒中心”采用的方法往往极端且不科学，包括：
            </Paragraph>
            <ul style={{ marginBottom: '16px', paddingLeft: '24px' }}>
              <li style={{ marginBottom: '8px' }}><Text strong>强制隔离与封闭管理</Text>：将青少年与外界隔绝，限制其自由和通信。</li>
              <li style={{ marginBottom: '8px' }}><Text strong>身体惩罚与精神虐待</Text>：采用体罚、电击、辱骂等手段，对青少年造成身体和心理伤害。</li>
              <li style={{ marginBottom: '8px' }}><Text strong>洗脑式的思想控制</Text>：通过重复灌输特定观念，试图改变青少年的价值观和行为模式。</li>
              <li style={{ marginBottom: '8px' }}><Text strong>忽视个体差异的统一治疗方案</Text>：不考虑青少年的具体情况，采用相同的方法对待所有“患者”。</li>
              <li style={{ marginBottom: '8px' }}><Text strong>高额收费</Text>：许多网戒中心收取高昂的费用，给家庭带来经济负担。</li>
            </ul>
            <Paragraph style={{ marginBottom: '32px' }}>
              这些方法不仅不能有效解决问题，反而会对青少年的心理健康造成严重伤害，甚至导致悲剧发生。
            </Paragraph>
            
            <Title level={3} style={{ marginBottom: '16px' }}>科学的应对方法</Title>
            <Paragraph style={{ marginBottom: '16px' }}>
              对于青少年的网络使用问题，科学的应对方法包括：
            </Paragraph>
            <ul style={{ marginBottom: '16px', paddingLeft: '24px' }}>
              <li style={{ marginBottom: '8px' }}><Text strong>家庭支持与沟通</Text>：建立良好的家庭关系，加强与青少年的沟通，了解他们的需求和困惑。</li>
              <li style={{ marginBottom: '8px' }}><Text strong>心理干预</Text>：寻求专业心理咨询师的帮助，采用认知行为疗法等科学方法。</li>
              <li style={{ marginBottom: '8px' }}><Text strong>教育与引导</Text>：帮助青少年正确认识网络的作用，培养健康的网络使用习惯。</li>
              <li style={{ marginBottom: '8px' }}><Text strong>社会支持</Text>：构建支持性的社会环境，为青少年提供更多的线下活动和社交机会。</li>
              <li style={{ marginBottom: '8px' }}><Text strong>自我管理</Text>：帮助青少年学会自我控制和时间管理，培养其他兴趣爱好。</li>
            </ul>
          </Col>
          <Col xs={24} md={12}>
            <Card style={{ marginBottom: '24px' }}>
              <Image 
                src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20psychologist%20talking%20to%20teenager%20in%20a%20comfortable%20office&image_size=portrait_4_3" 
                alt="心理咨询" 
                width={400} 
                height={500} 
                style={{ width: '100%', height: 'auto' }}
              />
            </Card>
            <Card>
              <Image 
                src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=family%20sitting%20together%20and%20talking%20in%20a%20living%20room&image_size=portrait_4_3" 
                alt="家庭沟通" 
                width={400} 
                height={500} 
                style={{ width: '100%', height: 'auto' }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </section>
  );
}
