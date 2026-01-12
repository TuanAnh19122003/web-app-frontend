/* eslint-disable no-dupe-keys */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Row,
    Col,
    Card,
    Button,
    Typography,
    message,
    Menu,
    Empty,
    Image,
    Pagination
} from 'antd';
import { ShoppingCartOutlined, PictureOutlined } from '@ant-design/icons'; // Thêm icon ảnh
import { formatCurrency } from '../../utils/helpers';
import { CartContext } from './CartContext';

const { Title, Text } = Typography;
const { Meta } = Card;

const ProductList = () => {
    // ... (Giữ nguyên các state và useEffect cũ)
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const { fetchCartCount } = useContext(CartContext);

    const pageSize = 8;
    const API_URL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_URL}/categories`)
            .then(res => setCategories(res.data.data))
            .catch(() => message.error('Không tải được danh mục'));
    }, []);

    useEffect(() => {
        axios.get(`${API_URL}/products/with-sizes`)
            .then(res => {
                const filtered = res.data.data.filter(p => p.size_name === 'S');
                setProducts(filtered);
            })
            .catch(() => message.error('Lỗi khi tải sản phẩm'));
    }, []);

    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(p => p.category_name === selectedCategory);

    const paginatedProducts = selectedCategory === 'all'
        ? filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        : filteredProducts;

    const handleAddToCart = async (product) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user?.id;

            if (!userId) {
                message.error('Bạn cần đăng nhập để thêm sản phẩm');
                navigate('/auth/login');
                return;
            }

            const payload = {
                userId,
                productId: product.product_id,
                sizeId: product.size_id,
                quantity: 1
            };

            const response = await axios.post(`${API_URL}/carts/add`, payload);

            if (response.status === 200) {
                message.success('Đã thêm sản phẩm vào giỏ hàng');
                fetchCartCount();
            }
        } catch (error) {
            console.error('Lỗi thêm giỏ hàng:', error);
            message.error('Thêm vào giỏ hàng thất bại');
        }
    };

    // Hàm render ảnh hoặc hình xám
    const renderProductImage = (product) => {
        const commonStyle = {
            height: 200,
            width: '100%',
            objectFit: 'cover',
            filter: product.is_active === 0 ? 'grayscale(1)' : 'none',
        };

        if (product.image && product.image.trim() !== "") {
            return (
                <Image
                    alt={product.product_name}
                    src={product.image}
                    style={commonStyle}
                    preview={false}
                    // Nếu link ảnh lỗi (404), fallback sang hình xám
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8+R8AAnkB9X90W7EAAAAASUVORK5CYII="
                />
            );
        }

        // Trả về khối màu xám đại diện khi không có dữ liệu ảnh
        return (
            <div style={{
                ...commonStyle,
                backgroundColor: '#e8e8e8',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#bfbfbf'
            }}>
                <PictureOutlined style={{ fontSize: 40, marginBottom: 8 }} />
                <Text type="secondary" style={{ fontSize: 12 }}>No Image</Text>
            </div>
        );
    };

    return (
        <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '150vh' }}>
            <Row gutter={24} align="start">
                {/* SIDEBAR DANH MỤC */}
                <Col xs={24} md={5}>
                    <Card
                        title="Danh mục"
                        style={{
                            border: 'none',
                            boxShadow: 'none',
                            position: 'sticky',
                            top: 24,
                            background: '#fff',
                        }}
                    >
                        <Menu
                            mode="inline"
                            selectedKeys={[selectedCategory]}
                            onClick={({ key }) => {
                                setSelectedCategory(key);
                                setCurrentPage(1);
                            }}
                            items={[
                                { key: 'all', label: 'Tất cả sản phẩm' },
                                ...categories.map(cat => ({
                                    key: cat.name,
                                    label: cat.name,
                                })),
                            ]}
                        />
                    </Card>
                </Col>

                {/* DANH SÁCH SẢN PHẨM */}
                <Col xs={24} md={19}>
                    <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
                        Danh sách sản phẩm
                    </Title>

                    <Row gutter={[24, 24]}>
                        {paginatedProducts.length === 0 ? (
                            <Col span={24}><Empty description="Không có sản phẩm nào" /></Col>
                        ) : (
                            paginatedProducts.map(product => {
                                const finalPrice = parseFloat(product.final_price);
                                const originalPrice = parseFloat(product.price_with_additional);
                                const isDiscountActive = finalPrice < originalPrice;

                                return (
                                    <Col key={`${product.product_id}-${product.size_id}`} xs={24} sm={12} lg={6}>
                                        <Card
                                            hoverable
                                            style={{
                                                position: 'relative',
                                                overflow: 'hidden',
                                                backgroundColor: product.is_active === 0 ? '#fafafa' : '#fff',
                                            }}
                                            cover={renderProductImage(product)}
                                            actions={[
                                                <Button
                                                    type="primary"
                                                    icon={<ShoppingCartOutlined />}
                                                    disabled={product.is_active === 0}
                                                    onClick={() => handleAddToCart(product)}
                                                >
                                                    Thêm giỏ
                                                </Button>,
                                                <Button onClick={() => navigate(`/product/${product.product_id}`)}>
                                                    Chi tiết
                                                </Button>
                                            ]}
                                        >
                                            {/* Overlay Ngừng bán */}
                                            {product.is_active === 0 && (
                                                <div style={{
                                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                                    backgroundColor: 'rgba(255,255,255,0.4)', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center', zIndex: 1, pointerEvents: 'none'
                                                }}>
                                                    <Text strong style={{ fontSize: 18, color: 'red', transform: 'rotate(-15deg)', border: '2px solid red', padding: '4px 8px' }}>
                                                        HẾT HÀNG
                                                    </Text>
                                                </div>
                                            )}

                                            <Meta
                                                title={<Text strong ellipsis={{ tooltip: product.product_name }}>{product.product_name}</Text>}
                                                description={
                                                    <div style={{ marginTop: 8 }}>
                                                        {isDiscountActive ? (
                                                            <>
                                                                <Text delete type="secondary" style={{ fontSize: 12, marginRight: 4 }}>
                                                                    {formatCurrency(originalPrice)}
                                                                </Text>
                                                                <Text strong style={{ color: '#ff4d4f', fontSize: 15 }}>
                                                                    {formatCurrency(finalPrice)}
                                                                </Text>
                                                            </>
                                                        ) : (
                                                            <Text strong style={{ color: '#52c41a', fontSize: 15 }}>
                                                                {formatCurrency(finalPrice)}
                                                            </Text>
                                                        )}
                                                    </div>
                                                }
                                            />
                                        </Card>
                                    </Col>
                                );
                            })
                        )}
                    </Row>

                    {selectedCategory === 'all' && filteredProducts.length > pageSize && (
                        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center' }}>
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={filteredProducts.length}
                                onChange={setCurrentPage}
                                showSizeChanger={false}
                            />
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default ProductList;