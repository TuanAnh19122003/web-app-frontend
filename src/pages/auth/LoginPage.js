import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message, Card, Checkbox } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        const savedLogin = localStorage.getItem('rememberedLogin');
        if (savedLogin) {
            const parsed = JSON.parse(savedLogin);
            form.setFieldsValue({
                email: parsed.email,
                password: parsed.password,
                remember: true
            });
        }
    }, [form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, values);
            const { success, message: msg, token, user } = response.data;

            if (!success) {
                message.error(msg || 'Đăng nhập thất bại!');
                return;
            }

            message.success(msg || 'Đăng nhập thành công!???');
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            if (values.remember) {
                localStorage.setItem('rememberedLogin', JSON.stringify({
                    email: values.email,
                    password: values.password
                }));
            } else {
                localStorage.removeItem('rememberedLogin');
            }

            setTimeout(() => {
                if (user.role?.name?.toLowerCase() === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }, 1000);

        } catch (error) {
            const errMsg = error?.response?.data?.message || 'Đăng nhập thất bại!';
            message.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#f0f2f5'
        }}>
            <Card style={{ width: 380 }}>
                <Title level={3} style={{ textAlign: 'center' }}>Đăng nhập</Title>
                <Form form={form} layout="vertical" onFinish={onFinish} >
                    <Form.Item
                        label="Email hoặc tên đăng nhập"
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập email hoặc tên đăng nhập' }]}
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

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Nhớ mật khẩu</Checkbox>
                        </Form.Item>
                        <Link to="/">Quên mật khẩu?</Link>
                    </div>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: 'center' }}>
                    <Text>Bạn chưa có tài khoản? </Text>
                    <Link to="/auth/register">Đăng ký ngay</Link>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;
