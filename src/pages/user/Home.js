import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Row, Typography, Spin, Image } from 'antd';
import { CoffeeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { formatCurrency } from '../../utils/helpers';

const { Title, Paragraph } = Typography;

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchCategory = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/categories`);
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/products`);
            const allProducts = response.data.data;

            const shuffled = allProducts.sort(() => 0.5 - Math.random());
            const randomProducts = shuffled.slice(0, 8);

            setProducts(randomProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchCategory();
        fetchProduct();
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: 100 }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: '40px 60px' }}>
            <Row justify="center" align="middle" style={{ marginBottom: 60 }}>
                <Col span={12} style={{ marginRight: 24 }}>
                    <Title level={2}>Chào mừng đến với <span style={{ color: '#a0522d' }}>Coffee Shop</span></Title>
                    <Paragraph>
                        Nơi thưởng thức cà phê tinh tế và không gian thư giãn lý tưởng. Coffee Shop không chỉ đơn thuần là một quán cà phê, mà còn là điểm đến lý tưởng dành cho những ai yêu thích sự yên tĩnh, chất lượng và sự tinh tế trong từng tách cà phê.
                        <br /><br />
                        Chúng tôi sử dụng 100% hạt cà phê nguyên chất, được tuyển chọn kỹ lưỡng từ những nông trại chất lượng cao trong và ngoài nước, sau đó rang xay theo quy trình riêng biệt để đảm bảo giữ trọn hương vị tự nhiên.
                        <br /><br />
                        Đội ngũ barista giàu kinh nghiệm của chúng tôi luôn đặt sự tỉ mỉ và đam mê vào từng công đoạn pha chế, nhằm mang đến cho bạn trải nghiệm cà phê không thể quên. Dù bạn là người yêu thích vị đậm đà của espresso, sự nhẹ nhàng của latte hay sự tươi mới của cold brew, tại đây bạn sẽ luôn tìm thấy điều mình yêu thích.
                    </Paragraph>
                    <Link to="/product">
                        <Button type="primary" size="large" icon={<CoffeeOutlined />}>
                            Xem sản phẩm
                        </Button>
                    </Link>
                </Col>
                <Col span={10}>
                    <Image src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/1d/cb/4b/photo4jpg.jpg?w=900&h=500&s=1" alt="Coffee Shop" style={{ width: '100%', borderRadius: 12 }} />
                </Col>
            </Row>

            <Title level={3} style={{ marginBottom: 24 }}>Danh mục nổi bật</Title>
            <Row gutter={[16, 24]} style={{ marginBottom: 80 }}>
                {categories.map((cat) => (
                    <Col key={cat._id || cat.id} xs={24} sm={12} md={6}>
                        <Link to={`/product?category=${cat._id || cat.id}`}>
                            <Card hoverable>
                                <Card.Meta title={cat.name} />
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>

            <Title level={3}>Sản phẩm phổ biến</Title>
            <Row gutter={[16, 24]} style={{ marginBottom: 60 }}>
                {products.map((product) => (
                    <Col key={product._id || product.id} xs={24} sm={12} md={6}>
                        <Link to={`/product/${product._id || product.id}`}>
                            <Card
                                hoverable
                                cover={
                                    product.image ? (
                                        <img
                                            alt={product.name}
                                            src={`${product.image}`}
                                            style={{ height: 180, objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                height: 180,
                                                backgroundColor: '#f0f0f0',
                                                backgroundImage: 'url("/images/default-product.jpg")', // hoặc dùng placeholder online
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                borderRadius: '8px',
                                            }}
                                        />
                                    )
                                }
                            >
                                <Card.Meta
                                    title={product.name}
                                    description={<span style={{ color: '#a0522d', fontWeight: 600 }}>{formatCurrency(Number(product.price))}</span>}
                                />
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>

            {/* About Us */}
            <Row gutter={[16, 24]} style={{ backgroundColor: '#f5f5f5', padding: '40px 20px', borderRadius: 12 }}>
                <Col span={12}>
                    <Title level={3}>Về chúng tôi</Title>
                    <Paragraph>
                        Coffee Shop là điểm đến lý tưởng cho những ai yêu thích hương vị cà phê thuần khiết. Với đội ngũ barista chuyên nghiệp và không gian ấm cúng, chúng tôi cam kết mang đến trải nghiệm thưởng thức tuyệt vời cho từng khách hàng.
                        <br /><br />
                        Tại đây, bạn không chỉ được thưởng thức cà phê chất lượng cao mà còn có thể thư giãn, làm việc hoặc gặp gỡ bạn bè trong một không gian nhẹ nhàng và đầy cảm hứng. Chúng tôi tin rằng mỗi tách cà phê là một hành trình, và mỗi khách hàng đều xứng đáng được trân trọng trên hành trình đó.
                        <br /><br />
                        Đến với Coffee Shop, bạn sẽ cảm nhận được sự chăm chút trong từng chi tiết – từ nguyên liệu, cách pha chế, cho đến cung cách phục vụ. Hãy để chúng tôi đồng hành cùng bạn trong những khoảnh khắc thư giãn thường ngày.
                    </Paragraph>
                </Col>
                <Col span={12}>
                    <Image src="https://img.loveslides.com/templates/preview/cute-coffee-shop-136871.webp" alt="About" style={{ width: '100%', borderRadius: 12 }} />
                </Col>
            </Row>
        </div>
    );
};

export default Home;