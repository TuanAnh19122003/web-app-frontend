import React from 'react'
import { Table, Button, Popconfirm, Space, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { formatCurrency } from '../../../utils/helpers';

const ProductSizeList = ({ data, onEdit, onDelete, onView, pagination, onPageChange, products, sizes }) => {
    let productName = (product) => products.find(item => item.id === product)?.name;
    let sizeName = (size) => sizes.find(item => item.id === size)?.name;

    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            render: (_, __, index) => (
                <span>{(pagination.current - 1) * pagination.pageSize + index + 1}</span>
            ),
        },
        { title: "Sản phẩm", dataIndex: "productId", key: "productId", render: (product) => products.find(item => item.id === product)?.name },
        { title: "Size", dataIndex: "sizeId", key: "sizeId", render: (size) => sizes.find(item => item.id === size)?.name },
        { title: "Giá bổ sung", dataIndex: "additional_price", key: "additional_price", render: (additional_price) => formatCurrency(Number(additional_price)) },
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
                            title={`Xác nhận xoá sản phẩm "${productName(record.productId)} - ${sizeName(record.sizeId)}?`}
                            onConfirm={() => onDelete({ product: record.productId, size: record.sizeId })}
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
    ]
    return (
        <Table
            rowKey={(record) => `${record.productId}-${record.sizeId}`}
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

export default ProductSizeList