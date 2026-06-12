import { Link, useSearchParams } from "react-router-dom";
import {
  FaCalendarCheck,
  FaCircleCheck,
  FaCircleXmark,
  FaCreditCard,
  FaHouse,
  FaListCheck,
  FaReceipt,
} from "react-icons/fa6";
import "./PaymentResult.scss";

const formatVnpayAmount = (amount) => {
  const value = Number(amount || 0) / 100;
  if (!Number.isFinite(value) || value <= 0) return "Không có dữ liệu";

  return value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
};

const getResultMessage = (responseCode) => {
  if (responseCode === "00") {
    return {
      title: "Thanh toán thành công",
      subtitle: "Lịch hẹn của bạn đã được ghi nhận thanh toán qua VNPAY.",
    };
  }

  return {
    title: "Thanh toán chưa hoàn tất",
    subtitle: "Giao dịch không thành công hoặc đã bị hủy. Bạn có thể thử thanh toán lại từ danh sách lịch hẹn.",
  };
};

const PaymentResult = () => {
  const [searchParams] = useSearchParams();

  const responseCode = searchParams.get("vnp_ResponseCode");
  const transactionStatus = searchParams.get("vnp_TransactionStatus");
  const transactionNo = searchParams.get("vnp_TransactionNo");
  const amount = searchParams.get("vnp_Amount");
  const orderInfo = searchParams.get("vnp_OrderInfo");
  const bankCode = searchParams.get("vnp_BankCode");
  const payDate = searchParams.get("vnp_PayDate");
  const txnRef = searchParams.get("vnp_TxnRef");
  const isSuccess = responseCode === "00" && (!transactionStatus || transactionStatus === "00");
  const result = getResultMessage(responseCode);

  const details = [
    { label: "Nội dung", value: orderInfo },
    { label: "Mã lịch hẹn / đơn hàng", value: txnRef },
    { label: "Mã giao dịch VNPAY", value: transactionNo },
    { label: "Ngân hàng", value: bankCode },
    { label: "Số tiền", value: formatVnpayAmount(amount) },
    { label: "Thời gian thanh toán", value: payDate },
    { label: "Mã phản hồi", value: responseCode || "Không có dữ liệu" },
  ];

  return (
    <main className="payment-result-page">
      <section className={`payment-result-card ${isSuccess ? "success" : "failed"}`}>
        <div className="payment-result-status">
          {isSuccess ? <FaCircleCheck /> : <FaCircleXmark />}
        </div>

        <div className="payment-result-copy">
          <p className="payment-result-kicker">
            <FaCreditCard />
            Kết quả thanh toán VNPAY
          </p>
          <h1>{result.title}</h1>
          <p>{result.subtitle}</p>
        </div>

        <div className="payment-result-details" aria-label="Chi tiết giao dịch">
          <div className="payment-result-details-title">
            <FaReceipt />
            <span>Chi tiết giao dịch</span>
          </div>

          {details.map((item) => (
            <div className="payment-result-row" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value || "Không có dữ liệu"}</strong>
            </div>
          ))}
        </div>

        <div className="payment-result-actions">
          <Link className="payment-result-btn primary" to="/app/user/appointments">
            <FaListCheck />
            Lịch hẹn của tôi
          </Link>
          <Link className="payment-result-btn secondary" to="/">
            <FaHouse />
            Trang chủ
          </Link>
        </div>
      </section>

      <aside className="payment-result-note">
        <FaCalendarCheck />
        <span>Nếu trạng thái lịch hẹn chưa cập nhật ngay, vui lòng tải lại trang sau vài giây.</span>
      </aside>
    </main>
  );
};

export default PaymentResult;
