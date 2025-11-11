import React from 'react';
import { Form, Button, Space, InputNumber, Select } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const ProductSizeForm = ({ initialValues, onSubmit, onCancel, products, productLoading, sizes, sizeLoading }) => {
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
                name="productId"
                label="Loại sản phẩm"
                rules={[{ required: true, message: 'Vui lòng chọn sản phẩm!' }]}
            >
                <Select placeholder="Chọn sản phẩm" loading={productLoading}>
                    {(products || []).map(product => (
                        <Select.Option key={product.id} value={product.id}>
                            {product.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="sizeId"
                label="Size"
                rules={[{ required: true, message: 'Vuiź chọn size!' }]}
            >
                <Select placeholder="Chọn size" loading={sizeLoading}>
                    {(sizes || []).map(size => (
                        <Select.Option key={size.id} value={size.id}>
                            {size.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="additional_price"
                label="giá bổ sung"
                rules={[{ required: true, message: 'Vui nhập giá bổ sung!' }]}
            >
                <InputNumber min={0} style={{ width: '100%' }} />
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

export default ProductSizeForm