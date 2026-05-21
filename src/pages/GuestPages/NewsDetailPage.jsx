import RoutePage from "../../components/Common/RoutePage";
import "./NewsDetailPage.scss";

const acticle = {
  name: "7 bác sĩ Cột sống giỏi và nhiều kinh nghiệm tại Hà Nội",
  img: "https://cdn.bookingcare.vn/fo/w640/2024/08/24/083641-bac-si-dieu-tri-viem-xoang-gioi-ha-noi.png",
  author: "Nguyễn Đức Thuận",
  category: "Cột sống",
  date: "23/04/2026",
  description: [
    {
      title: "Phẫu thuật khúc xạ Femto Pro là gì? Vì sao được đánh giá cao?",
      list: [
        "Femto Pro là phương pháp phẫu thuật khúc xạ hiện đại thuộc nhóm Lasik thế hệ mới, sử dụng hoàn toàn tia laser để điều chỉnh tật khúc xạ như cận thị, loạn thị và viễn thị.",
        "Công nghệ này kết hợp hai loại laser gồm Femtosecond (tạo vạt giác mạc) và Excimer (điều chỉnh độ cận), giúp tăng độ chính xác và hạn chế tối đa sai số trong quá trình mổ.",
        "Điểm khác biệt cốt lõi của Femto Pro so với Lasik truyền thống nằm ở việc loại bỏ hoàn toàn dao vi phẫu. Thay vì sử dụng lưỡi dao cơ học để tạo vạt giác mạc như trước đây, Femto Pro sử dụng laser Femtosecond trên Visumax 800 để thực hiện thao tác này với độ chính xác tính bằng micromet.",
        "Điều này giúp bề mặt vạt mịn hơn, đều hơn và giảm nguy cơ biến chứng liên quan đến cơ học.",
        "Không chỉ dừng lại ở đó, Femto Pro còn được đánh giá cao nhờ khả năng cá nhân hóa điều trị.",
        "Hệ thống laser có thể điều chỉnh dựa trên bản đồ giác mạc của từng người, giúp tối ưu thị lực sau mổ và hạn chế hiện tượng quang sai (như chói sáng hoặc lóa ban đêm).",
      ],
    },
    {
      title: "Có nên mổ cận Femto Pro không?",
      list: [
        "Độ chính xác và an toàn: Nhờ sử dụng tia Laser Femtosecond, việc tạo vạt giác mạc được kiểm soát chính xác đến từng micron. Điều này giúp vạt giác mạc mịn, đều, giảm thiểu tối đa các biến chứng so với dùng dao cơ học.",
        "Thời gian thực hiện nhanh: Quy trình tạo vạt chỉ mất khoảng 5 - 7 giây/mắt (so với 20 giây ở các đời máy cũ). Toàn bộ ca mổ thường chỉ kéo dài khoảng 10 - 15 phút.",
        "Phổ điều trị rộng: Đây là thế mạnh lớn của Femto Pro, có thể xử lý được độ cận lên đến 12 Diop, viễn thị đến 6 Diop và loạn thị đến 6 Diop.",
        "Hồi phục nhanh: Thị lực thường cải thiện rõ rệt chỉ sau 48 giờ.",
        "Trải nghiệm phẫu thuật êm ái, ổn định: Công nghệ này giảm áp lực lên nhãn cầu trong lúc mổ, giúp trải nghiệm nhẹ nhàng và ít gây khó chịu hơn.",
        "Nguy cơ khô mắt tạm thời: Giống như các phương pháp Lasik nói chung, khách hàng có thể cảm thấy khô mắt trong vài tuần đến vài tháng đầu.",
        "Chi phí: Cao hơn phương pháp Lasik truyền thống, nhưng thường thấp hơn Relex Smile.",
      ],
    },
    {
      title: "Chi phí mổ cận Femto Pro tại TP.HCM",
      list: [
        "Hiện nay, chi phí mổ cận Femto Pro dao động trong khoảng 32.000.000 - 40.000.000 VNĐ (2 mắt).",
        "Mức giá này có thể thay đổi tùy thuộc vào nhiều yếu tố như công nghệ sử dụng, tay nghề bác sĩ và gói dịch vụ đi kèm. Một số nơi cung cấp gói cao cấp với dịch vụ chăm sóc riêng biệt, dẫn đến chi phí cao hơn.",
        "Tuy vậy, BookingCare lưu ý bạn đọc lựa chọn địa chỉ mổ cận không nên chỉ dựa vào giá, mà cần cân nhắc tổng thể với chất lượng và độ an toàn.",
      ],
    },
    {
      title: "Review các địa chỉ mổ cận Femto Pro uy tín tại TP.HCM",
      list: [
        "Bệnh viện Mắt Quốc tế DND Sài Gòn",
        "Bệnh viện Chuyên khoa Mắt Cao Thắng",
        "Bệnh viện Mắt Sài Gòn",
      ],
    },
  ],
};

const NewsDetailPage = () => {
  return (
    <div className="news-detail-container">
      <div className="news-header">
        <img src={acticle.img} alt={acticle.name} />
        <h2>{acticle.name}</h2>
        <div className="news-meta">
          <span>Tác giả: {acticle.author}</span>
          <span>Bệnh: {acticle.category}</span>
          <span>Ngày đăng: {acticle.date}</span>
        </div>
      </div>
      <div className="news-content">
        {acticle.description.map((item, index) => (
          <div key={index} className="section">
            <h3>{item.title}</h3>
            <ul>
              {item.list.map((listItem, idx) => (
                <li key={idx}>{listItem}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsDetailPage;
