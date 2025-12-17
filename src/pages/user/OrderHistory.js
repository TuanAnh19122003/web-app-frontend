import React, { useEffect, useState } from 'react';
import { Table, Card, Spin, message } from 'antd';
import axios from 'axios';
import { formatCurrency } from '../../utils/helpers';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const storedUser = localStorage.getItem('user');
                if (!storedUser) {
                    message.error('User không tồn tại');
                    return;
                }

                const user = JSON.parse(storedUser);
                const userId = user.id;

                const res = await axios.get(`${API_URL}/orders/user/${userId}/details`);
                setOrders(res.data.data);
            } catch (error) {
                console.error(error);
                message.error('Lấy lịch sử đơn hàng thất bại');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const columns = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'product',
            key: 'product',
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => price.toLocaleString() + ' VND',
        },
        {
            title: 'Tổng',
            key: 'total',
            render: (_, record) => (record.price * record.quantity).toLocaleString() + ' VND',
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h2>Lịch sử đơn hàng của bạn</h2>
            {loading ? (
                <Spin spinning={true} tip="Đang tải...">
                    <div style={{ minHeight: 200 }}></div>
                </Spin>
            ) : orders.length === 0 ? (
                <p>Bạn chưa có đơn hàng nào.</p>
            ) : (
                orders.map((order) => (
                    <Card
                        key={order.id}
                        title={`Đơn hàng #${order.id} - Trạng thái: ${order.status}`}
                        style={{ marginBottom: '20px' }}
                    >
                        <p><strong>Ngày tạo:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                        <p><strong>Ghi chú:</strong> {order.note || '-'}</p>
                        <p><strong>Địa chỉ giao hàng:</strong> {order.shipping_address}</p>
                        <Table
                            columns={columns}
                            dataSource={order.items.map((item) => ({
                                key: item.id,
                                product: item.product.name,
                                size: item.size.name,
                                quantity: item.quantity,
                                price: item.price,
                            }))}
                            pagination={false}
                        />
                        <h3 style={{ textAlign: 'right', marginTop: '10px' }}>
                            Tổng đơn hàng: {formatCurrency(Number(order.total_price))}
                        </h3>
                    </Card>
                ))
            )}
        </div>
    );
};

export default OrderHistory;
