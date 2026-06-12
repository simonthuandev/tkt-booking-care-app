import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import SectionHeader from "../Common/SectionHeader";
import { FaHospital, FaArrowRight } from "react-icons/fa";
import { BsGeoAltFill, BsPersonBadge, BsStarFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { hospitalService } from "../../api/appService";

const FALLBACK_HOSPITAL_IMAGE =
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=500&q=80";

export default function HospitalsSection() {
  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    hospitalService
      .hospitals({ page: 1, limit: 3 })
      .then((res) => {
        if (!isMounted) return;
        setHospitals(res.data?.data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy danh sách bệnh viện:", err);
        toast.error("Không thể tải danh sách bệnh viện.");
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="hospital-section" id="hospitals">
      <Container>
        <SectionHeader
          tag="Bệnh viện & Phòng khám" tagIcon={<FaHospital />}
          title="Đối tác" titleEm="tin cậy"
          sub="Hơn 200 cơ sở y tế được thẩm định chất lượng"
        />
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {hospitals.map((hospital) => {
              const {
                id,
                slug,
                name,
                address,
                city,
                type,
                imgURL,
                _count,
              } = hospital;
              const location = address || city || "Chưa cập nhật địa chỉ";
              const doctorCount = _count?.doctors ?? 0;

              return (
                <div key={id || slug} className="col-md-6 col-lg-4">
                  <Link to={`/hospitals/${slug}`} className="hosp-card">
                    <div className={`hosp-badge ${type || "public"}`}>
                      {type === "private" ? "Tư nhân" : "Công lập"}
                    </div>
                    <div className="hosp-img">
                      <img src={imgURL || FALLBACK_HOSPITAL_IMAGE} alt={name} />
                    </div>
                    <div className="hosp-body">
                      <div className="hosp-name">{name}</div>
                      <div className="hosp-loc">
                        <BsGeoAltFill />
                        <span className="ms-1">{location}</span>
                      </div>
                      <div className="hosp-meta">
                        <span>
                          <BsPersonBadge />
                          <span className="ms-1">{doctorCount} bác sĩ</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
        <div className="text-center mt-5">
          <Link to="/hospitals" className="btn-outline-main">
            Xem tất cả bệnh viện <FaArrowRight />
          </Link>
        </div>
      </Container>
    </section>
  );
}
