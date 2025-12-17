import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Row, Col, Typography, Button, Image, message,
    Skeleton, Space, Tag
} from 'antd';
import { ArrowLeftOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { CartContext } from './CartContext';

const { Title, Text } = Typography;

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sizes, setSizes] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.REACT_APP_API_URL;
    const { fetchCartCount } = useContext(CartContext);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        axios.get(`${API_URL}/products/with-sizes`)
            .then(res => {
                const productSizes = res.data.data.filter(p => p.product_id === parseInt(id));
                if (productSizes.length > 0) {
                    setSizes(productSizes);
                    setSelectedSize(productSizes[0]);
                } else {
                    message.error('Không tìm thấy sản phẩm.');
                }
            })
            .catch(() => message.error('Lỗi khi tải dữ liệu sản phẩm.'))
            .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const formattedPrice = (price) => Number(price).toLocaleString('vi-VN') + ' đ';

    const handleSizeChange = (sizeId) => {
        const selected = sizes.find(s => s.size_id === sizeId);
        if (selected) setSelectedSize(selected);
    };

    const handleAddToCart = async () => {
        if (!user) {
            message.warning('Vui lòng đăng nhập để thêm vào giỏ hàng');
            return navigate('/auth/login');
        }

        try {
            await axios.post(`${API_URL}/carts/add`, {
                userId: user.id,
                productId: selectedSize.product_id,
                sizeId: selectedSize.size_id,
                quantity: 1
            });

            message.success('Đã thêm vào giỏ hàng');
            fetchCartCount();
        } catch (err) {
            message.error('Lỗi khi thêm vào giỏ hàng');
        }
    };

    if (loading) return <Skeleton active />;
    if (!selectedSize) return null;

    return (
        <div style={{ padding: 24 }}>
            <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                style={{ marginBottom: 16 }}
            >
                Quay lại
            </Button>

            <Row gutter={[32, 32]}>
                <Col xs={24} md={10}>
                    <div
                        style={{
                            width: '100%',
                            height: 375,
                            borderRadius: 8,
                            backgroundColor: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                        }}
                    >
                        {selectedSize.image ? (
                            <Image
                                src={`${selectedSize.image}`}
                                alt={selectedSize.product_name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        ) : (
                            <div style={{ color: '#999' }}>Không có hình ảnh</div>
                        )}
                    </div>
                </Col>


                <Col xs={24} md={14}>
                    <Title level={2}>{selectedSize.product_name}</Title>

                    <div style={{ marginBottom: 20 }}>
                        <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 6 }}>
                            Mô tả:
                        </Text>
                        <Text style={{ fontSize: 15, color: '#595959', lineHeight: 1.6 }}>
                            {selectedSize.description}
                        </Text>
                    </div>


                    <div style={{ marginBottom: 12 }}>
                        <Text type="secondary">Danh mục:</Text>{' '}
                        <Tag color="blue">{selectedSize.category_name}</Tag>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                        <Text type="secondary">Chọn size:</Text>
                        <div style={{ marginTop: 8 }}>
                            <Space>
                                {sizes.map(size => (
                                    <Button
                                        key={size.size_id}
                                        type={selectedSize.size_id === size.size_id ? 'primary' : 'default'}
                                        onClick={() => handleSizeChange(size.size_id)}
                                    >
                                        {size.size_name}
                                    </Button>
                                ))}
                            </Space>
                        </div>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        {parseFloat(selectedSize.final_price) < parseFloat(selectedSize.price_with_additional) ? (
                            <>
                                <Text delete type="secondary" style={{ marginRight: 12, fontSize: 18 }}>
                                    {formattedPrice(selectedSize.price_with_additional)}
                                </Text>
                                <Text strong style={{ color: 'red', fontSize: 22 }}>
                                    {formattedPrice(selectedSize.final_price)}
                                </Text>
                            </>
                        ) : (
                            <Text strong style={{ color: 'green', fontSize: 22 }}>
                                {formattedPrice(selectedSize.final_price)}
                            </Text>
                        )}
                    </div>

                    <Button type="primary" icon={<ShoppingCartOutlined />} size="large" onClick={handleAddToCart}>
                        Thêm vào giỏ hàng
                    </Button>
                </Col>

            </Row>
        </div>
    );
};

export default ProductDetail;
