import RoutePage from "../../components/Common/RoutePage";
import "./ContactPage.scss";

const images = [
  "https://cdn.bookingcare.vn/fo/w1920/2023/03/27/180039-logo-trong-rang-sg-1.png",
  "https://cdn.bookingcare.vn/fo/w1920/2019/09/26/093307logo-pk-da-lieu-bs-thai-ha.jpg",
  "https://cdn.bookingcare.vn/fo/w1920/2023/01/16/141014-mat-viet-nga-logo.png",
  "https://cdn.bookingcare.vn/fo/w1920/2022/12/09/115911-12-logo-hn.png",
  "https://cdn.bookingcare.vn/fo/w1920/2023/11/16/165210-logo-nha-khoa-lac-viet.jpg",
  "https://cdn.bookingcare.vn/fo/w1920/2022/05/12/101707-logo-sg.png",
  "https://cdn.bookingcare.vn/fo/w1920/2022/08/29/104922-logo-med-tai-ha-noi--01.png",
  "https://cdn.bookingcare.vn/fo/w1920/2022/07/14/155206-logo-y-duoc-1.jpg",
  "https://cdn.bookingcare.vn/fo/w1920/2018/06/18/083122lo-go-viet-duc.jpg",
];

const ContactPage = () => {
  return (
    <>
      <div className="header-contact">
        <h1>HỢP TÁC CÙNG BOOKINGCARE</h1>
        <p>Kết nối bệnh nhân, nâng tầm thương hiệu</p>

        <div className="info">
          <div className="d-flex flex-column">
            <h2>1.500.000 + </h2>
            <h3>LƯỢT TRUY CẬP/ THÁNG</h3>
          </div>
          <div className="d-flex flex-column">
            <h2>300.000 +</h2>
            <h3>NGƯỜI ĐÃ SỬ DỤNG</h3>
          </div>
          <div className="d-flex flex-column">
            <h2>2.000 +</h2>
            <h3>BÁC SĨ</h3>
          </div>
          <div className="d-flex flex-column">
            <h2>300 +</h2>
            <h3>CƠ SỞ Y TẾ</h3>
          </div>
        </div>
        <div className="body-contact">
          <div>
            <div>Tăng số lượng bệnh nhân</div>
            <div>Xây dựng thương hiệu</div>
            <div>Nân cao trải nghiệm khách hàng</div>
          </div>
          <h3>Hơn 300 đơn vị đã hợp tác với BookingCare</h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            {images.map((item, index) => (
              <img key={index} src={item} alt="logo" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
