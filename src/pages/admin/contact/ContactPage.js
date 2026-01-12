/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Button, message, Modal, Spin, Descriptions, Input } from 'antd';
import ContactForm from './ContactForm';
import ContactList from './ContactList';
import { PlusOutlined } from "@ant-design/icons";
import { formatDate } from '../../../utils/helpers';
import axios from 'axios';

const ContactPage = () => {
    const [contacts, setCotacts] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [loading, setLoading] = useState(false);
    const [viewingContact, setViewingContact] = useState(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
    const [search, setSearch] = useState('');

    const API_URL = process.env.REACT_APP_API_URL;

    const fetchContact = async (page = 1, pageSize = 5, keyword = search) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/contacts`, {
                params: {
                    page,
                    pageSize,
                    search: keyword || null,
                },
            });
            const { data, total } = response.data;
            setCotacts(data);
            setPagination({
                current: page,
                pageSize: pageSize,
                total: total,
            });
        } catch (error) {
            message.error('Lỗi khi tải danh sách liên hệ');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContact();
    }, []);

    const handleAdd = () => {
        setEditingContact(null);
        setOpen(true);
    };

    const handleEdit = (contact) => {
        setEditingContact(contact);
        setOpen(true);
    };

    const handleView = (contact) => {
        setViewingContact(contact);
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/contacts/${id}`);
            message.success(response.data.message);

            const remainingItems = contacts.length - 1;
            const isLastItemOnPage = remainingItems === 0 && pagination.current > 1;
            const newPage = isLastItemOnPage ? pagination.current - 1 : pagination.current;

            fetchContact(newPage, pagination.pageSize);
        } catch (error) {
            message.error('Thao tác thất bại');
        }
    };

    const handleSubmit = async (contact) => {
        try {
            if (editingContact) {
                const response = await axios.put(`${API_URL}/contacts/${editingContact.id}`, contact);
                if (response.data.success) {
                    message.success(response.data.message);
                    fetchContact(pagination.current, pagination.pageSize);
                } else {
                    message.error(response.data.message || "Cập nhật thất bại");
                }
            } else {
                const response = await axios.post(`${API_URL}/contacts`, contact);
                message.success(response.data.message);
                fetchContact(1, pagination.pageSize);
            }
            setOpen(false);
        } catch (error) {
            message.error('Thao tác thất bại');
        }
    };


    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2>Danh sách liên hệ</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Input
                        placeholder="Tìm kiếm liên hệ..."
                        value={search}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSearch(value);
                            fetchContact(1, pagination.pageSize, value);
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
                <ContactList
                    data={contacts}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    pagination={pagination}
                    onPageChange={fetchContact}
                />
            </Spin>

            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                destroyOnHidden={true}
                title={editingContact ? 'Cập nhật liên hệ' : 'Thêm liên hệ'}
            >
                <ContactForm
                    initialValues={editingContact}
                    onSubmit={handleSubmit}
                    onCancel={() => setOpen(false)}
                />
            </Modal>

            <Modal
                open={!!viewingContact}
                onCancel={() => setViewingContact(null)}
                footer={null}
                title="Chi tiết liên hệ"
                centered
                styles={{ padding: 24, borderRadius: 8, backgroundColor: '#fafafa' }}
            >
                {viewingContact && (
                    <Descriptions
                        bordered
                        column={1}
                        size="middle"
                        labelStyle={{ fontWeight: 600, width: 150 }}
                    >
                        <Descriptions.Item label="ID">{viewingContact.id}</Descriptions.Item>
                        <Descriptions.Item label="Tên người gửi liên hệ">{viewingContact.name}</Descriptions.Item>
                        <Descriptions.Item label="Email">{viewingContact.email}</Descriptions.Item>
                        <Descriptions.Item label="Email">{viewingContact.phone}</Descriptions.Item>
                        <Descriptions.Item label="Tiêu đề">{viewingContact.subject}</Descriptions.Item>
                        <Descriptions.Item label="Nội dung">{viewingContact.message}</Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">{formatDate(viewingContact.createdAt)}</Descriptions.Item>
                        <Descriptions.Item label="Ngày cập nhật">{formatDate(viewingContact.updatedAt)}</Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    )
}

export default ContactPage