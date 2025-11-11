import React from 'react'
import { Form, Input, Button, Space, Upload, Select, InputNumber, Checkbox } from 'antd';
import { CheckOutlined, CloseOutlined, UploadOutlined } from '@ant-design/icons';

const ProductForm = ({ initialValues, onSubmit, onCancel, categories, categoryLoading, discounts, discountLoading }) => {
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        onSubmit(values);
    };
    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={{
                ...initialValues,
                is_active: initialValues?.is_active ?? true
            }}
            onFinish={handleFinish}
        >
            <Form.Item
                name="name"
                label="Tên sản phẩm"
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="price"
                label="Đơn giá"
                rules={[{ required: true, message: 'Vui lòng nhập đơn giá!' }]}
            >
                <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="description"
                label="Mô tả"
            >
                <Input.TextArea rows={4} placeholder="Nhập mô tả sản phẩm..." />
            </Form.Item>

            <Form.Item
                name="is_active"
                valuePropName="checked"
            >
                <Checkbox>Sản phẩm đang hoạt động</Checkbox>
            </Form.Item>

            <Form.Item
                name="image"
                label="Ảnh sản phẩm"
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
                name="categoryId"
                label="Loại sản phẩm"
                rules={[{ required: true, message: 'Vui lòng chọn loại sản phẩm!' }]}
            >
                <Select placeholder="Chọn loại sản phẩm" loading={categoryLoading}>
                    {(categories || []).map(category => (
                        <Select.Option key={category.id} value={category.id}>
                            {category.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="discountId"
                label="Giảm giá"
            >
                <Select placeholder="Chọn giảm giá" allowClear loading={discountLoading}>
                    <Select.Option value={null}>Không áp dụng giảm giá</Select.Option>
                    {(discounts || []).map(discount => (
                        <Select.Option key={discount.id} value={discount.id}>
                            {discount.name}
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

export default ProductForm