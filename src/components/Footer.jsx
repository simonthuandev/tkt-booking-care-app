import { Container } from "react-bootstrap";
import { Link } from "react-router";
import {
  BsFacebook,
  BsTiktok,
  BsInstagram,
  BsYoutube,
  BsTelephone,
  BsEnvelope,
  BsGeoAlt,
  BsFillPatchCheckFill
} from "react-icons/bs";
import { FaLock } from "react-icons/fa";
import { FaHeartPulse } from "react-icons/fa6";
import "./Footer.scss";

export default function Footer() {
  const socialList = [
    {icon: BsFacebook, link: 'https://www.facebook.com', label: "Facebook"},
    {icon: BsYoutube, link: 'https://www.youtube.com', label: "Youtube"},
    {icon: BsTiktok, link: 'https://www.tiktok.com', label: "Tiktok"},
    {icon: BsInstagram, link: 'https://www.instagram.com', label: "Instagram"},
  ];

  const contactList = [
    { icon: BsTelephone, label: "Đường dây hỗ trợ", text: "196166202", href: "tel:+"},
    { icon: BsEnvelope, label: "Email", text: "support@tktbookingcare.vn", href: "mailto:" },
    { icon: BsGeoAlt, label: "Trụ sở HCM", text: "97 Man Thiện, phường Tăng Nhơn Phú, TP.HCM", href: "https://maps.app.goo.gl/ey7YXiGa1VYMNgBx6"},
  ];

  const copyrightList = [
    {label: "Điều khoản", href: "#!"},
    {label: "Bảo mật", href: "#!"},
    {label: "Cookie", href: "#!"},
  ]

  const serviceList = [
    {text: 'Đặt khám bác sĩ', link: "/#!"},
    {text: 'Khám từ xa', link: "/#!"},
    {text: 'Khám tại nhà', link: "/#!"},
    {text: 'Xét nghiệm', link: "/#!"},
    {text: 'Gói khám sức khỏe', link: "/#!"},
  ];

  const infoList = [
    { text: "Về chúng tôi", link: "/about" },
    { text: "Điều khoản dịch vụ", link: "/#!" },
    { text: "Chính sách bảo mật", link: "/#!" },
    { text: "Tuyển dụng", link: "/#!" },
    { text: "Tin tức", link: "/#!" },
  ];

  return (
    <footer className="main-footer">
      <Container>
        <div className="row g-4 g-lg-5 footer-top">

          {/* Brand */}
          <div className="col-lg-4">
            <Link to="/" className="footer-brand d-flex align-items-center gap-2 mb-3">
              <div className="brand-icon sm">
                <FaHeartPulse />
              </div>
              <span className="brand-text">
                <span>TKT</span>
                <span>BookingCare</span>
              </span>
            </Link>
            <p className="footer-desc">
              Nền tảng đặt lịch khám bệnh trực tuyến hàng đầu Việt Nam, kết nối bệnh
              nhân với bác sĩ và cơ sở y tế uy tín.
            </p>
            <div className="footer-social">
              {socialList.map(item => {
                const Icon = item.icon;
                return (
                  <a key={item.label} href={item.link} target="_blank">
                    <Icon />
                  </a>
                );
              })}
            </div>
            <div className="footer-cert mt-3">
              <div className="cert-badge">
                <BsFillPatchCheckFill color="teal" />
                <span className="ms-2">Bộ Y Tế Cấp Phép</span>
              </div>
              <div className="cert-badge">
                <FaLock color={"#F5A623"} />
                <span className="ms-2">SSL Bảo mật</span>
              </div>
            </div>
          </div>

          {/* Services links */}
          <div className="col-6 col-lg-2">
            <div className="footer-col-title">Dịch vụ</div>
            <ul className="footer-links">
              {serviceList.map(item => (
                <li key={item.text}>
                  <Link to={item.link}>{item.text}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info links */}
          <div className="col-6 col-lg-2">
            <div className="footer-col-title">Thông tin</div>
            <ul className="footer-links">
              {infoList.map(item => (
                <li key={item.text}>
                  <Link to={item.link}>{item.text}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-4">
            <div className="footer-col-title">Liên hệ & Hỗ trợ</div>
            <ul className="footer-contact">
              {contactList.map(item => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <Icon/>
                    <div>
                      <strong>{item.label}</strong>
                      <br />
                      <a href={item.href} target="_blank">{item.text}</a>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <div className="fb-left">© {new Date().getFullYear()} TKTBookingCare Vietnam. Tất cả quyền được bảo lưu.</div>
          <div className="fb-right">
            {copyrightList.map(item => (
              <a key={item.label} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}