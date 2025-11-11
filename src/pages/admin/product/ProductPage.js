import React, { useState, useEffect } from 'react';
import { Button, message, Modal, Spin, Descriptions, Tag, Input } from 'antd';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { formatDate } from '../../../utils/helpers';
import normalizeFileName from '../../../utils/normalizeFileName';

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryLoading, setCategoryLoading] = useState(false);
    const [discounts, setDiscounts] = useState([]);

    const [discountLoading, setDiscountLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [viewingProduct, setViewingProduct] = useState(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
    const [search, setSearch] = useState('');

    const API_URL = process.env.REACT_APP_API_URL;

    const fetchData = async (page = 1, pageSize = 5, keyword = search) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/products`, {
                params: {
                    page,
                    pageSize,
                    search: keyword || null,
                },
            });
            const { data, total } = res.data;
            setProducts(data);
            setPagination({
                current: page,
                pageSize: pageSize,
                total: total,
            });
        } catch (err) {
            message.error('Lỗi khi tải sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const fetchDiscount = async () => {
        setDiscountLoading(true);
        try {
            const res = await axios.get(`${API_URL}/discounts`);
            setDiscounts(res.data.data);
        } catch (err) {
            message.error('Lỗi khi tải giảm giá');
            console.log(err);
        } finally {
            setDiscountLoading(false);
        }
    };

    const fetchCategory = async () => {
        setCategoryLoading(true);
        try {
            const res = await axios.get(`${API_URL}/categories`);
            setCategories(res.data.data);
        } catch (err) {
            message.error('Lỗi khi tải danh mục');
        } finally {
            setCategoryLoading(false);
        }
    };

    const handleSearch = (value) => {
        setSearch(value);
        fetchData(1, pagination.pageSize, value);
    };

    useEffect(() => {
        fetchCategory();
        fetchData();
        fetchDiscount();
    }, []);


    const handleAdd = () => {
        setEditingProduct(null);
        setOpen(true);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setOpen(true);
    };

    const handleView = (product) => {
        setViewingProduct(product);
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`${API_URL}/products/${id}`);
            message.success(res.data.message);
            const isLast = products.length === 1 && pagination.current > 1;
            const newPage = isLast ? pagination.current - 1 : pagination.current;
            fetchData(newPage, pagination.pageSize);
        } catch (err) {
            message.error('Xóa thất bại');
        }
    };

    const handleSubmit = async (product) => {
        try {
            const formData = new FormData();
            formData.append('name', product.name);
            formData.append('price', product.price);
            formData.append('description', product.description || '');
            formData.append('categoryId', product.categoryId);
            if (product.discountId) {
                formData.append('discountId', product.discountId);
            }
            formData.append('is_active', product.is_active ? 1 : 0);

            if (Array.isArray(product.image) && product.image.length > 0) {
                const originalFile = product.image[0].originFileObj;
                const normalizedName = normalizeFileName(originalFile.name);
                const newFile = new File([originalFile], normalizedName, { type: originalFile.type });
                formData.append('image', newFile);
            }

            let res;
            if (editingProduct) {
                res = await axios.put(`${API_URL}/products/${editingProduct.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                res = await axios.post(`${API_URL}/products`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            if (res.data.success) {
                message.success(res.data.message);
                fetchData(pagination.current, pagination.pageSize);
            } else {
                message.error(res.data.message || 'Cập nhật thất bại');
            }

            setOpen(false);
        } catch (err) {
            console.error(err);
            message.error('Thao tác thất bại');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2>Danh sách sản phẩm</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Input
                        placeholder="Tìm kiếm sản phẩm..."
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
                <ProductList
                    data={products}
                    categories={categories || []}
                    discounts={discounts || []}
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
                title={editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
            >
                <ProductForm
                    initialValues={editingProduct}
                    onSubmit={handleSubmit}
                    onCancel={() => setOpen(false)}
                    categories={categories}
                    discounts={discounts}
                    categoryLoading={categoryLoading}
                    discountLoading={discountLoading}
                />
            </Modal>

            <Modal
                open={!!viewingProduct}
                onCancel={() => setViewingProduct(null)}
                centered
                footer={null}
                title="Chi tiết sản phẩm"
            >
                {viewingProduct && (
                    <Descriptions bordered column={1} size="middle">
                        <Descriptions.Item label="ID">{viewingProduct.id}</Descriptions.Item>
                        <Descriptions.Item label="Tên">{viewingProduct.name}</Descriptions.Item>
                        <Descriptions.Item label="Giá">{`${Number(viewingProduct.price).toLocaleString()} đ`}</Descriptions.Item>
                        <Descriptions.Item label="Mô tả">{viewingProduct.description}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            {viewingProduct.is_active ? (
                                <Tag color="green">Hoạt động</Tag>
                            ) : (
                                <Tag color="red">Không hoạt động</Tag>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ảnh">
                            {viewingProduct.image ? (
                                <img src={`http://localhost:5000/${viewingProduct.image}`} alt="product" style={{ width: 100, height: 100, objectFit: 'contain', borderRadius: 10 }} />
                            ) : (
                                <span style={{ color: '#aaa' }}>Không có</span>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Danh mục">
                            {categories?.find(c => c.id === viewingProduct.categoryId)?.name || 'Không xác định'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Giảm giá">
                            {discounts?.find(d => d.id === viewingProduct.discountId)?.name || 'Không'}
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày tạo">{formatDate(viewingProduct.createdAt)}</Descriptions.Item>
                        <Descriptions.Item label="Ngày cập nhật">{formatDate(viewingProduct.updatedAt)}</Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    )
}

export default ProductPage