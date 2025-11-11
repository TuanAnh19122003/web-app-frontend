import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Table, Button, InputNumber, Typography, message, Popconfirm, Empty, Image } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { formatCurrency } from '../../utils/helpers';
import { CartContext } from './CartContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const API_URL = 'http://localhost:5000';


const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;
    const { fetchCartCount } = useContext(CartContext);
    const navigate = useNavigate();

    const fetchCart = async () => {
        if (!userId) return message.warning('Bạn cần đăng nhập để xem giỏ hàng');
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/api/carts/${userId}`);
            setCartItems(res.data.data);
            fetchCartCount();
        } catch (err) {
            message.error('Không thể tải giỏ hàng');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleQuantityChange = async (value, cartItemId) => {
        try {
            await axios.put(`${API_URL}/api/carts/update`, {
                cartItemId,
                quantity: value
            });
            message.success('Đã cập nhật số lượng');
            fetchCart();
        } catch {
            message.error('Lỗi khi cập nhật số lượng');
        }
    };

    const handleRemove = async (cartItemId) => {
        try {
            await axios.delete(`${API_URL}/api/carts/remove`, {
                data: { cartItemId }
            });
            message.success('Đã xóa sản phẩm');
            fetchCart();
        } catch {
            message.error('Lỗi khi xóa sản phẩm');
        }
    };

    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'product',
            render: (product, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Image
                        src={`${API_URL}/${product.image}`}
                        alt={product.name}
                        width={60}
                        height={60}
                        style={{ objectFit: 'cover', borderRadius: 4 }}
                    />
                    <div>
                        <Text strong>{product.name}</Text>
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
            dataIndex: 'quantity',
            render: (quantity, record) => (
                <InputNumber
                    min={1}
                    max={99}
                    value={quantity}
                    onChange={(value) => handleQuantityChange(value, record.id)}
                />
            )
        },
        {
            title: 'Tổng',
            render: (_, record) => formatCurrency(record.price * record.quantity)
        },
        {
            title: '',
            render: (_, record) => (
                <Popconfirm
                    title="Bạn có chắc muốn xóa sản phẩm này?"
                    onConfirm={() => handleRemove(record.id)}
                    okText="Xóa"
                    cancelText="Hủy"
                >
                    <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>
            )
        }
    ];

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div style={{ padding: 24 }}>
            <Title level={2}>Giỏ hàng của bạn</Title>

            {cartItems.length === 0 ? (
                <Empty description="Giỏ hàng trống" />
            ) : (
                <>
                    <Table
                        dataSource={cartItems}
                        columns={columns}
                        rowKey="id"
                        loading={loading}
                        pagination={false}
                    />
                    <div style={{ marginTop: 24, textAlign: 'right' }}>
                        <Title level={4}>Tổng cộng: {formatCurrency(totalAmount)}</Title>
                        <Button
                            type="primary"
                            size="large"
                            style={{ marginTop: 8 }}
                            onClick={() => navigate('/order')}
                        >
                            Tiến hành đặt hàng
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;
