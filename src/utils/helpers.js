export const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

export const formatCurrency = (value) => {
    if (typeof value !== 'number') return '';
    return value.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND'
    });
};
