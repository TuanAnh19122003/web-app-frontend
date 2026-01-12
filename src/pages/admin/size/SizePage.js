import React, { useState, useEffect } from 'react';
import { Button, message, Modal, Spin, Descriptions, Input } from 'antd';
import SizeForm from './SizeForm';
import SizeList from './SizeList';
import { PlusOutlined } from "@ant-design/icons";
import { formatDate } from '../../../utils/helpers';
import axios from 'axios';

const SizePage = () => {
    const [sizes, setSizes] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingSize, setEditingSize] = useState(null);
    const [loading, setLoading] = useState(false);
    const [viewingSize, setViewingSize] = useState(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
    const [search, setSearch] = useState('');

    const API_URL = process.env.REACT_APP_API_URL;

    const fetchData = async (page = 1, pageSize = 5, keyword = search) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/sizes`, {
                params: {
                    page,
                    pageSize,
                    search: keyword || null,
                },
            });
            const { data, total } = response.data;
            setSizes(data);
            setPagination({
                current: page,
                pageSize: pageSize,
                total: total,
            });
        } catch (error) {
            message.error('Lỗi khi tải danh sách size');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAdd = () => {
        setEditingSize(null);
        setOpen(true);
    };

    const handleEdit = (size) => {
        setEditingSize(size);
        setOpen(true);
    };

    const handleView = (size) => {
        setViewingSize(size);
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/sizes/${id}`);
            message.success(response.data.message);

            const remainingItems = sizes.length - 1;
            const isLastItemOnPage = remainingItems === 0 && pagination.current > 1;
            const newPage = isLastItemOnPage ? pagination.current - 1 : pagination.current;

            fetchData(newPage, pagination.pageSize);
        } catch (error) {
            message.error('Thao tác thất bại');
        }
    };


    const handleSubmit = async (size) => {
        try {
            if (editingSize) {
                const response = await axios.put(`${API_URL}/sizes/${editingSize.id}`, size);
                if (response.data.success) {
                    message.success(response.data.message);
                    fetchData(pagination.current, pagination.pageSize);
                } else {
                    message.error(response.data.message || "Cập nhật thất bại");
                }
            } else {
                const response = await axios.post(`${API_URL}/sizes`, size);
                message.success(response.data.message);
                fetchData(1, pagination.pageSize);
            }
            setOpen(false);
        } catch (error) {
            message.error('Thao tác thất bại');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2>Danh sách size</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Input
                        placeholder="Tìm kiếm size..."
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
                <SizeList
                    data={sizes}
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
                title={editingSize ? 'Cập nhật size' : 'Thêm size'}
            >
                <SizeForm
                    initialValues={editingSize}
                    onSubmit={handleSubmit}
                    onCancel={() => setOpen(false)}
                />
            </Modal>

            <Modal
                open={!!viewingSize}
                onCancel={() => setViewingSize(null)}
                footer={null}
                title="Chi tiết size"
                centered
                styles={{ padding: 24, borderRadius: 8, backgroundColor: '#fafafa' }}
            >
                {viewingSize && (
                    <Descriptions
                        bordered
                        column={1}
                        size="middle"
                        labelStyle={{ fontWeight: 600, width: 150 }}
                    >
                        <Descriptions.Item label="ID">{viewingSize.id}</Descriptions.Item>
                        <Descriptions.Item label="Tên size">{viewingSize.name}</Descriptions.Item>
                        <Descriptions.Item label="Mô tả">{viewingSize.description}</Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">{formatDate(viewingSize.createdAt)}</Descriptions.Item>
                        <Descriptions.Item label="Ngày cập nhật">{formatDate(viewingSize.updatedAt)}</Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    )
}

export default SizePage