import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Table, Button, InputNumber, Typography, message, Popconfirm, Empty, Image } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { formatCurrency } from '../../utils/helpers';
import { CartContext } from './CartContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;
    const { fetchCartCount } = useContext(CartContext);
    const navigate = useNavigate();

    const fetchCart = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/carts/${userId}`);
            const items = res.data?.data?.items || [];
            setCartItems(items);
            fetchCartCount();
        } catch (err) {
            message.error('Không thể tải giỏ hàng');
        } finally {
            setLoading(false);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchCart(); }, []);

    const handleQuantityChange = async (value, cartItemId) => {
        if (!value || value < 1) return;

        // Lưu bản cũ để đề phòng lỗi thì rollback
        const previousItems = [...cartItems];

        // Cập nhật UI ngay lập tức (Chống nhảy dòng)
        setCartItems(prev => prev.map(item =>
            item.id === cartItemId ? { ...item, quantity: value } : item
        ));

        try {
            await axios.put(`${API_URL}/carts/update`, { cartItemId, quantity: value });
            fetchCartCount(); // Chỉ cập nhật số tổng trên Header
        } catch (err) {
            message.error('Lỗi cập nhật số lượng');
            setCartItems(previousItems); // Rollback nếu lỗi server
        }
    };

    const handleRemove = async (cartItemId) => {
        try {
            await axios.delete(`${API_URL}/carts/remove`, { data: { cartItemId } });
            message.success('Đã xóa sản phẩm');
            fetchCart(); // Load lại toàn bộ sau khi xóa
        } catch {
            message.error('Lỗi khi xóa sản phẩm');
        }
    };

    const columns = [
        {
            title: 'Sản phẩm',
            render: (_, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Image src={record.product?.image} width={60} height={60} style={{ objectFit: 'cover' }} />
                    <div>
                        <Text strong>{record.product?.name}</Text>
                        <div><Text type="secondary">Size: {record.size?.name || 'N/A'}</Text></div>
                    </div>
                </div>
            )
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            render: (price) => formatCurrency(Number(price))
        },
        {
            title: 'Số lượng',
            render: (_, record) => (
                <InputNumber
                    min={1}
                    max={99}
                    value={record.quantity}
                    onChange={(val) => handleQuantityChange(val, record.id)}
                />
            )
        },
        {
            title: 'Tổng',
            render: (_, record) => formatCurrency(record.price * record.quantity)
        },
        {
            title: 'Hành động',
            render: (_, record) => (
                <Popconfirm title="Xóa sản phẩm này?" onConfirm={() => handleRemove(record.id)}>
                    <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>
            )
        }
    ];

    const totalAmount = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    return (
        <div style={{ padding: 24 }}>
            <Title level={2}>Giỏ hàng của bạn</Title>
            {cartItems.length === 0 ? <Empty description="Giỏ hàng trống" /> : (
                <>
                    <Table
                        dataSource={cartItems}
                        columns={columns}
                        // rowKey cực kỳ quan trọng: Phải dùng ID duy nhất của dòng
                        rowKey={(record) => `cart-item-${record.id}`}
                        loading={loading}
                        pagination={false}
                    />
                    <div style={{ marginTop: 24, textAlign: 'right' }}>
                        <Title level={4}>Tổng cộng: {formatCurrency(totalAmount)}</Title>
                        <Button type="primary" size="large" onClick={() => navigate('/order')}>
                            Tiến hành đặt hàng
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;