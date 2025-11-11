import React, { useEffect, useState } from 'react';
import {
    Card, Col, Row, Table, Typography, Tag, message, Button
} from 'antd';
import axios from 'axios';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend
} from 'recharts';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const { Title, Text } = Typography;
const COLORS = ['#1890ff', '#52c41a', '#faad14', '#ff4d4f'];

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);

    const API_URL = 'http://localhost:5000';

    useEffect(() => {
        const fetchData = () => {
            axios.get(`${API_URL}/api/products/with-sizes`)
                .then(res => setProducts(res.data.data.filter(p => p.size_name === 'S')))
                .catch(() => message.error('Không tải được danh sách sản phẩm'));

            axios.get(`${API_URL}/api/categories`)
                .then(res => setCategories(res.data.data))
                .catch(() => message.error('Không tải được danh mục'));

            axios.get(`${API_URL}/api/orders`)
                .then(res => setOrders(res.data.data || []))
                .catch(() => message.error('Không tải được đơn hàng'));
        };

        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    // Tính toán dữ liệu thống kê
    const revenueByMonth = {};
    const orderByMonth = {};
    const statusCounts = {};
    const revenueByDate = {};

    orders.forEach(order => {
        const date = new Date(order.createdAt);
        const monthKey = `${date.getMonth() + 1}/${date.getFullYear()}`;
        revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + Number(order.total_price || 0);
        orderByMonth[monthKey] = (orderByMonth[monthKey] || 0) + 1;
        statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;

        const dayKey = date.toLocaleDateString('vi-VN');
        revenueByDate[dayKey] = (revenueByDate[dayKey] || 0) + Number(order.total_price || 0);
    });

    const revenueData = Object.keys(revenueByMonth).map(key => ({ month: key, revenue: revenueByMonth[key] }));
    const orderData = Object.keys(orderByMonth).map(key => ({ month: key, orders: orderByMonth[key] }));
    const statusData = Object.keys(statusCounts).map((status, i) => ({
        name: status.toUpperCase(),
        value: statusCounts[status],
        color: COLORS[i % COLORS.length],
    }));
    const revenueByDateData = Object.keys(revenueByDate).map(date => ({
        date,
        revenue: revenueByDate[date],
    })).sort((a, b) => {
        const [d1, m1, y1] = a.date.split('/').map(Number);
        const [d2, m2, y2] = b.date.split('/').map(Number);
        return new Date(y1, m1 - 1, d1) - new Date(y2, m2 - 1, d2);
    });

    const columns = [
        { title: 'Tên sản phẩm', dataIndex: 'product_name', key: 'product_name' },
        { title: 'Danh mục', dataIndex: 'category_name', key: 'category_name', render: category => <Tag color="blue">{category}</Tag> },
        { title: 'Giá bán', dataIndex: 'final_price', key: 'final_price', render: price => <Text strong>{Number(price).toLocaleString()} đ</Text> },
        { title: 'Giảm giá (%)', dataIndex: 'discount_percentage', key: 'discount_percentage', render: percent => percent ? `${percent}%` : 'Không' },
    ];

    // Hàm xuất Excel với định dạng tiền
    const exportProducts = () => {
        if (!products.length) return;
        const data = products.map(p => ({
            "Tên sản phẩm": p.product_name,
            "Danh mục": p.category_name,
            "Giá bán": Number(p.final_price) || 0,
            "Giảm giá (%)": p.discount_percentage || 0,
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        ws['!cols'] = [
            { wch: 20 }, { wch: 15 }, { wch: 12, z: '#,##0₫' }, { wch: 10 }
        ];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Products");
        const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([buffer], { type: "application/octet-stream" }), "products.xlsx");
    };

    const exportOrders = () => {
        if (!orders.length) return;
        const data = orders.map(o => ({
            "Mã đơn": o.id,
            "Ngày tạo": new Date(o.createdAt).toLocaleDateString("vi-VN"),
            "Tổng tiền": Number(o.total_price) || 0,
            "Trạng thái": o.status,
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        ws['!cols'] = [
            { wch: 10 }, { wch: 15 }, { wch: 15, z: '#,##0₫' }, { wch: 15 }
        ];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Orders");
        const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([buffer], { type: "application/octet-stream" }), "orders.xlsx");
    };

    const exportRevenueByMonth = () => {
        if (!revenueData.length) return;
        const data = revenueData.map(item => ({
            "Tháng": item.month,
            "Doanh thu": Number(item.revenue) || 0
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        ws['!cols'] = [
            { wch: 10 }, { wch: 15, z: '#,##0₫' }
        ];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Doanh thu theo tháng");
        const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([buffer], { type: "application/octet-stream" }), "revenue_by_month.xlsx");
    };

    const exportRevenueByDate = () => {
        if (!revenueByDateData.length) return;
        const data = revenueByDateData.map(item => ({
            "Ngày": item.date,
            "Doanh thu": Number(item.revenue) || 0
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        ws['!cols'] = [
            { wch: 12 }, { wch: 15, z: '#,##0₫' }
        ];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Doanh thu theo ngày");
        const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([buffer], { type: "application/octet-stream" }), "revenue_by_date.xlsx");
    };

    return (
        <div style={{ padding: 24 }}>
            {/* Summary card */}
            <Row gutter={24} style={{ marginBottom: 24 }}>
                <Col xs={24} md={6}>
                    <Card hoverable>
                        <Title level={4}>Tổng số sản phẩm</Title>
                        <Text style={{ fontSize: 24 }}>{products.length}</Text>
                    </Card>
                </Col>
                <Col xs={24} md={6}>
                    <Card hoverable>
                        <Title level={4}>Tổng số danh mục</Title>
                        <Text style={{ fontSize: 24 }}>{categories.length}</Text>
                    </Card>
                </Col>
                <Col xs={24} md={6}>
                    <Card hoverable>
                        <Title level={4}>Doanh thu tháng này</Title>
                        <Text style={{ fontSize: 24 }}>
                            {(() => {
                                const now = new Date();
                                const key = `${now.getMonth() + 1}/${now.getFullYear()}`;
                                return Number(revenueByMonth[key] || 0).toLocaleString() + ' đ';
                            })()}
                        </Text>
                    </Card>
                </Col>
                <Col xs={24} md={6}>
                    <Card hoverable>
                        <Title level={4}>Doanh thu hôm nay</Title>
                        <Text style={{ fontSize: 24 }}>
                            {(() => {
                                const now = new Date();
                                const key = now.toLocaleDateString('vi-VN');
                                return Number(revenueByDate[key] || 0).toLocaleString() + ' đ';
                            })()}
                        </Text>
                    </Card>
                </Col>
            </Row>

            {/* Chart */}
            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                <Col xs={24} md={12}>
                    <Card title="Doanh thu theo tháng" extra={<Button onClick={exportRevenueByMonth}>Xuất Excel</Button>}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={revenueData}>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="revenue" fill="#1890ff" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Doanh thu theo ngày" extra={<Button onClick={exportRevenueByDate}>Xuất Excel</Button>}>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={revenueByDateData}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="revenue" stroke="#1890ff" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col xs={24}>
                    <Card title="Tỷ lệ trạng thái đơn hàng">
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="40%"
                                    cy="50%"
                                    outerRadius={110}
                                    innerRadius={60}
                                    paddingAngle={3}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value} đơn`, ""]} />
                                <Legend layout="vertical" verticalAlign="middle" align="right" />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* Table sản phẩm */}
            <Card title="Danh sách sản phẩm (size S)" extra={<Button onClick={exportProducts}>Xuất Excel</Button>}>
                <Table
                    dataSource={products}
                    columns={columns}
                    rowKey={item => `${item.product_id}-${item.size_id}`}
                    pagination={{ pageSize: 8 }}
                />
            </Card>

            {/* Xuất đơn hàng */}
            <Row gutter={24} style={{ marginTop: 24 }}>
                <Col>
                    <Button type="primary" onClick={exportOrders}>Xuất Excel đơn hàng</Button>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
