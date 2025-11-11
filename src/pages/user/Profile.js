import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, message, Card, Typography, Avatar, Row, Col } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import normalizeFileName from '../../utils/normalizeFileName';

const { Title } = Typography;

const Profile = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [userData, setUserData] = useState({});
    const [file, setFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL;
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        // Kiểm tra token tồn tại
        const token = localStorage.getItem('token');
        if (!token) {
            message.warning('Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.');
            navigate('/auth/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (storedUser && storedUser.id && !userData.id) {
            form.setFieldsValue({
                firstname: storedUser.firstname,
                lastname: storedUser.lastname,
                email: storedUser.email,
                phone: storedUser.phone,
            });
            setUserData(storedUser);
        }
    }, [form, userData, storedUser]);

    const handleUploadChange = ({ fileList }) => {
        const rawFile = fileList?.[0]?.originFileObj;

        if (!rawFile || !(rawFile instanceof Blob)) {
            message.error('Tệp không hợp lệ hoặc không được chọn đúng cách!');
            return;
        }

        const newFileName = normalizeFileName(rawFile.name);

        const renamedFile = new File([rawFile], newFileName, {
            type: rawFile.type,
            lastModified: rawFile.lastModified,
        });

        setFile(renamedFile);

        const reader = new FileReader();
        reader.onload = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(renamedFile);
    };

    const onFinish = async (values) => {
        setLoading(true);
        const formData = new FormData();

        Object.keys(values).forEach((key) => {
            if (key === 'password' && !values[key]) return;
            formData.append(key, values[key]);
        });

        if (file) {
            formData.append('image', file);
        }

        try {
            const res = await axios.put(`${API_URL}/users/${storedUser.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            message.success(res.data.message || 'Cập nhật thành công');

            // Giữ nguyên role nếu API không trả về
            const updatedUser = {
                ...res.data.data,
                role: storedUser.role || res.data.data.role,
            };

            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUserData(updatedUser);
            setPreviewImage(null);
            setFile(null);
            setIsEditing(false);

            // Event để UserLayout cập nhật avatar
            window.dispatchEvent(new Event('userUpdated'));
        } catch (error) {
            message.error(error?.response?.data?.message || 'Cập nhật thất bại');
        } finally {
            setLoading(false);
        }

    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
            <Card title={<Title level={4}>Thông tin cá nhân</Title>} style={{ width: 700 }}>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={24}>
                        <Col span={8} style={{ textAlign: 'center' }}>
                            {(previewImage || userData.image) ? (
                                <img
                                    src={previewImage || `http://localhost:5000/${userData.image}`}
                                    alt="avatar"
                                    style={{
                                        width: '100%',
                                        borderRadius: 12,
                                        objectFit: 'cover',
                                        aspectRatio: '1 / 1',
                                        marginBottom: 16,
                                        height: 320,
                                    }}
                                />
                            ) : (
                                <Avatar
                                    size={120}
                                    icon={<UserOutlined />}
                                    style={{ width: '100%', height: 'auto', marginBottom: 16 }}
                                />
                            )}

                            {isEditing && (
                                <Upload
                                    showUploadList={false}
                                    beforeUpload={() => false}
                                    onChange={handleUploadChange}
                                    accept="image/*"
                                    maxCount={1}
                                >
                                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                                </Upload>
                            )}
                        </Col>

                        <Col span={16}>
                            <Form.Item
                                label="Họ"
                                name="lastname"
                                rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
                            >
                                <Input disabled={!isEditing} />
                            </Form.Item>

                            <Form.Item
                                label="Tên"
                                name="firstname"
                                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                            >
                                <Input disabled={!isEditing} />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{ required: true, type: 'email' }]}
                            >
                                <Input disabled />
                            </Form.Item>

                            <Form.Item
                                label="Số điện thoại"
                                name="phone"
                                rules={[{ required: true }]}
                            >
                                <Input disabled={!isEditing} />
                            </Form.Item>

                            {isEditing && (
                                <Form.Item label="Mật khẩu mới" name="password">
                                    <Input.Password placeholder="Để trống nếu không thay đổi" />
                                </Form.Item>
                            )}
                        </Col>
                    </Row>

                    <Form.Item style={{ textAlign: 'right' }}>
                        {isEditing ? (
                            <>
                                <Button
                                    onClick={() => {
                                        setIsEditing(false);
                                        form.setFieldsValue({
                                            firstname: userData.firstname,
                                            lastname: userData.lastname,
                                            email: userData.email,
                                            phone: userData.phone,
                                        });
                                        setPreviewImage(null);
                                        setFile(null);
                                    }}
                                    style={{ marginRight: 8 }}
                                >
                                    Hủy
                                </Button>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Lưu
                                </Button>
                            </>
                        ) : (
                            <Button type="primary" onClick={() => setIsEditing(true)}>
                                Chỉnh sửa
                            </Button>
                        )}
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Profile;
