/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Badge } from 'antd';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    UserOutlined,
    DashboardOutlined,
    LogoutOutlined,
    ShoppingCartOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import { CartContext } from '../pages/user/CartContext';
import { jwtDecode } from 'jwt-decode';
import logo from '../assets/logo.png';
import ChatWidget from '../components/ChatWidget';

const { Header, Content, Footer } = Layout;

const UserLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const { cartItemCount, fetchCartCount } = useContext(CartContext);
    // Hàm load user từ localStorage
    const loadUser = () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            fetchCartCount();
        }
    };

    useEffect(() => {
        // Load lần đầu
        loadUser();

        // Lắng nghe custom event userUpdated
        const handleUserUpdated = () => loadUser();
        window.addEventListener('userUpdated', handleUserUpdated);

        // Lắng nghe storage event cho các tab khác
        const handleStorageChange = (e) => {
            if (e.key === 'user') {
                loadUser();
            }
        };
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('userUpdated', handleUserUpdated);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                if (decoded.exp < currentTime) {
                    handleLogout();
                } else {
                    const remainingTime = (decoded.exp - currentTime) * 1000;
                    setTimeout(() => {
                        handleLogout();
                    }, remainingTime);
                }
            } catch (error) {
                console.error("Lỗi giải mã token:", error);
                handleLogout();
            }
        }
    }, []);

    const handleLogin = () => navigate('/auth/login');

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        navigate('/auth/login');
    };

    const menuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: <Link to="/profile">Thông tin cá nhân</Link>,
        },
        {
            key: 'order-history',
            icon: <HistoryOutlined />,
            label: <Link to="/order-history">Lịch sử đơn hàng</Link>,
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            onClick: handleLogout,
        },
    ];

    if (user && user.role?.name?.toLowerCase() === 'admin') {
        menuItems.unshift({
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: <Link to="/admin">Dashboard</Link>,
        });
    }

    const userMenu = { items: menuItems };
    const avatarUrl = user?.image ? `${user.image}` : null;

    return (
        <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 40px',
                    backgroundColor: '#001529',
                }}
            >
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                    <img
                        src={logo}
                        alt="Logo"
                        style={{ width: 60, height: 60, objectFit: 'contain' }}
                    />
                    <span style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>
                        Coffee Shop
                    </span>
                </Link>

                <Menu
                    mode="horizontal"
                    theme="dark"
                    selectedKeys={[location.pathname]}
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        display: 'flex',
                        background: 'transparent',
                        borderBottom: 'none',
                        fontSize: 16,
                        fontWeight: 500,
                    }}
                    items={[
                        { key: '/', label: <Link to="/">Trang chủ</Link> },
                        { key: '/about', label: <Link to="/about">Giới thiệu</Link> },
                        { key: '/product', label: <Link to="/product">Sản phẩm</Link> },
                        { key: '/contact', label: <Link to="/contact">Liên hệ</Link> },
                    ]}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Link to="/cart">
                        <Badge count={user ? cartItemCount : 0} size="small" offset={[0, 2]}>
                            <ShoppingCartOutlined style={{ color: '#fff', fontSize: 20 }} />
                        </Badge>
                    </Link>

                    {user ? (
                        <Dropdown menu={userMenu} placement="bottomRight">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                <Avatar
                                    size={32}
                                    src={avatarUrl}
                                    icon={!avatarUrl && <UserOutlined />}
                                    alt="avatar"
                                    style={{
                                        backgroundColor: !avatarUrl ? '#87d068' : 'transparent',
                                        color: '#fff',
                                    }}
                                />
                                <span style={{ color: '#fff' }}>
                                    {user.lastname} {user.firstname}
                                </span>
                            </div>
                        </Dropdown>
                    ) : (
                        <Button
                            type="text"
                            icon={<UserOutlined style={{ fontSize: 20 }} />}
                            onClick={handleLogin}
                            style={{ color: '#fff' }}
                        />
                    )}
                </div>
            </Header>

            <Content style={{ padding: '0 50px', marginTop: 24, flex: 1 }}>
                <div style={{ padding: 24, minHeight: 280, background: '#fff', borderRadius: 8 }}>
                    <Outlet />
                </div>
            </Content>

            <Footer style={{ textAlign: 'center' }}>
                ©{new Date().getFullYear()} MyShop. All rights reserved.
            </Footer>

            {/* Chat Widget */}
            <ChatWidget />
        </Layout>
    );
};

export default UserLayout;
