import React, { useState, useEffect } from 'react';
import { Button, message, Modal, Spin, Descriptions, Input } from 'antd';
import DiscountList from './DiscountList';
import DiscountForm from './DiscountForm';
import { PlusOutlined } from "@ant-design/icons";
import { formatDate } from '../../../utils/helpers';
import axios from 'axios';

const DiscountPage = () => {
    const [discounts, setDiscounts] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingDiscount, setEditingDiscount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [viewingDiscount, setViewingDiscount] = useState(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
    const [search, setSearch] = useState('');

    const API_URL = process.env.REACT_APP_API_URL;

    const fetchData = async (page = 1, pageSize = 5, keyword = search) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/discounts`, {
                params: {
                    page,
                    pageSize,
                    search: keyword || null,
                },
            });
            const { data, total } = response.data;
            setDiscounts(data);
            setPagination({
                current: page,
                pageSize: pageSize,
                total: total,
            });
        } catch (error) {
            message.error('Lỗi khi tải danh sách danh mục');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingDiscount(null);
        setOpen(true);
    };

    const handleEdit = (discount) => {
        setEditingDiscount(discount);
        setOpen(true);
    };

    const handleView = (discount) => {
        setViewingDiscount(discount);
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/discounts/${id}`);
            message.success(response.data.message);

            const remainingItems = discounts.length - 1;
            const isLastItemOnPage = remainingItems === 0 && pagination.current > 1;
            const newPage = isLastItemOnPage ? pagination.current - 1 : pagination.current;

            fetchData(newPage, pagination.pageSize);
        } catch (error) {
            message.error('Thao tác thất bại');
        }
    };

    const handleSubmit = async (discount) => {
        try {
            if (editingDiscount) {
                const response = await axios.put(`${API_URL}/discounts/${editingDiscount.id}`, discount);
                if (response.data.success) {
                    message.success(response.data.message);
                    fetchData(pagination.current, pagination.pageSize);
                } else {
                    message.error(response.data.message || "Cập nhật thất bại");
                }
            } else {
                const response = await axios.post(`${API_URL}/discounts`, discount);
                message.success(response.data.message);
                fetchData(1, pagination.pageSize);
            }
            setOpen(false);
        } catch (error) {
            message.error('Thao tác thất bại');
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2>Danh sách giảm giá</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Input
                        placeholder="Tìm kiếm giảm giá..."
                        value={search}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSearch(value);
                            fetchData(1, pagination.pageSize, value);
                        }}
                        allowClear
                        style={{ width: 250 }}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        Thêm
                    </Button>
                </div>
            </div>

            <Spin spinning={loading}>
                <DiscountList
                    data={discounts}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    pagination={pagination}
                    onPageChange={fetchData}
                />
            </Spin>

            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                destroyOnHidden={true}
                title={editingDiscount ? 'Cập nhật danh mục' : 'Thêm danh mục'}
            >
                <DiscountForm
                    initialValues={editingDiscount}
                    onSubmit={handleSubmit}
                    onCancel={() => setOpen(false)}
                />
            </Modal>

            <Modal
                open={!!viewingDiscount}
                onCancel={() => setViewingDiscount(null)}
                footer={null}
                title="Chi tiết danh mục"
                centered
                styles={{ padding: 24, borderRadius: 8, backgroundColor: '#fafafa' }}
            >
                {viewingDiscount && (
                    <Descriptions
                        bordered
                        column={1}
                        size="middle"
                        labelStyle={{ fontWeight: 600, width: 150 }}
                    >
                        <Descriptions.Item label="ID">{viewingDiscount.id}</Descriptions.Item>
                        <Descriptions.Item label="Tên danh mục">{viewingDiscount.name}</Descriptions.Item>
                        <Descriptions.Item label="Mô tả">{viewingDiscount.description}</Descriptions.Item>
                        <Descriptions.Item label="Giá giảm">{viewingDiscount.percentage}</Descriptions.Item>
                        <Descriptions.Item label="Ngày bắt đầu">{formatDate(viewingDiscount.start_date)}</Descriptions.Item>
                        <Descriptions.Item label="Ngày kết thúc">{formatDate(viewingDiscount.end_date)}</Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">{formatDate(viewingDiscount.createdAt)}</Descriptions.Item>
                        <Descriptions.Item label="Ngày cập nhật">{formatDate(viewingDiscount.updatedAt)}</Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    )
}

export default DiscountPage