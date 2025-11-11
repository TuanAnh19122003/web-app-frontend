import React, { useState } from 'react'
import { Table, Button, Popconfirm, Space, Tooltip, Tag, Modal, Select } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { formatDate, formatCurrency } from '../../../utils/helpers';

const OrderList = ({ data, onEdit, onDelete, onView, onUpdateStatus, pagination, onPageChange, users }) => {
    const statusOptions = [
        { value: 'pending', label: 'Chờ xử lý', color: 'orange' },
        { value: 'paid', label: 'Đã thanh toán', color: 'blue' },
        { value: 'shipped', label: 'Đã giao', color: 'cyan' },
        { value: 'completed', label: 'Hoàn thành', color: 'green' },
        { value: 'cancelled', label: 'Đã hủy', color: 'red' },
    ];

    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");

    const handleOpenStatusModal = (record) => {
        setSelectedOrder(record);
        setSelectedStatus(record.status);
        setStatusModalVisible(true);
    };

    const handleUpdateStatus = () => {
        if (selectedOrder && selectedStatus !== selectedOrder.status) {
            onUpdateStatus(selectedOrder.id, selectedStatus);
        }
        setStatusModalVisible(false);
    };

    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            render: (_, __, index) => (
                <span>{(pagination.current - 1) * pagination.pageSize + index + 1}</span>
            ),
        },
        {
            title: "Khách hàng",
            dataIndex: "userId",
            key: "userId",
            render: (userId) => {
                const user = users?.find((user) => user.id === userId);
                return user ? `${user.lastname} ${user.firstname}` : "Không xác định";
            }
        },
        {
            title: "Tổng tiền",
            dataIndex: "total_price",
            key: "total_price",
            render: (price) => formatCurrency(Number(price)),
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt) => formatDate(createdAt),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => {
                const current = statusOptions.find(s => s.value === status) || {
                    label: status,
                    color: 'default',
                };

                return (
                    <Tag
                        color={current.color}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleOpenStatusModal(record)}
                    >
                        {current.label}
                    </Tag>
                );
            },
        },
        {
            title: "Ghi chú",
            dataIndex: "note",
            key: "note",
            ellipsis: true,
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Tooltip title="Chi tiết">
                        <Button
                            icon={<EyeOutlined />}
                            shape="circle"
                            onClick={() => onView(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            icon={<EditOutlined />}
                            type="primary"
                            shape="circle"
                            onClick={() => onEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xoá">
                        <Popconfirm
                            title={`Xác nhận xoá đơn hàng #${record.id}?`}
                            onConfirm={() => onDelete(record.id)}
                        >
                            <Button
                                icon={<DeleteOutlined />}
                                type="primary"
                                shape="circle"
                                danger
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Table
                rowKey="id"
                dataSource={data}
                columns={columns}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: false,
                    onChange: (page, pageSize) => onPageChange(page, pageSize)
                }}
            />

            <Modal
                title="Cập nhật trạng thái đơn hàng"
                open={statusModalVisible}
                onCancel={() => setStatusModalVisible(false)}
                onOk={handleUpdateStatus}
                okText="Cập nhật"
                centered
                cancelText="Hủy"
            >
                <Select
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    style={{ width: '100%' }}
                >
                    {statusOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                            <Tag color={option.color} style={{ marginRight: 8 }}>
                                {option.label}
                            </Tag>
                            {option.label}
                        </Select.Option>
                    ))}
                </Select>
            </Modal>
        </>
    );
};

export default OrderList;
