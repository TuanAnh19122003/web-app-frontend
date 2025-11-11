import React from 'react';
import { Form, Input, Button, Space, InputNumber, DatePicker } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const DiscountForm = ({ initialValues, onSubmit, onCancel }) => {
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        onSubmit(values);
    };
    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={{
                ...(initialValues || {}),
                percentage: initialValues?.percentage ? Number(initialValues.percentage) : undefined,
                start_date: initialValues?.start_date ? dayjs(initialValues.start_date) : null,
                end_date: initialValues?.end_date ? dayjs(initialValues.end_date) : null,
            }}
            onFinish={handleFinish}
        >

            <Form.Item
                name="name"
                label="Tên chương trình giảm giá"
                rules={[{ required: true, message: 'Vui lòng nhập tên chương trình!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="description"
                label="Mô tả"
            >
                <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item
                name="percentage"
                label="Phần trăm giảm giá (%)"
                rules={[
                    {
                        required: true,
                        type: 'number',
                        message: 'Vui lòng nhập phần trăm giảm giá!',
                    },
                    {
                        type: 'number',
                        min: 0.01,
                        max: 100,
                        message: 'Giá trị phải từ 0.01 đến 100',
                    }
                ]}
            >
                <InputNumber
                    addonAfter="%"
                    style={{ width: '100%' }}
                    step={0.01}
                    min={0.01}
                    max={100}
                />
            </Form.Item>

            <Form.Item
                name="start_date"
                label="Ngày bắt đầu"
                rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
            >
                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="end_date"
                label="Ngày kết thúc"
                rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
            >
                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
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

export default DiscountForm