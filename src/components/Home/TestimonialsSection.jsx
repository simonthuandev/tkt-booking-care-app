import { Container } from "react-bootstrap";
import SectionHeader from "../Common/SectionHeader";
import StarRating from "../Common/StarRating";
import { BsChatHeartFill, BsGeoAlt } from "react-icons/bs";

const TESTIMONIALS = [
  { img: 'https://randomuser.me/api/portraits/women/68.jpg', name: 'Nguyễn Thị Mai',  loc: 'TP. Hồ Chí Minh', stars: 5, half: false, text: '"Đặt lịch nhanh chóng, bác sĩ đúng giờ, giao diện dễ dùng. Mình đã giới thiệu cho cả gia đình dùng TKTBookingCare rồi!"' },
  { img: 'https://randomuser.me/api/portraits/men/46.jpg',   name: 'Lê Văn Hùng',     loc: 'Hà Nội',           stars: 5, half: false, text: '"Con tôi bị sốt đêm, đặt lịch khám sáng sớm qua app chỉ mất 2 phút. Bác sĩ Nhi Đồng rất tận tâm. Cảm ơn TKTBookingCare!"'},
  { img: 'https://randomuser.me/api/portraits/women/33.jpg', name: 'Trần Thúy Linh',  loc: 'Đà Nẵng',          stars: 4, half: true,  text: '"Nhân viên hỗ trợ nhiệt tình, hủy và đổi lịch dễ dàng. Hệ thống nhắc lịch trước 1 ngày rất tiện, không bao giờ quên khám nữa."' },
];

export default function TestimonialsSection() {
  return (
    <section className="section-pad testi-section">
      <Container>
        <SectionHeader
          tag="Đánh giá" tagIcon={<BsChatHeartFill />}
          title="Người dùng" titleEm="nói gì?"
        />
        <div className="row g-4">
          {TESTIMONIALS.map(({ img, name, loc, stars, half, text }) => (
            <div key={name} className="col-md-4">
              <div className={`testi-card`}>
                <div className="testi-stars">
                  <StarRating rating={stars} half={half} />
                </div>
                <p className="testi-text">{text}</p>
                <div className="testi-user">
                  <img src={img} alt={name} />
                  <div>
                    <div className="testi-name">{name}</div>
                    <div className="testi-loc">
                      <BsGeoAlt className="me-1" />{loc}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
