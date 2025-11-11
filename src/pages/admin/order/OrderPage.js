import React, { useState, useEffect } from 'react';
import { Button, message, Modal, Spin, Descriptions, Tag } from 'antd';
import OrderList from './OrderList';
import OrderForm from './OrderForm';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { formatDate, formatCurrency } from '../../../utils/helpers';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [productLoading, setProductLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [userLoading, setUserLoading] = useState(false);
    const [sizes, setSizes] = useState([]);
    const [sizeLoading, setSizeLoading] = useState(false);

    const [open, setOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [viewingOrder, setViewingOrder] = useState(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });

    const API_URL = process.env.REACT_APP_API_URL;

    const fetchData = async (page = 1, pageSize = 5) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/orders`, { params: { page, pageSize } });
            const { data, total } = res.data;
            setOrders(data);
            setPagination({ current: page, pageSize, total });
        } catch (err) {
            message.error('Lỗi khi tải đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const fetchProduct = async () => {
        setProductLoading(true);
        try {
            const res = await axios.get(`${API_URL}/products`);
            setProducts(res.data.data);
        } catch (err) {
            message.error('Lỗi khi tải sản phẩm');
        } finally {
            setProductLoading(false);
        }
    };

    const fetchUser = async () => {
        setUserLoading(true);
        try {
            const res = await axios.get(`${API_URL}/users`);
            setUsers(res.data.data);
        } catch (err) {
            message.error('Lỗi khi tải người dùng');
        } finally {
            setUserLoading(false);
        }
    };

    const fetchSize = async () => {
        setSizeLoading(true);
        try {
            const res = await axios.get(`${API_URL}/sizes`);
            setSizes(res.data.data);
        } catch (err) {
            message.error('Lỗi khi tải size');
        } finally {
            setSizeLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchProduct();
        fetchUser();
        fetchSize();
    }, []);

    const handleAdd = () => {
        setEditingOrder(null);
        setOpen(true);
    };

    const handleEdit = (order) => {
        setEditingOrder(order);
        setOpen(true);
    };

    const handleView = (order) => {
        setViewingOrder(order);
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`${API_URL}/orders/${id}`);
            message.success(res.data.message);
            const isLast = orders.length === 1 && pagination.current > 1;
            const newPage = isLast ? pagination.current - 1 : pagination.current;
            fetchData(newPage, pagination.pageSize);
        } catch (err) {
            message.error('Xóa thất bại');
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const res = await axios.put(`${API_URL}/orders/status`, {
                orderId,
                status: newStatus,
            });

            if (res.data.success) {
                message.success('Cập nhật trạng thái thành công');
                fetchData(pagination.current, pagination.pageSize);
            } else {
                message.error(res.data.message || 'Cập nhật trạng thái thất bại');
            }
        } catch (err) {
            console.error(err);
            message.error('Lỗi khi cập nhật trạng thái');
        }
    };


    const handleSubmit = async (order) => {
        try {
            const items = order.items || order.order_item?.map(item => ({
                productId: item.productId,
                sizeId: item.sizeId,
                quantity: item.quantity,
                price: item.price,
            })) || [];

            const payload = {
                userId: order.userId,
                totalPrice: order.total_price,
                note: order.note || '',
                items
            };

            let res;
            if (editingOrder) {
                res = await axios.put(`${API_URL}/orders/${editingOrder.id}`, payload);
            } else {
                res = await axios.post(`${API_URL}/orders`, payload);
            }

            if (res.data.success) {
                message.success(res.data.message);
                fetchData(pagination.current, pagination.pageSize);
                setOpen(false);
            } else {
                message.error(res.data.message || 'Thao tác thất bại');
            }
        } catch (err) {
            console.error(err);
            message.error('Lỗi khi gửi dữ liệu');
        }
    };


    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Đơn hàng</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Thêm đơn hàng
                </Button>
            </div>
            <Spin spinning={loading}>
                <OrderList
                    data={orders}
                    onAdd={handleAdd}
                    users={users}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    pagination={pagination}
                    onPageChange={fetchData}
                    onUpdateStatus={handleUpdateStatus}
                />
            </Spin>

            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                destroyOnHidden={true}
                title={editingOrder ? 'Cập nhật đơn hàng' : 'Tạo đơn hàng'}
            >
                <OrderForm
                    initialValues={editingOrder}
                    onSubmit={handleSubmit}
                    onCancel={() => setOpen(false)}
                    users={users}
                    products={products}
                    sizes={sizes}
                    userLoading={userLoading}
                    productLoading={productLoading}
                    sizeLoading={sizeLoading}
                />
            </Modal>

            <Modal
                open={!!viewingOrder}
                onCancel={() => setViewingOrder(null)}
                centered
                footer={null}
                title="Chi tiết đơn hàng"
            >
                {viewingOrder && (
                    <Descriptions bordered column={1} size="middle">
                        <Descriptions.Item label="ID">{viewingOrder.id}</Descriptions.Item>
                        <Descriptions.Item label="Khách hàng">
                            {
                                users.find(u => u.id === viewingOrder.userId)
                                    ? `${users.find(u => u.id === viewingOrder.userId).lastname} ${users.find(u => u.id === viewingOrder.userId).firstname}`
                                    : 'Không xác định'
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="Tổng tiền">{formatCurrency(Number(viewingOrder.total_price))}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Tag color="blue">{viewingOrder.status}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ghi chú">{viewingOrder.note || 'Không có'}</Descriptions.Item>

                        <Descriptions.Item label="Sản phẩm">
                            {viewingOrder.order_item?.map((item, index) => (
                                <div key={index} style={{ marginBottom: 8 }}>
                                    <strong>{item.product?.name}</strong> - Size: {item.size?.name} <br />
                                    SL: {item.quantity} | Đơn giá: {formatCurrency(Number(item.price))}
                                </div>
                            ))}
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày tạo">{formatDate(viewingOrder.createdAt)}</Descriptions.Item>
                        <Descriptions.Item label="Cập nhật gần nhất">{formatDate(viewingOrder.updatedAt)}</Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
};

export default OrderPage;
