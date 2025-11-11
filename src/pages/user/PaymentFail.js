import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const PaymentFail = () => {
    const navigate = useNavigate();

    return (
        <Result
            status="error"
            title="Thanh toán thất bại"
            subTitle="Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại hoặc chọn phương thức khác."
            extra={[
                <Button type="primary" onClick={() => navigate('/cart')}>
                    Quay lại giỏ hàng
                </Button>,
                <Button onClick={() => navigate('/')}>
                    Về trang chủ
                </Button>
            ]}
        />
    );
};

export default PaymentFail;
