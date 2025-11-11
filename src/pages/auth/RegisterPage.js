import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Card } from 'antd';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const { Title } = Typography;

const RegisterPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, values);
            if (res.data.success) {
                message.success('Đăng ký thành công');
                navigate('/auth/login');
            } else {
                message.error(res.data.message || 'Đăng ký thất bại');
            }
        } catch (error) {
            console.error(error);
            message.error('Đăng ký thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#f0f2f5',

        }}>
            <Card style={{ width: 420 }}>
                <Title level={3} style={{ textAlign: 'center' }}>Đăng ký</Title>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Họ"
                        name="lastname"
                        rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Tên"
                        name="firstname"
                        rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            { type: 'email', message: 'Email không hợp lệ' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Nhập lại mật khẩu"
                        name="password_confirmation"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Vui lòng nhập lại mật khẩu' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu không khớp'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Đăng ký
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center' }}>
                        <span>Đã có tài khoản? </span>
                        <Link to="/auth/login">Đăng nhập</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default RegisterPage;
