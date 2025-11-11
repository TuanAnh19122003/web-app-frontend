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
import { ShoppingCartOutlined } from '@ant-design/icons';
import { formatCurrency } from '../../utils/helpers';
import { CartContext } from './CartContext';

const { Title, Text } = Typography;
const { Meta } = Card;

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const { fetchCartCount } = useContext(CartContext);

    const pageSize = 8;
    const API_URL = 'http://localhost:5000';
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_URL}/api/categories`)
            .then(res => setCategories(res.data.data))
            .catch(() => message.error('Không tải được danh mục'));
    }, []);

    useEffect(() => {
        axios.get(`${API_URL}/api/products/with-sizes`)
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

            const response = await axios.post(`${API_URL}/api/carts/add`, payload);

            if (response.status === 200) {
                message.success('Đã thêm sản phẩm vào giỏ hàng');
                fetchCartCount();
            }
        } catch (error) {
            console.error('Lỗi thêm giỏ hàng:', error);
            message.error('Thêm vào giỏ hàng thất bại');
        }
    };

    return (
        <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '150vh' }}>
            <Row gutter={24} align="start">
                <Col xs={24} md={5}>
                    <Card
                        title="Danh mục"
                        style={{
                            border: 'none',
                            boxShadow: 'none',
                            height: '100%',
                            minHeight: 'calc(100vh - 100px)',
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
                <Col xs={24} md={19} style={{ display: 'flex', flexDirection: 'column', minHeight: '80vh' }}>
                    <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
                        Danh sách sản phẩm
                    </Title>

                    <div style={{ flexGrow: 1 }}>
                        <Row gutter={[24, 24]}>
                            {paginatedProducts.length === 0 ? (
                                <Col span={24}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '300px'
                                    }}>
                                        <Empty description="Không có sản phẩm nào trong danh mục này" />
                                    </div>
                                </Col>
                            ) : (
                                paginatedProducts.map(product => {
                                    const finalPrice = parseFloat(product.final_price);
                                    const originalPrice = parseFloat(product.price_with_additional);
                                    const isDiscountActive = finalPrice < originalPrice;

                                    const formattedFinalPrice = formatCurrency(Number(finalPrice));
                                    const formattedOldPrice = formatCurrency(Number(originalPrice));

                                    return (
                                        <Col
                                            key={product.product_id + '-' + product.size_id}
                                            xs={24}
                                            sm={12}
                                            md={12}
                                            lg={6}
                                        >
                                            <Card
                                                hoverable
                                                style={{
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    backgroundColor: product.is_active === 0 ? '#f0f0f0' : '#fff',
                                                }}
                                                cover={
                                                    product.image ? (
                                                        <Image
                                                            alt={product.product_name}
                                                            src={`${API_URL}/${product.image}`}
                                                            style={{
                                                                height: 200,
                                                                objectFit: 'cover',
                                                                filter: product.is_active === 0 ? 'grayscale(1)' : 'none'
                                                            }}
                                                            preview={false}
                                                        />
                                                    ) : (
                                                        <div
                                                            style={{
                                                                height: 200,
                                                                backgroundColor: '#eee',
                                                                backgroundImage: 'url("/default-image.jpg")',
                                                                backgroundSize: 'cover',
                                                                backgroundPosition: 'center',
                                                                borderRadius: '8px',
                                                                filter: product.is_active === 0 ? 'grayscale(1)' : 'none',
                                                            }}
                                                        />
                                                    )
                                                }
                                                actions={[
                                                    <Button
                                                        type="primary"
                                                        icon={<ShoppingCartOutlined />}
                                                        disabled={product.is_active === 0}
                                                        onClick={() => handleAddToCart(product)}
                                                    >
                                                        Thêm giỏ
                                                    </Button>,
                                                    <Button
                                                        type="default"
                                                        onClick={() => navigate(`/product/${product.product_id}`)}
                                                    >
                                                        Xem chi tiết
                                                    </Button>
                                                ]}
                                            >
                                                {/* Overlay chữ "Ngừng bán" */}
                                                {product.is_active === 0 && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        backgroundColor: 'rgba(255,255,255,0.6)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        zIndex: 1
                                                    }}>
                                                        <Text strong style={{ fontSize: 20, color: 'red' }}>
                                                            Ngừng bán
                                                        </Text>
                                                    </div>
                                                )}

                                                {/* Nội dung chính */}
                                                <Meta
                                                    title={
                                                        <Text
                                                            strong
                                                            style={{
                                                                display: 'block',
                                                                fontSize: 14,
                                                                lineHeight: '1.4',
                                                                minHeight: 40,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                                opacity: product.is_active === 0 ? 0.5 : 1
                                                            }}
                                                        >
                                                            {product.product_name}
                                                        </Text>
                                                    }
                                                    description={
                                                        <div style={{
                                                            marginTop: 8,
                                                            opacity: product.is_active === 0 ? 0.5 : 1
                                                        }}>
                                                            {isDiscountActive ? (
                                                                <>
                                                                    <Text delete type="secondary" style={{ marginRight: 8 }}>
                                                                        {formattedOldPrice}
                                                                    </Text>
                                                                    <Text strong style={{ color: 'red', fontSize: 16 }}>
                                                                        {formattedFinalPrice}
                                                                    </Text>
                                                                </>
                                                            ) : (
                                                                <Text strong style={{ color: 'green', fontSize: 16 }}>
                                                                    {formattedFinalPrice}
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
                    </div>

                    {selectedCategory === 'all' && (
                        <div style={{
                            marginTop: 32,
                            display: 'flex',
                            justifyContent: 'flex-end'
                        }}>
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={filteredProducts.length}
                                onChange={(page) => setCurrentPage(page)}
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
