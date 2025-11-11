import React, { useEffect } from 'react';
import { Form, Input, Button, Space, Select, InputNumber } from 'antd';
import { CheckOutlined, CloseOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const OrderForm = ({
    initialValues = {},
    onSubmit,
    onCancel,
    users,
    userLoading,
    sizes,
    sizeLoading,
    products,
    productLoading
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                items: initialValues.order_item?.map(item => ({
                    productId: item.productId,
                    sizeId: item.sizeId,
                    quantity: item.quantity,
                    price: parseFloat(item.price)
                })) || [],
            });
        }
    }, [initialValues, form]);

    const handleFinish = (values) => {
        onSubmit(values);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={{
                status: initialValues?.status || 'pending',
                note: initialValues?.note || '',
                userId: initialValues?.userId,
                total_price: parseFloat(initialValues?.total_price) || 0,
            }}
            onFinish={handleFinish}
        >
            <Form.Item
                name="userId"
                label="Khách hàng"
                rules={[{ required: true, message: 'Vui lòng chọn khách hàng!' }]}
            >
                <Select placeholder="Chọn khách hàng" loading={userLoading}>
                    {users.map(user => (
                        <Select.Option key={user.id} value={user.id}>
                            {`${user.lastname} ${user.firstname}`}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="total_price"
                label="Tổng tiền"
                rules={[{ required: true, message: 'Vui lòng nhập tổng tiền!' }]}
            >
                <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái đơn hàng!' }]}
            >
                <Select>
                    <Select.Option value="pending">Chờ xử lý</Select.Option>
                    <Select.Option value="paid">Đã thanh toán</Select.Option>
                    <Select.Option value="shipped">Đã giao</Select.Option>
                    <Select.Option value="completed">Hoàn tất</Select.Option>
                    <Select.Option value="cancelled">Đã hủy</Select.Option>
                </Select>
            </Form.Item>

            <Form.List name="items">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                                <Form.Item
                                    {...restField}
                                    name={[name, 'productId']}
                                    rules={[{ required: true, message: 'Chọn sản phẩm' }]}
                                >
                                    <Select placeholder="Sản phẩm" loading={productLoading} style={{ width: 150 }}>
                                        {products.map(p => (
                                            <Select.Option key={p.id} value={p.id}>
                                                {p.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    {...restField}
                                    name={[name, 'sizeId']}
                                    rules={[{ required: true, message: 'Chọn size' }]}
                                >
                                    <Select placeholder="Size" loading={sizeLoading} style={{ width: 120 }}>
                                        {sizes.map(s => (
                                            <Select.Option key={s.id} value={s.id}>
                                                {s.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    {...restField}
                                    name={[name, 'quantity']}
                                    rules={[{ required: true, message: 'Nhập số lượng' }]}
                                >
                                    <InputNumber min={1} placeholder="Số lượng" />
                                </Form.Item>

                                <Form.Item
                                    {...restField}
                                    name={[name, 'price']}
                                    rules={[{ required: true, message: 'Nhập giá' }]}
                                >
                                    <InputNumber min={0} placeholder="Giá" />
                                </Form.Item>

                                <Button danger onClick={() => remove(name)} icon={<DeleteOutlined />} />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                Thêm sản phẩm
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>

            <Form.Item
                name="note"
                label="Ghi chú"
            >
                <Input.TextArea rows={4} placeholder="Nhập ghi chú đơn hàng (nếu có)..." />
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
    );
};

export default OrderForm;
