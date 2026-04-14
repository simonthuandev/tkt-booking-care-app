import { Container } from "react-bootstrap";
import SectionHeader from "../Common/SectionHeader";
import { FaHospital, FaArrowRight } from "react-icons/fa";
import { BsGeoAltFill, BsPersonBadge, BsStarFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { toSlug } from "../../utils/helpers";

const HOSPITALS = [
  { img: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=500&q=80', name: 'Bệnh viện Chợ Rẫy',  loc: 'Quận 5, TP. Hồ Chí Minh', type: 'public',  doctors: 320, rating: 4.8 },
  { img: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=500&q=80', name: 'Bệnh viện Vinmec',   loc: 'Times City, Hà Nội',       type: 'private', doctors: 180, rating: 4.9 },
  { img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&q=80', name: 'Bệnh viện Bạch Mai', loc: 'Đống Đa, Hà Nội',           type: 'public',  doctors: 410, rating: 4.7 },
];

export default function HospitalsSection() {
  return (
    <section className="hospital-section" id="hospitals">
      <Container>
        <SectionHeader
          tag="Bệnh viện & Phòng khám" tagIcon={<FaHospital />}
          title="Đối tác" titleEm="tin cậy"
          sub="Hơn 200 cơ sở y tế được thẩm định chất lượng"
        />
        <div className="row g-4">
          {HOSPITALS.map(({ img, name, loc, type, doctors, rating }) => (
            <div key={name} className="col-md-6 col-lg-4">
              <Link to={`/hospitals/${toSlug(name)}`} className="hosp-card">
                <div className={`hosp-badge ${type}`}>
                  {type === 'public' ? 'Công lập' : 'Tư nhân'}
                </div>
                <div className="hosp-img">
                  <img src={img} alt={name} />
                </div>
                <div className="hosp-body">
                  <div className="hosp-name">{name}</div>
                  <div className="hosp-loc">
                    <BsGeoAltFill />
                    <span className="ms-1">{loc}</span>
                  </div>
                  <div className="hosp-meta">
                    <span>
                      <BsPersonBadge />
                      <span className="ms-1">{doctors} bác sĩ</span>
                    </span>
                    <span>
                      <BsStarFill />
                      <span className="ms-1">{rating}</span>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-5">
          <Link to="/hospitals" className="btn-outline-main">
            Xem tất cả bệnh viện <FaArrowRight />
          </Link>
        </div>
      </Container>
    </section>
  );
}
