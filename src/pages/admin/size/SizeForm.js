import React from 'react';
import { Form, Input, Button, Space } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const SizeForm = ({ initialValues, onSubmit, onCancel }) => {
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
                label="Tên Size"
                rules={[{ required: true, message: 'Vui lòng nhập tên size!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="description"
                label="Mô tả"
            >
                <Input.TextArea rows={4} placeholder="Nhập mô tả sản phẩm..." />
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

export default SizeForm