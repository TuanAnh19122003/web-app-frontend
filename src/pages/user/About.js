import React from 'react';
import { Row, Col, Typography, Image, Card, Divider } from 'antd';
import {
    CoffeeOutlined,
    WifiOutlined,
    SmileOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const AboutCafe = () => {
    return (
        <div style={{ padding: '40px', background: '#fefefe' }}>
            <Row gutter={[32, 32]}>
                <Col xs={24} md={12}>
                    <Image
                        src="https://cms.saymee.vn/images/notifications/1685084153857_dscf6620.mp4_.19_15_01_23.still001%20(1).jpg"
                        alt="Quán cà phê"
                        style={{
                            borderRadius: 12,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                        preview={true}
                    />
                </Col>

                <Col xs={24} md={12}>
                    <Title level={2}>Chào mừng đến với Cafe Tranquil</Title>
                    <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
                        Tọa lạc giữa lòng thành phố nhộn nhịp, Cafe Tranquil là điểm đến lý tưởng cho những ai yêu thích sự thanh bình, mộc mạc và một tách cà phê nguyên chất đậm đà.
                    </Paragraph>
                    <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
                        Không gian được thiết kế theo phong cách tối giản nhưng tinh tế, kết hợp hài hòa giữa ánh sáng tự nhiên và nội thất gỗ, tạo cảm giác ấm cúng và thư giãn.
                    </Paragraph>
                    <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
                        Chúng tôi không chỉ phục vụ cà phê mà còn mang đến trải nghiệm trọn vẹn với âm nhạc nhẹ nhàng, nhân viên thân thiện và các loại bánh handmade hấp dẫn.
                    </Paragraph>
                    <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
                        Dù bạn cần một góc nhỏ để đọc sách, làm việc, hay gặp gỡ bạn bè, Cafe Tranquil luôn là lựa chọn hoàn hảo.
                    </Paragraph>
                </Col>
            </Row>

            <Divider />

            <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
                {[
                    { icon: <CoffeeOutlined />, label: 'Cà phê nguyên chất' },
                    { icon: <WifiOutlined />, label: 'Wi-Fi miễn phí' },
                    { icon: <SmileOutlined />, label: 'Không gian yên tĩnh' },
                ].map((item, index) => (
                    <Col xs={24} sm={8} key={index}>
                        <Card
                            style={{ textAlign: 'center', borderRadius: 12 }}
                            styles={{ padding: 24 }}
                            hoverable
                        >
                            <div style={{ fontSize: 32, color: '#9254de', marginBottom: 12 }}>{item.icon}</div>
                            <Text strong>{item.label}</Text>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Divider />

            <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
                <Col xs={24} md={12}>
                    <Card
                        title={
                            <div>
                                <ClockCircleOutlined style={{ marginRight: 8 }} />
                                Giờ mở cửa
                            </div>
                        }
                        variant='outlined'
                        style={{ borderRadius: 12 }}
                    >
                        <Text strong>Lịch hoạt động:</Text>
                        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                            <li>Thứ 2 - Thứ 6: 07:00 - 22:00</li>
                            <li>Thứ 7 - Chủ nhật: 08:00 - 23:00</li>
                        </ul>

                        <Text strong style={{ display: 'block', marginTop: 12 }}>Lưu ý:</Text>
                        <Paragraph style={{ margin: 0 }}>
                            Đặt chỗ trước cho nhóm trên 6 người. Chúng tôi luôn sẵn sàng phục vụ bạn!
                        </Paragraph>
                    </Card>
                </Col>


                <Col xs={24} md={12}>
                    <Card
                        title={<EnvironmentOutlined style={{ marginRight: 8 }} />}
                        variant='outlined'
                        style={{ borderRadius: 12 }}
                    >
                        <Text strong>Địa chỉ:</Text>
                        <p>123 Tranquil Street, Quận 1, TP. Hồ Chí Minh</p>

                        <Text strong>Liên hệ:</Text>
                        <p><PhoneOutlined /> 0123 456 789</p>
                    </Card>
                </Col>
            </Row>

            <div style={{ marginTop: 40 }}>
                <Title level={4}>Vị trí trên bản đồ</Title>
                <iframe
                    title="Cafe Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.2404132751766!2d105.7849436!3d21.046388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abb158a2305d%3A0x5c357d21c785ea3d!2sElectric%20Power%20University!5e0!3m2!1sen!2s!4v1718800000000!5m2!1sen!2s"
                    width="100%"
                    height="300"
                    style={{ border: 0, borderRadius: 12 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>
        </div>
    );
};

export default AboutCafe;
