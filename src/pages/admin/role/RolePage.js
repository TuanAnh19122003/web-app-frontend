/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Button, message, Modal, Spin, Descriptions, Input } from 'antd';
import RoleList from './RoleList';
import RoleForm from './RoleForm';
import { PlusOutlined } from "@ant-design/icons";
import { formatDate } from '../../../utils/helpers';
import axios from 'axios';

const RolePage = () => {
    const [roles, setRoles] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const [viewingRole, setViewingRole] = useState(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
    const [search, setSearch] = useState('');

    const API_URL = process.env.REACT_APP_API_URL;

    const fetchData = async (page = 1, pageSize = 5, keyword = search) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/roles`, {
                params: {
                    page,
                    pageSize,
                    search: keyword || null,
                },
            });
            const { data, total } = response.data;
            setRoles(data);
            setPagination({
                current: page,
                pageSize: pageSize,
                total: total,
            });
        } catch (error) {
            message.error('Lỗi khi tải danh sách vai trò');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = () => {
        setEditingRole(null);
        setOpen(true);
    };

    const handleEdit = (role) => {
        setEditingRole(role);
        setOpen(true);
    };

    const handleView = (role) => {
        setViewingRole(role);
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/roles/${id}`);
            message.success(response.data.message);

            const remainingItems = roles.length - 1;
            const isLastItemOnPage = remainingItems === 0 && pagination.current > 1;
            const newPage = isLastItemOnPage ? pagination.current - 1 : pagination.current;

            fetchData(newPage, pagination.pageSize);
        } catch (error) {
            message.error('Thao tác thất bại');
        }
    };


    const handleSubmit = async (role) => {
        try {
            if (editingRole) {
                const response = await axios.put(`${API_URL}/roles/${editingRole.id}`, role);
                if (response.data.success) {
                    message.success(response.data.message);
                    fetchData(pagination.current, pagination.pageSize);
                } else {
                    message.error(response.data.message || "Cập nhật thất bại");
                }
            } else {
                const response = await axios.post(`${API_URL}/roles`, role);
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
                <h2>Danh sách vai trò</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Input
                        placeholder="Tìm kiếm vai trò..."
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
                <RoleList
                    data={roles}
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
                title={editingRole ? 'Cập nhật vai trò' : 'Thêm vai trò'}
            >
                <RoleForm
                    initialValues={editingRole}
                    onSubmit={handleSubmit}
                    onCancel={() => setOpen(false)}
                />
            </Modal>

            <Modal
                open={!!viewingRole}
                onCancel={() => setViewingRole(null)}
                footer={null}
                title="Chi tiết vai trò"
                centered
                styles={{ padding: 24, borderRadius: 8, backgroundColor: '#fafafa' }}
            >
                {viewingRole && (
                    <Descriptions
                        bordered
                        column={1}
                        size="middle"
                        labelStyle={{ fontWeight: 600, width: 150 }}
                    >
                        <Descriptions.Item label="ID">{viewingRole.id}</Descriptions.Item>
                        <Descriptions.Item label="Tên vai trò">{viewingRole.name}</Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">{formatDate(viewingRole.createdAt)}</Descriptions.Item>
                        <Descriptions.Item label="Ngày cập nhật">{formatDate(viewingRole.updatedAt)}</Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
};

export default RolePage;
