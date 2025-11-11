import React, { useState, useEffect } from 'react';
import { Modal, Select, Input, Button } from 'antd';
import axios from 'axios';

const { Option } = Select;
const API_URL = `${process.env.REACT_APP_API_URL}/address`;

const AddressModal = ({ visible, onClose, onConfirm }) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    const [street, setStreet] = useState('');

    // Load provinces khi mở modal
    useEffect(() => {
        if (!visible) return;
        axios.get(`${API_URL}/provinces`)
            .then(res => setProvinces(res.data))
            .catch(err => console.error(err));
    }, [visible]);

    // Load districts khi province thay đổi
    useEffect(() => {
        if (!selectedProvince) return setDistricts([]);
        axios.get(`${API_URL}/districts/${selectedProvince.code}`)
            .then(res => setDistricts(res.data))
            .catch(err => console.error(err));
    }, [selectedProvince]);

    // Load wards khi district thay đổi
    useEffect(() => {
        if (!selectedDistrict) return setWards([]);
        axios.get(`${API_URL}/wards/${selectedDistrict.code}`)
            .then(res => setWards(res.data))
            .catch(err => console.error(err));
    }, [selectedDistrict]);

    // Xác nhận địa chỉ → trả về parent
    const handleConfirm = () => {
        const fullAddress = [street, selectedWard?.name, selectedDistrict?.name, selectedProvince?.name]
            .filter(Boolean)
            .join(', ');
        onConfirm(fullAddress);
        onClose();
    };

    return (
        <Modal
            title="Chọn địa chỉ giao hàng"
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Hủy
                </Button>,
                <Button key="confirm" type="primary" onClick={handleConfirm}>
                    Xác nhận
                </Button>
            ]}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Input
                    placeholder="Số nhà / Đường"
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                />

                <Select
                    placeholder="Chọn tỉnh/thành phố"
                    value={selectedProvince?.code || undefined}
                    onChange={code => {
                        const province = provinces.find(p => p.code === code);
                        setSelectedProvince(province);
                        setSelectedDistrict(null);
                        setSelectedWard(null);
                    }}
                    allowClear
                >
                    {provinces.map(p => (
                        <Option key={p.code} value={p.code}>{p.name}</Option>
                    ))}
                </Select>

                <Select
                    placeholder="Chọn quận/huyện"
                    value={selectedDistrict?.code || undefined}
                    onChange={code => {
                        const district = districts.find(d => d.code === code);
                        setSelectedDistrict(district);
                        setSelectedWard(null);
                    }}
                    allowClear
                >
                    {districts.map(d => (
                        <Option key={d.code} value={d.code}>{d.name}</Option>
                    ))}
                </Select>

                <Select
                    placeholder="Chọn phường/xã"
                    value={selectedWard?.code || undefined}
                    onChange={code => {
                        const ward = wards.find(w => w.code === code);
                        setSelectedWard(ward);
                    }}
                    allowClear
                >
                    {wards.map(w => (
                        <Option key={w.code} value={w.code}>{w.name}</Option>
                    ))}
                </Select>
            </div>
        </Modal>
    );
};

export default AddressModal;
