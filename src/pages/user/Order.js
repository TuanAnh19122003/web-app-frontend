import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {
    Table,
    Button,
    Typography,
    message,
    Empty,
    Input,
    Radio,
    Form,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/helpers';
import { CartContext } from './CartContext';
import AddressModal from '../../components/AddressModal';

const { Title } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

const Order = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;
    const { fetchCartCount } = useContext(CartContext);
    const [modalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setFirstName(user.firstname || '');
            setLastName(user.lastname || '');
            setPhone(user.phone || '');
        }
        fetchCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchCart = async () => {
        if (!userId) {
            message.warning('Bạn cần đăng nhập');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/carts/${userId}`);

            const items = Array.isArray(res.data?.data?.items)
                ? res.data.data.items
                : [];

            setCartItems(items);
        } catch (err) {
            console.error(err);
            message.error('Không thể tải giỏ hàng');
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };


    const handleConfirmOrder = async () => {
        if (!address || !phone) {
            return message.warning('Vui lòng nhập đầy đủ thông tin giao hàng');
        }

        try {
            const items = cartItems.map(item => ({
                productId: item.productId,
                sizeId: item.sizeId,
                quantity: item.quantity,
                price: item.price
            }));

            const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

            const res = await axios.post(`${API_URL}/orders`, {
                userId,
                items,
                totalPrice,
                note: '',
                shipping_address: address,
                paymentMethod: paymentMethod.toLowerCase()
            });

            if (paymentMethod === 'paypal' && res.data.approveUrl) {
                return window.location.href = res.data.approveUrl;
            }

            await axios.delete(`${API_URL}/carts/clear/${userId}`);
            fetchCartCount();
            message.success('Đặt hàng thành công!');
            navigate('/payment-success');
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi đặt hàng');
        }
    };


    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'product',
            render: (product, record) => (
                <div>
                    <strong>{product.name}</strong>
                    <div>Size: {record.size?.name}</div>
                </div>
            )
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            render: price => formatCurrency(Number(price))
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity'
        },
        {
            title: 'Tổng',
            render: (_, record) => formatCurrency(record.price * record.quantity)
        }
    ];

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div style={{ padding: 24 }}>
            <Title level={2}>Xác nhận đơn hàng</Title>
            {cartItems.length === 0 ? (
                <Empty description="Không có sản phẩm trong giỏ hàng" />
            ) : (
                <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
                    <div style={{ flex: 2 }}>
                        <Table
                            dataSource={cartItems}
                            columns={columns}
                            rowKey="id"
                            pagination={false}
                        />
                    </div>

                    <div style={{ flex: 1 }}>
                        <Title level={4}>Thông tin giao hàng</Title>
                        <Form layout="vertical">
                            <Form.Item label="Họ và tên">
                                <Input
                                    value={`${lastname} ${firstname}`}
                                    onChange={e => {
                                        const parts = e.target.value.trim().split(' ');
                                        setLastName(parts[0] || '');
                                        setFirstName(parts.slice(1).join(' ') || '');
                                    }}
                                    placeholder="Nhập họ và tên"
                                />
                            </Form.Item>

                            <Form.Item label="Số điện thoại">
                                <Input
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    placeholder="Nhập số điện thoại"
                                />
                            </Form.Item>
                            <Form layout="vertical">
                                <Form.Item label="Địa chỉ giao hàng">
                                    <Input
                                        placeholder="Chọn địa chỉ"
                                        value={address}
                                        readOnly
                                        onClick={() => setModalVisible(true)}
                                    />
                                </Form.Item>

                                <AddressModal
                                    visible={modalVisible}
                                    onClose={() => setModalVisible(false)}
                                    onConfirm={setAddress}
                                />
                            </Form>

                            <Form.Item label="Phương thức thanh toán">
                                <Radio.Group
                                    onChange={e => setPaymentMethod(e.target.value)}
                                    value={paymentMethod}
                                >
                                    <Radio value="COD">Thanh toán khi nhận hàng (COD)</Radio>
                                    <Radio value="paypal">Thanh toán qua PayPal</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Form>

                        <div style={{ textAlign: 'right', marginTop: 24 }}>
                            <Title level={5}>Tổng cộng: {formatCurrency(totalAmount)}</Title>
                            <Button
                                type="primary"
                                size="large"
                                onClick={handleConfirmOrder}
                                loading={loading}
                                style={{ marginTop: 12 }}
                                block
                            >
                                Xác nhận đặt hàng
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Order;
