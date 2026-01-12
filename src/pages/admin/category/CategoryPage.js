/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Button, message, Modal, Spin, Descriptions, Input } from 'antd';
import CategoryList from './CategoryList';
import CategoryForm from './CategoryForm';
import { PlusOutlined } from "@ant-design/icons";
import { formatDate } from '../../../utils/helpers';
import axios from 'axios';

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [viewingCategory, setViewingCategory] = useState(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
    const [search, setSearch] = useState('');

    const API_URL = process.env.REACT_APP_API_URL;

    const fetchCategory = async (page = 1, pageSize = 5, keyword = search) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/categories`, {
                params: {
                    page,
                    pageSize,
                    search: keyword || null,
                },
            });
            const { data, total } = response.data;
            setCategories(data);
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

    useEffect(() => {
        fetchCategory();
    }, []);

    const handleAdd = () => {
        setEditingCategory(null);
        setOpen(true);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setOpen(true);
    };

    const handleView = (category) => {
        setViewingCategory(category);
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/categories/${id}`);
            message.success(response.data.message);

            const remainingItems = categories.length - 1;
            const isLastItemOnPage = remainingItems === 0 && pagination.current > 1;
            const newPage = isLastItemOnPage ? pagination.current - 1 : pagination.current;

            fetchCategory(newPage, pagination.pageSize);
        } catch (error) {
            message.error('Thao tác thất bại');
        }
    };

    const handleSubmit = async (category) => {
        try {
            if (editingCategory) {
                const response = await axios.put(`${API_URL}/categories/${editingCategory.id}`, category);
                if (response.data.success) {
                    message.success(response.data.message);
                    fetchCategory(pagination.current, pagination.pageSize);
                } else {
                    message.error(response.data.message || "Cập nhật thất bại");
                }
            } else {
                const response = await axios.post(`${API_URL}/categories`, category);
                message.success(response.data.message);
                fetchCategory(1, pagination.pageSize);
            }
            setOpen(false);
        } catch (error) {
            message.error('Thao tác thất bại');
        }
    };


    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2>Danh sách loại sản phẩm</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Input
                        placeholder="Tìm kiếm loại sản phẩm..."
                        value={search}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSearch(value);
                            fetchCategory(1, pagination.pageSize, value);
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
                <CategoryList
                    data={categories}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    pagination={pagination}
                    onPageChange={fetchCategory}
                />
            </Spin>

            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                destroyOnHidden={true}
                title={editingCategory ? 'Cập nhật danh mục' : 'Thêm danh mục'}
            >
                <CategoryForm
                    initialValues={editingCategory}
                    onSubmit={handleSubmit}
                    onCancel={() => setOpen(false)}
                />
            </Modal>

            <Modal
                open={!!viewingCategory}
                onCancel={() => setViewingCategory(null)}
                footer={null}
                title="Chi tiết danh mục"
                centered
                styles={{ padding: 24, borderRadius: 8, backgroundColor: '#fafafa' }}
            >
                {viewingCategory && (
                    <Descriptions
                        bordered
                        column={1}
                        size="middle"
                        labelStyle={{ fontWeight: 600, width: 150 }}
                    >
                        <Descriptions.Item label="ID">{viewingCategory.id}</Descriptions.Item>
                        <Descriptions.Item label="Tên danh mục">{viewingCategory.name}</Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">{formatDate(viewingCategory.createdAt)}</Descriptions.Item>
                        <Descriptions.Item label="Ngày cập nhật">{formatDate(viewingCategory.updatedAt)}</Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    )
}

export default CategoryPage