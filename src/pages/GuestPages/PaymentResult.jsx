import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();

  // Các thông tin cơ bản VNPAY trả về
  const responseCode = searchParams.get('vnp_ResponseCode');
  const transactionNo = searchParams.get('vnp_TransactionNo');
  const amount = searchParams.get('vnp_Amount');
  const orderInfo = searchParams.get('vnp_OrderInfo');

  const isSuccess = responseCode === '00';

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
    {isSuccess ? (
      <div style={{ color: 'green' }}>
      <h1 style={{ fontSize: '50px' }}>✅</h1>
      <h2>Thanh toán thành công!</h2>
      </div>
    ) : (
      <div style={{ color: 'red' }}>
      <h1 style={{ fontSize: '50px' }}>❌</h1>
      <h2>Thanh toán thất bại</h2>
      <p>Mã lỗi: {responseCode}</p>
      </div>
    )}

    <div style={{ marginTop: '30px', border: '1px solid #ddd', padding: '20px', display: 'inline-block', textAlign: 'left' }}>
    <p><strong>Nội dung:</strong> {orderInfo}</p>
    <p><strong>Mã giao dịch VNPAY:</strong> {transactionNo}</p>
    <p><strong>Số tiền:</strong> {parseInt(amount) / 100} VND</p>
    </div>

    <div style={{ marginTop: '20px' }}>
    <Link to="/">
    <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Quay về trang chủ</button>
    </Link>
    </div>
    </div>
  );
};

export default PaymentResult;
