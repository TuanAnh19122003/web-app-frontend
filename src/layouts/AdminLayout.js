import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, Breadcrumb, Dropdown, Avatar } from 'antd';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    UserOutlined,
    PieChartOutlined,
    ShoppingOutlined,
    AppstoreOutlined,
    FileTextOutlined,
    SettingOutlined,
    LogoutOutlined,
    PhoneOutlined
} from '@ant-design/icons';
import logo from '../assets/logo-coffee.png';

const { Header, Content, Footer, Sider } = Layout;

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    useEffect(() => {
        try {
            const userData = localStorage.getItem('user');
            if (!userData) {
                navigate('/auth/login', { replace: true });
            } else {
                setUser(JSON.parse(userData));
            }
        } catch (e) {
            console.error('Lỗi khi parse user:', e);
            navigate('/auth/login', { replace: true });
        }
    }, [navigate]);

    const formatBreadcrumb = (segment) =>
        segment
            .replace(/[-_]/g, ' ')
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/\b\w/g, (char) => char.toUpperCase());

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbItems = [];

    breadcrumbItems.push({ title: 'Admin' });

    pathSegments.slice(1).forEach((segment) => {
        breadcrumbItems.push({ title: formatBreadcrumb(segment) });
    });

    const items = [
        {
            key: '1',
            icon: <PieChartOutlined />,
            label: <Link to="/admin">Dashboard</Link>,
        },
        {
            key: 'sub-user-management',
            icon: <UserOutlined />,
            label: 'Quản lý người dùng',
            children: [
                {
                    key: 'users',
                    label: <Link to="/admin/users">Danh mục người dùng</Link>,
                },
                {
                    key: 'roles',
                    label: <Link to="/admin/roles">Danh mục vai trò</Link>,
                },
            ],
        },
        {
            key: 'sub-category-management',
            icon: <AppstoreOutlined />,
            label: 'Quản lý danh mục',
            children: [
                {
                    key: 'categories',
                    label: <Link to="/admin/categories">Danh mục loại sản phẩm</Link>,
                },
                {
                    key: 'sizes',
                    label: <Link to="/admin/sizes">Danh mục kích thước</Link>,
                },
                {
                    key: 'discounts',
                    label: <Link to="/admin/discounts">Danh mục giảm giá</Link>,
                },
            ],
        },
        {
            key: 'sub-product-management',
            icon: <ShoppingOutlined />,
            label: 'Quản lý sản phẩm',
            children: [
                {
                    key: 'products',
                    label: <Link to="/admin/products">Danh mục sản phẩm</Link>,
                },
                {
                    key: 'product-sizes',
                    label: <Link to="/admin/product_sizes">Danh mục giá kích thước sản phẩm</Link>,
                },
            ],
        },
        {
            key: 'contact-management',
            icon: <PhoneOutlined />,
            label: <Link to="/admin/contacts">Quản lý liên hệ</Link>,
        },
        {
            key: 'order-management',
            icon: <FileTextOutlined />,
            label: <Link to="/admin/orders">Quản lý đơn hàng</Link>,
        },
    ];

    const userMenu = {
        items: [
            {
                key: 'profile',
                icon: <UserOutlined />,
                label: 'Thông tin cá nhân',
            },
            {
                key: 'settings',
                icon: <SettingOutlined />,
                label: 'Cài đặt',
            },
            {
                key: 'user',
                icon: <SettingOutlined />,
                label: 'Trang người dùng',
                onClick: () => {
                    navigate('/');
                },
            },
            {
                type: 'divider',
            },
            {
                key: 'logout',
                icon: <LogoutOutlined />,
                danger: true,
                label: 'Đăng xuất',
                onClick: () => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/auth/login';
                },
            },
        ],
        onClick: (info) => {
            if (info.key === 'logout') {
                console.log('Đăng xuất');
            }
        }
    };

    if (!user) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', size: '20px' }}>Đang kiểm tra đăng nhập...</div>;

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                width={240}
                breakpoint="lg"
                collapsedWidth="80"
            >

                <Link to="/admin">
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: collapsed ? 80 : 160,
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <img
                            src={logo}
                            alt="Logo"
                            style={{
                                height: collapsed ? 40 : 100,
                                width: collapsed ? 40 : 100,
                                borderRadius: 12,
                                objectFit: 'cover',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                            }}
                        />
                    </div>
                </Link>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
            </Sider>

            <Layout>
                <Header
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        padding: '0 16px',
                        background: colorBgContainer,
                        color: '#000',
                        height: 'auto',
                        minHeight: 64,
                        gap: 12,
                    }}
                >

                    <div style={{ fontWeight: 'bold', fontSize: 18 }}>
                        Admin Panel
                    </div>

                    <Dropdown menu={userMenu} trigger={['click']}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                cursor: 'pointer',
                                maxWidth: 200,
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            <Avatar src={`http://localhost:5000/${user.image}`} size={36} />
                            <span style={{ fontWeight: 500 }}>{user.lastname} {user.firstname}</span>
                        </div>

                    </Dropdown>
                </Header>


                <Content style={{ margin: '0 12px' }}>
                    <Breadcrumb style={{ margin: '12px 0' }} items={breadcrumbItems} />
                    <div
                        style={{
                            padding: 16,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                            overflowX: 'auto',
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©{new Date().getFullYear()} Created by Thắng
                </Footer>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
