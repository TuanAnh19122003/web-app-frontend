import React, { useState } from 'react';
import { Row, Col, Form, Input, Button, Card, Typography, message, Divider } from 'antd';
import { MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { TextArea } = Input;

const Contact = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/contacts`, values);
            if (response.data.success) {
                message.success(response.data.message);
                form.resetFields();
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            message.error('Thao tác thất bại');    
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
                Liên hệ với chúng tôi
            </Title>

            <Row gutter={[32, 32]}>
                <Col xs={24} md={12}>
                    <Card title="Gửi thông tin liên hệ" style={{ border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: 8 }}>
                        <Form
                            layout="vertical"
                            form={form}
                            onFinish={handleSubmit}
                        >
                            <Form.Item
                                name="name"
                                label="Họ và tên"
                                rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                            >
                                <Input placeholder="Nhập họ và tên" />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email' },
                                    { type: 'email', message: 'Email không hợp lệ' }
                                ]}
                            >
                                <Input placeholder="Nhập email" />
                            </Form.Item>

                            <Form.Item
                                name="phone"
                                label="Số điện thoại"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>

                            <Form.Item
                                name="subject"
                                label="Tiêu đề"
                                rules={[{ required: true, message: 'Vuiź nhập tiếu đề' }]}
                            >
                                <Input placeholder="Nhập tiếu đề" />
                            </Form.Item>

                            <Form.Item
                                name="message"
                                label="Nội dung"
                                rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
                            >
                                <TextArea rows={5} placeholder="Nhập nội dung liên hệ..." />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Gửi liên hệ
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card title="Thông tin liên hệ" style={{ border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: 8 }}>
                        <p><HomeOutlined style={{ marginRight: 8 }} /> 123 Đường ABC, Quận 1, TP.HCM</p>
                        <p><PhoneOutlined style={{ marginRight: 8 }} /> 0909 123 456</p>
                        <p><MailOutlined style={{ marginRight: 8 }} /> contact@company.com</p>

                        <Divider />

                        <iframe
                            title="Electric Power University"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.2404132751766!2d105.7849436!3d21.046388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abb158a2305d%3A0x5c357d21c785ea3d!2sElectric%20Power%20University!5e0!3m2!1sen!2s!4v1718800000000!5m2!1sen!2s"
                            width="100%"
                            height="250"
                            style={{ border: 0, borderRadius: 8 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />

                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Contact;
