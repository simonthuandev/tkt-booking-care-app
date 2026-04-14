import { Container } from "react-bootstrap";
import SectionHeader from "../Common/SectionHeader";
import StarRating from "../Common/StarRating";
import { FaArrowRight, FaClipboardList, FaHospital } from "react-icons/fa";
import { BsPersonHeart } from "react-icons/bs";
import { Link } from "react-router-dom";
import { toSlug } from "../../utils/helpers";

const DOCTORS = [
  { img: 'https://randomuser.me/api/portraits/men/32.jpg',   name: 'PGS.TS. Trần Minh Khoa',  spec: 'Tim mạch',     hospital: 'BV Chợ Rẫy, TP.HCM',    rating: 4.9, reviews: 512, price: '350.000đ', avail: true  },
  { img: 'https://randomuser.me/api/portraits/women/65.jpg', name: 'TS.BS. Lê Thu Hằng',      spec: 'Da liễu',     hospital: 'BV Da Liễu TW, HN',      rating: 4.8, reviews: 389, price: '300.000đ', avail: true  },
  { img: 'https://randomuser.me/api/portraits/men/54.jpg',   name: 'GS.TS. Nguyễn Đức Tuấn', spec: 'Nhi khoa',    hospital: 'BV Nhi Đồng 1, TP.HCM',  rating: 4.9, reviews: 621, price: '400.000đ', avail: false },
  { img: 'https://randomuser.me/api/portraits/women/29.jpg', name: 'ThS.BS. Phạm Bích Ngọc',  spec: 'Sản phụ khoa',hospital: 'BV Từ Dũ, TP.HCM',       rating: 4.7, reviews: 278, price: '280.000đ', avail: true  },
];

export default function DoctorsSection() {
  return (
    <section className="section-pad" id="doctors">
      <Container>
        <SectionHeader
          tag="Bác sĩ nổi bật" tagIcon={<BsPersonHeart />}
          title="Đội ngũ" titleEm="chuyên gia hàng đầu"
          sub="Được lựa chọn kỹ càng từ các bệnh viện uy tín nhất cả nước"
        />
        <div className="row g-4">
          {DOCTORS.map(({ img, name, spec, hospital, rating, reviews, price, avail }) => (
            <div key={name} className="col-sm-6 col-lg-3">
              <div className="doc-card">
                <div className="doc-img-wrap">
                  <img src={img} alt={name} />
                  <div className={`doc-avail ${avail ? 'available' : 'busy'}`}>
                    {avail ? 'Còn lịch hôm nay' : 'Lịch gần nhất: mai'}
                  </div>
                </div>
                <div className="doc-body">
                  <div className="doc-name">{name}</div>
                  <div className="doc-spec">
                    <FaClipboardList className="me-1" />{spec}
                  </div>
                  <div className="doc-hospital">
                    <FaHospital className="me-1" />{hospital}
                  </div>
                  <div className="doc-rating">
                    <span className="rating-num">{rating}</span>
                    <div className="stars">
                      <StarRating rating={rating} half={!Number.isInteger(rating)} />
                    </div>
                    <span className="rating-cnt">{reviews} đánh giá</span>
                  </div>
                  <div className="doc-price-row">
                    <span className="doc-price">{price}</span>
                    <button className="btn-book-doc">
                      <Link to={`doctors/${toSlug(name)}`} >
                        Xem bác sĩ
                      </Link>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-5">
          <Link to="/doctors" className="btn-outline-main">
            Xem tất cả bác sĩ 
            <FaArrowRight/>
          </Link>
        </div>
      </Container>
    </section>
  );
}