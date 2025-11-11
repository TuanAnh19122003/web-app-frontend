/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { message, Spin } from 'antd';

const API_URL = process.env.REACT_APP_API_URL;

const PaypalCallback = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const navigate = useNavigate();

    useEffect(() => {
        const capturePayment = async () => {
            try {
                const res = await axios.get(`${API_URL}/paypal/capture?orderId=${orderId}`);
                if (res.data.success) {
                    await axios.delete(`${API_URL}/carts/clear/${res.data.data.userId}`);
                    message.success('Thanh toán PayPal thành công!');
                    navigate('/payment-success');
                } else {
                    message.error('Thanh toán PayPal thất bại');
                    navigate('/payment-fail');
                }
            } catch (err) {
                console.error(err);
                message.error('Lỗi khi xác nhận PayPal');
                navigate('/cart');
            }
        };

        if (orderId) {
            capturePayment();
        } else {
            navigate('/');
        }
    }, [orderId]);

    return (
        <div style={{ padding: 48, textAlign: 'center' }}>
            <Spin size="large" />
            <p>Đang xác nhận thanh toán với PayPal...</p>
        </div>
    );
};

export default PaypalCallback;
