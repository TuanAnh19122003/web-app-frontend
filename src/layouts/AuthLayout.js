import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

const AuthLayout = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Content
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(to right, #4e54c8, #8f94fb)',
                    padding: '40px',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        maxWidth: '400px',
                        backgroundColor: '#fff',
                        padding: '40px 30px',
                        borderRadius: '12px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    }}
                >
                    <Outlet />
                </div>
            </Content>
        </Layout>
    );
}

export default AuthLayout