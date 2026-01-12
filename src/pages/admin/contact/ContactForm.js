import React from 'react';
import { Form, Input, Button, Space } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';


const ContactForm = ({ initialValues, onSubmit, onCancel }) => {
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
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="email"
                label="Email"
                rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="subject"
                label="Tiêu đề"
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="message"
                label="Nội dung liên hệ"
                rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
            >
                <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit" icon={<CheckOutlined />}>
                        Gửi
                    </Button>
                    <Button onClick={onCancel} icon={<CloseOutlined />}>
                        Hủy
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    )
}

export default ContactForm