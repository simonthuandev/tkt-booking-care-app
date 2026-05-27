import React, { useState } from 'react';
import axiosInstance from "../../api/axiosInstance";

const TestPayment = () => {
    // Bạn cần một appointmentId tồn tại trong DB và có status = 'pending'
    const [appointmentId, setAppointmentId] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePayment = async (provider) => {
        if (!appointmentId) {
            alert("Vui lòng nhập Appointment ID từ Database của bạn!");
            return;
        }

        try {
            setLoading(true);
            // Gọi API Backend để lấy URL thanh toán

            const response = await axiosInstance.post('/payment/create-url', {
                appointmentId: appointmentId,
                provider: provider
            });

            if (response.data.payUrl) {
                // Chuyển hướng người dùng sang cổng VNPAY (hoặc trang success nếu là tiền mặt)
                window.location.href = response.data.payUrl;
            }
        } catch (error) {
            console.error("Lỗi thanh toán:", error);
            alert(error.response?.data?.message || "Không thể tạo link thanh toán");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Trang Test Thanh Toán</h2>
        <div style={{ marginBottom: '20px' }}>
        <input
        type="text"
        placeholder="Dán Appointment ID vào đây..."
        value={appointmentId}
        onChange={(e) => setAppointmentId(e.target.value)}
        style={{ padding: '10px', width: '300px' }}
        />
        </div>

        <button
        onClick={() => handlePayment('vn_pay')}
        disabled={loading}
        style={{ padding: '10px 20px', background: '#007bff', color: '#fff', cursor: 'pointer', marginRight: '10px' }}
        >
        {loading ? 'Đang xử lý...' : 'Thanh toán Online qua VNPAY'}
        </button>

        <button
        onClick={() => handlePayment('cash')}
        style={{ padding: '10px 20px', background: '#28a745', color: '#fff', cursor: 'pointer' }}
        >
        Thanh toán tại quầy (Tiền mặt)
        </button>
        </div>
    );
};

export default TestPayment;
