import React from 'react'
import { Table, Button, Popconfirm, Space, Tooltip, Tag } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { formatCurrency } from '../../../utils/helpers';

const ProductList = ({ data, onEdit, onDelete, onView, pagination, onPageChange, categories, discounts }) => {

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
            title: "Ảnh",
            dataIndex: "image",
            key: "image",
            render: (filename) =>
                filename ? (
                    <img
                        src={`${filename}`}
                        alt="product"
                        style={{
                            width: 100,
                            height: 100,
                            objectFit: "cover",
                            borderRadius: 8,
                            border: "1px solid #ccc",
                        }}
                    />
                ) : (
                    <div
                        style={{
                            width: 100,
                            height: 100,
                            backgroundColor: "#eee",
                            borderRadius: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid #ccc",
                            color: "#888",
                            fontSize: 12,
                        }}
                    >
                        Không có ảnh
                    </div>
                ),
        },
        {
            title: "Tên sản phẩm",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            render: (price) => `${formatCurrency(Number(price))}`,
        },
        {
            title: "Danh mục",
            dataIndex: "categoryId",
            key: "categoryId",
            render: (categoryId) => (categories?.find(r => r.id === categoryId)?.name || "Không xác định"),
        },
        {
            title: "Giảm giá",
            dataIndex: "discountId",
            key: "discountId",
            render: (discountId) => (discounts?.find(r => r.id === discountId)?.name || "Không có giảm giá")
        },
        {
            title: "Trạng thái",
            dataIndex: "is_active",
            key: "is_active",
            render: (active) =>
                active ? (
                    <Tag color="green">Hoạt động</Tag>
                ) : (
                    <Tag color="red">Ngừng hoạt động</Tag>
                ),
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
                            title={`Xác nhận xoá sản phẩm "${record.name}"?`}
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
    )
}

export default ProductList