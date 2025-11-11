import React from 'react'
import { Form, Input, Button, Space, Upload, Select, Checkbox } from 'antd';
import { CheckOutlined, CloseOutlined, UploadOutlined } from '@ant-design/icons';

const UserForm = ({ initialValues, onSubmit, onCancel, roles, roleLoading }) => {
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        onSubmit(values);
    };
    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={initialValues || {}}
            onFinish={handleFinish}
        >
            <Form.Item
                name="lastname"
                label="Họ"
                rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="firstname"
                label="Tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="email"
                label="Email"
                rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    {
                        validator: (_, value) => {
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (!value || emailRegex.test(value)) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Email không hợp lệ!'));
                        }
                    }
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="is_active"
                valuePropName="checked"
            >
                <Checkbox>Tài khoản đang hoạt động</Checkbox>
            </Form.Item>

            <Form.Item
                name="image"
                label="Ảnh đại diện"
                valuePropName="file"
                getValueFromEvent={(e) => {
                    if (Array.isArray(e)) return e;
                    return e?.fileList;
                }}
            >
                <Upload
                    name="image"
                    listType="picture"
                    beforeUpload={() => false}
                    maxCount={1}
                >
                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                </Upload>
            </Form.Item>

            <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui nhập số điện thoại!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="roleId"
                label="Vai trò"
                rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
            >
                <Select placeholder="Chọn vai trò" loading={roleLoading}>
                    {roles.map(role => (
                        <Select.Option key={role.id} value={role.id}>
                            {role.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>


            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit" icon={<CheckOutlined />}>
                        Lưu
                    </Button>
                    <Button onClick={onCancel} icon={<CloseOutlined />}>
                        Hủy
                    </Button>
                </Space>
            </Form.Item>
        </Form>

    )
}

export default UserForm