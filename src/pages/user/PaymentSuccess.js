import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
    const navigate = useNavigate();

    return (
        <Result
            status="success"
            title="Thanh toán thành công!"
            subTitle="Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý."
            extra={[
                <Button type="primary" onClick={() => navigate('/')}>
                    Quay lại trang chủ
                </Button>,
                <Button onClick={() => navigate('/order-history')}>Xem đơn hàng</Button>,
            ]}
        />
    );
};

export default PaymentSuccess;
