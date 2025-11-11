import { Modal, Select, Tag } from "antd";
import React from "react";

const StatusModal = ({ visible, onCancel, onConfirm, currentStatus, statusOptions }) => {
    const [selectedStatus, setSelectedStatus] = React.useState(currentStatus);

    React.useEffect(() => {
        setSelectedStatus(currentStatus);
    }, [currentStatus]);

    return (
        <Modal
            title="Cập nhật trạng thái đơn hàng"
            open={visible}
            onCancel={onCancel}
            onOk={() => onConfirm(selectedStatus)}
            okText="Cập nhật"
            cancelText="Hủy"
        >
            <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                style={{ width: '100%' }}
            >
                {statusOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                        <Tag color={option.color} style={{ marginRight: 8 }}>
                            {option.label}
                        </Tag>
                        {option.label}
                    </Select.Option>
                ))}
            </Select>
        </Modal>
    );
};

export default StatusModal;
