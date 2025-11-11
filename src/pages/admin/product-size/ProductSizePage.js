import React, { useState, useEffect } from 'react';
import { Button, message, Modal, Spin, Descriptions, Input } from 'antd';
import ProductSizeList from './ProductSizeList';
import ProductSizeForm from './ProductSizeForm';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { formatDate, formatCurrency } from '../../../utils/helpers';

const ProductSizePage = () => {
    const [productSizes, setProductSizes] = useState([]);
    const [products, setProducts] = useState([]);
    const [productLoading, setProductLoading] = useState(false);
    const [sizes, setSizes] = useState([]);
    const [sizeLoading, setSizeLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editingProductSize, setEditingProductSize] = useState(null);
    const [loading, setLoading] = useState(false);
    const [viewingProductSize, setViewingProductSize] = useState(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
    const [search, setSearch] = useState('');

    const API_URL = process.env.REACT_APP_API_URL;

    const fetchData = async (page = 1, pageSize = 5, keyword = search) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/product_sizes`, {
                params: {
                    page,
                    pageSize,
                    search: keyword || null,
                },
            });

            const { data, total } = res.data;

            setProductSizes(data);
            setPagination({
                current: page,
                pageSize: pageSize,
                total: total,
            });
        } catch (err) {
            message.error('Lỗi khi tải size');
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
            message.error('Lỗi khi tải giảm giá');
            console.log(err);
        } finally {
            setProductLoading(false);
        }
    };

    const fetchSize = async () => {
        setSizeLoading(true);
        try {
            const res = await axios.get(`${API_URL}/sizes`);
            setSizes(res.data.data);
        } catch (err) {
            message.error('Lỗi khi tải giảm giá');
            console.log(err);
        } finally {
            setSizeLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchProduct();
        fetchSize();
    }, []);

    const handleAdd = () => {
        setEditingProductSize(null);
        setOpen(true);
    };

    const handleEdit = (productsize) => {
        setEditingProductSize(productsize);
        setOpen(true);
    };

    const handleView = (productsize) => {
        setViewingProductSize(productsize);
    };

    const handleDelete = async ({ product, size }) => {
        try {
            const res = await axios.delete(`${API_URL}/product_sizes/${product}/${size}`);
            message.success(res.data.message);
            const isLast = productSizes.length === 1 && pagination.current > 1;
            fetchData(isLast ? pagination.current - 1 : pagination.current, pagination.pageSize);
        } catch (err) {
            message.error('Xóa thất bại');
        }
    };

    const handleSubmit = async (productSize) => {
        try {
            let res;

            const payload = {
                productId: productSize.productId,
                sizeId: productSize.sizeId,
                additional_price: productSize.additional_price,
            };

            if (editingProductSize) {
                const { productId, sizeId } = editingProductSize;

                res = await axios.put(
                    `${API_URL}/product_sizes/${productId}/${sizeId}`,
                    payload,
                    { headers: { 'Content-Type': 'application/json' } }
                );
            } else {
                res = await axios.post(
                    `${API_URL}/product_sizes`,
                    payload,
                    { headers: { 'Content-Type': 'application/json' } }
                );
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
            message.error('Thao tác thất bại');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2>Danh sách kích thước sản phẩm</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Input
                        placeholder="Tìm kiếm kích thước sản phẩm..."
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
                <ProductSizeList
                    data={productSizes}
                    products={products}
                    sizes={sizes}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    pagination={pagination}
                    onPageChange={(page, pageSize) => fetchData(page, pageSize)}
                />
            </Spin>

            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                destroyOnHidden={true}
                title={editingProductSize ? 'Cập nhật Product-Size' : 'Thêm Product-Size'}
            >
                <ProductSizeForm
                    initialValues={editingProductSize}
                    onSubmit={handleSubmit}
                    productLoading={productLoading}
                    sizeLoading={sizeLoading}
                    onCancel={() => setOpen(false)}
                    products={products}
                    sizes={sizes}
                />
            </Modal>

            <Modal
                open={!!viewingProductSize}
                onCancel={() => setViewingProductSize(null)}
                centered
                footer={null}
                title="Chi tiết Product-Size"
            >
                {viewingProductSize && (
                    <Descriptions bordered column={1} size="middle">
                        <Descriptions.Item label="Sản phẩm">
                            {products?.find(p => p.id === viewingProductSize.productId)?.name || 'Không xác định'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Size">
                            {sizes?.find(s => s.id === viewingProductSize.sizeId)?.name || 'Không xác định'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Giá thêm">
                            {`${formatCurrency(Number(viewingProductSize.additional_price))}`}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">
                            {`${formatDate(viewingProductSize.createdAt)}`}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày cập nhật">
                            {`${formatDate(viewingProductSize.updatedAt)}`}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    );

}

export default ProductSizePage