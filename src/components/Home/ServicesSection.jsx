import { Container } from "react-bootstrap";
import SectionHeader from "../Common/SectionHeader";
import { FaStar, FaArrowRight } from "react-icons/fa";
import DynamicIcon from "../Icons/DynamicIcon";
import { Link } from "react-router";
import { toSlug } from "../../utils/helpers";

const services = [
  { icon: 'cameraVideoFill',       title: 'Khám từ xa (Telemedicine)',  desc: 'Tư vấn video call với bác sĩ chuyên khoa mà không cần đến bệnh viện.',          accent: false },
  { icon: 'houseHeartFill',        title: 'Khám tại nhà',              desc: 'Đội ngũ bác sĩ đến tận nhà thăm khám, xét nghiệm tại chỗ tiện lợi.',            accent: true  },
  { icon: 'fileEarmarkMedicalFill', title: 'Xét nghiệm & Chẩn đoán',  desc: 'Đặt lịch xét nghiệm máu, MRI, CT-Scan tại các phòng lab đối tác.',             accent: false },
  { icon: 'shieldFillPlus',        title: 'Gói khám sức khỏe',         desc: 'Gói kiểm tra sức khỏe định kỳ toàn diện với mức giá ưu đãi.',                   accent: false },
];

export default function ServicesSection() {

  return (
    <section className="services-section section-pad" id="services">
      <Container>
        <SectionHeader
          tag="Dịch vụ" tagIcon={<FaStar />}
          title="Giải pháp y tế" titleEm="toàn diện"
        />
        <div className="row g-4">
          {services.map(({ icon, title, desc, accent }) => (
            <div key={title} className="col-md-6 col-lg-3">
              <div className={`svc-card${accent ? ' svc-card-accent' : ''}`}>
                <div className="svc-icon">
                  <DynamicIcon name={`${icon}`} />
                </div>
                <h5>{title}</h5>
                <p>{desc}</p>
                <Link to={`/services/${toSlug(title)}`} className="svc-link">
                  Tìm hiểu <FaArrowRight />
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-5">
          <Link to="/services" className="btn-outline-main">
            Xem tất cả dịch vụ <FaArrowRight />
          </Link>
        </div>
      </Container>
    </section>
  );
}