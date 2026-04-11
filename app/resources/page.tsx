"use client"; // 关键：声明为客户端组件
import { Card, Row, Col, Typography, Collapse, Space } from 'antd';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

export default function Resources() {
  return (
    <section style={{ padding: '48px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <Title level={2} style={{ marginBottom: '32px' }}>帮助资源</Title>
        
        <Row gutter={16} style={{ marginBottom: '48px' }}>
          <Col xs={24} md={8}>
            <Card>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'inline-block', padding: '16px', borderRadius: '50%', backgroundColor: '#e6f7ff', marginBottom: '16px' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 6V8" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V18" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 12H10" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 12H16" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <Title level={3}>心理健康支持</Title>
              </div>
              <ul style={{ paddingLeft: '0' }}>
                <li style={{ marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: '4px', flexShrink: 0 }}>
                    <path d="M5 12H19" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 5V19" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <Text strong>心理咨询热线</Text>
                    <Paragraph style={{ margin: '4px 0' }}>
                      400-161-9995
                    </Paragraph>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      服务时间：24小时
                    </Text>
                  </div>
                </li>
                <li style={{ marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: '4px', flexShrink: 0 }}>
                    <path d="M5 12H19" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 5V19" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <Text strong>青少年心理健康服务</Text>
                    <Paragraph style={{ margin: '4px 0' }}>
                      12355
                    </Paragraph>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      服务时间：9:00-21:00
                    </Text>
                  </div>
                </li>
                <li style={{ marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: '4px', flexShrink: 0 }}>
                    <path d="M5 12H19" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 5V19" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <Text strong>家庭心理咨询</Text>
                    <Paragraph style={{ margin: '4px 0' }}>
                      010-82951332
                    </Paragraph>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      服务时间：9:00-18:00
                    </Text>
                  </div>
                </li>
              </ul>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'inline-block', padding: '16px', borderRadius: '50%', backgroundColor: '#f6ffed', marginBottom: '16px' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#27ae60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <Title level={3}>法律支持</Title>
              </div>
              <ul style={{ paddingLeft: '0' }}>
                <li style={{ marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: '4px', flexShrink: 0 }}>
                    <path d="M5 12H19" stroke="#27ae60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 5V19" stroke="#27ae60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <Text strong>法律援助热线</Text>
                    <Paragraph style={{ margin: '4px 0' }}>
                      12348
                    </Paragraph>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      服务时间：9:00-17:00
                    </Text>
                  </div>
                </li>
                <li style={{ marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: '4px', flexShrink: 0 }}>
                    <path d="M5 12H19" stroke="#27ae60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 5V19" stroke="#27ae60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <Text strong>青少年权益保护</Text>
                    <Paragraph style={{ margin: '4px 0' }}>
                      12355
                    </Paragraph>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      服务时间：9:00-21:00
                    </Text>
                  </div>
                </li>
                <li style={{ marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: '4px', flexShrink: 0 }}>
                    <path d="M5 12H19" stroke="#27ae60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 5V19" stroke="#27ae60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <Text strong>反家庭暴力法</Text>
                    <Paragraph style={{ margin: '4px 0' }}>
                      全国人大常委会通过
                    </Paragraph>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      自2016年3月1日起施行
                    </Text>
                  </div>
                </li>
              </ul>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'inline-block', padding: '16px', borderRadius: '50%', backgroundColor: '#fffbe6', marginBottom: '16px' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="#f39c12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <Title level={3}>教育资源</Title>
              </div>
              <ul style={{ paddingLeft: '0' }}>
                <li style={{ marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: '4px', flexShrink: 0 }}>
                    <path d="M5 12H19" stroke="#f39c12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 5V19" stroke="#f39c12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <Text strong>网络使用指南</Text>
                    <Paragraph style={{ margin: '4px 0' }}>
                      青少年网络素养教育
                    </Paragraph>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      教育部发布
                    </Text>
                  </div>
                </li>
                <li style={{ marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: '4px', flexShrink: 0 }}>
                    <path d="M5 12H19" stroke="#f39c12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 5V19" stroke="#f39c12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <Text strong>家庭沟通技巧</Text>
                    <Paragraph style={{ margin: '4px 0' }}>
                      如何与青少年有效沟通
                    </Paragraph>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      心理学专家推荐
                    </Text>
                  </div>
                </li>
                <li style={{ marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: '4px', flexShrink: 0 }}>
                    <path d="M5 12H19" stroke="#f39c12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 5V19" stroke="#f39c12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <Text strong>青少年自我保护</Text>
                    <Paragraph style={{ margin: '4px 0' }}>
                      如何应对家庭暴力
                    </Paragraph>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      法律专家指导
                    </Text>
                  </div>
                </li>
              </ul>
            </Card>
          </Col>
        </Row>

        <Card style={{ marginBottom: '48px' }}>
          <Title level={3} style={{ marginBottom: '24px' }}>如何寻求帮助</Title>
          <Row gutter={32}>
            <Col xs={24} md={12}>
              <Title level={4} style={{ marginBottom: '16px' }}>步骤一：识别问题</Title>
              <Paragraph style={{ marginBottom: '24px' }}>
                如果你或你身边的人正在经历网络成瘾戒治相关的问题，或者遭受家庭暴力，首先要识别问题的严重性，及时寻求帮助。
              </Paragraph>
              <Title level={4} style={{ marginBottom: '16px' }}>步骤二：选择合适的资源</Title>
              <Paragraph style={{ marginBottom: '24px' }}>
                根据具体情况，选择合适的帮助资源，如心理咨询热线、法律援助热线或青少年权益保护热线。
              </Paragraph>
              <Title level={4} style={{ marginBottom: '16px' }}>步骤三：寻求专业帮助</Title>
              <Paragraph>
                如果问题严重，建议寻求专业心理咨询师或律师的帮助，他们可以提供更具体的指导和支持。
              </Paragraph>
            </Col>
            <Col xs={24} md={12}>
              <Title level={4} style={{ marginBottom: '16px' }}>步骤四：建立支持网络</Title>
              <Paragraph style={{ marginBottom: '24px' }}>
                与家人、朋友或其他支持你的人建立联系，分享你的经历和感受，获得情感支持。
              </Paragraph>
              <Title level={4} style={{ marginBottom: '16px' }}>步骤五：自我保护</Title>
              <Paragraph style={{ marginBottom: '24px' }}>
                如果面临家庭暴力或其他危险情况，要学会自我保护，如报警、寻求庇护等。
              </Paragraph>
              <Title level={4} style={{ marginBottom: '16px' }}>步骤六：长期支持</Title>
              <Paragraph>
                网络成瘾和家庭暴力的恢复需要时间，要保持耐心，持续寻求支持，逐步恢复心理健康。
              </Paragraph>
            </Col>
          </Row>
        </Card>

        <Card>
          <Title level={3} style={{ marginBottom: '24px' }}>常见问题</Title>
          <Collapse defaultActiveKey={['1']}>
            <Panel header="什么是网络成瘾？" key="1">
              <Paragraph>
                网络成瘾是指个体对网络使用产生强烈的依赖，导致其社会功能、学业、工作或人际关系受到严重影响的一种行为问题。但需要明确的是，网络成瘾并不是一种正式的精神疾病。
              </Paragraph>
            </Panel>
            <Panel header="如何区分正常的网络使用和网络成瘾？" key="2">
              <Paragraph>
                正常的网络使用是出于工作、学习、娱乐等目的，不会影响日常生活和社会功能。而网络成瘾则会导致个体无法控制自己的网络使用，忽视现实生活，影响学业、工作和人际关系。
              </Paragraph>
            </Panel>
            <Panel header="如果我或身边的人正在经历网络成瘾问题，应该怎么办？" key="3">
              <Paragraph>
                首先，要认识到网络成瘾是一个需要专业帮助的问题，不要自行采用极端方法。建议寻求专业心理咨询师的帮助，同时建立良好的家庭和社会支持网络。
              </Paragraph>
            </Panel>
            <Panel header="如何应对家庭暴力？" key="4">
              <Paragraph>
                如果遭受家庭暴力，要及时报警，寻求法律援助和心理咨询。同时，要学会自我保护，如暂时离开危险环境，寻求庇护等。
              </Paragraph>
            </Panel>
            <Panel header="家长应该如何正确对待青少年的网络使用？" key="5">
              <Paragraph>
                家长应该与青少年建立良好的沟通渠道，了解他们的网络使用情况，设定合理的网络使用时间，引导他们正确认识网络的作用，培养健康的网络使用习惯。
              </Paragraph>
            </Panel>
          </Collapse>
        </Card>
      </div>
    </section>
  );
}
