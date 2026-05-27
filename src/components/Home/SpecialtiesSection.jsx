import { Container } from 'react-bootstrap';
import SectionHeader from "../Common/SectionHeader";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaBorderAll } from 'react-icons/fa6';
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { specialtyService } from '../../api/appService';
import LoadingSpinner from '../Common/LoadingSpinner';

export default function SpecialtiesSection() {
  const [specialties, setSpecialties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    specialtyService.specialties()
      .then((res) => {
        if (!isMounted) return;
        const apiData = res.data?.data || [];

        // Map API data to UI structure strictly without local palettes or fallback icons
        const mapped = apiData.map((item) => {
          return {
            id: item.id,
            name: item.name || "ko có",
            slug: item.slug || "ko có",
            icon: item.icon || "",
            count: item._count?.doctors !== undefined ? `${item._count.doctors} bác sĩ` : "ko có",
            more: false,
          };
        });

        setSpecialties(mapped);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy danh sách chuyên khoa:", err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const displayedSpecialties = specialties.slice(0, 7);
  const displayList = [...displayedSpecialties];

  if (specialties.length > 0) {
    displayList.push({
      icon: '',
      name: 'Xem tất cả',
      count: `${specialties.length}+ chuyên khoa`,
      more: true,
      slug: ''
    });
  }

  return (
    <section className="section-pad" id="specialties">
      <Container>
        <SectionHeader
          tag="Chuyên khoa" tagIcon={<BsGrid3X3GapFill />}
          title="Đặt khám theo" titleEm="chuyên khoa"
          sub="Chọn đúng chuyên khoa – gặp đúng bác sĩ – nhận đúng kết quả"
        />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="row g-3 g-md-4 specialty-grid">
            {displayList.map(({ icon, name, count, more, slug }) => (
              <div key={name} className="col-6 col-md-4 col-lg-3">
                <Link
                  to={more ? "/specialties" : `/specialties/${slug}`}
                  className={`sp-card${more ? ' sp-card-more' : ''}`}
                >
                  <div
                    className="specialty-image"
                    style={{
                      width: '100%',
                      aspectRatio: '1 / 1',
                      overflow: 'hidden',
                      borderRadius: '8px',
                      background: '#f8f9fa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {more ? (
                      <FaBorderAll style={{ fontSize: '2.5rem' }} />
                    ) : icon ? (
                      <img
                        src={icon}
                        alt={name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          padding: '16px'
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: '14px', color: '#dc3545' }}>ko có</span>
                    )}
                  </div>
                  <div className="sp-name">{name}</div>
                  <div className="sp-count">{count}</div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
