import { Container } from 'react-bootstrap';
import SectionHeader from "../Common/SectionHeader";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaBorderAll, FaStethoscope } from 'react-icons/fa6';
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { specialtyService } from '../../api/appService';
import LoadingSpinner from '../Common/LoadingSpinner';

export default function SpecialtiesSection() {
  const [specialties, setSpecialties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Lấy 8 chuyên khoa để hiển thị 7 + 1 nút "Xem tất cả"
    specialtyService.specialties({ limit: 8, page: 1 })
      .then((res) => {
        if (!isMounted) return;

        // Backend trả về { data, meta } — field ảnh là imgURL (không phải icon)
        const apiData = res.data?.data || [];

        const mapped = apiData.map((item) => ({
          id:    item.id,
          name:  item.name,
          slug:  item.slug,
          imgURL: item.imgURL || null,           // ✅ đúng field từ backend
          count: `${item._count?.doctors ?? 0} bác sĩ`,
          more:  false,
        }));

        setSpecialties(mapped);
      })
      .catch((err) => {
        console.error("Lỗi lấy danh sách chuyên khoa:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  // Hiển thị tối đa 7 chuyên khoa thực, phần còn lại là nút "Xem tất cả"
  const displayedSpecialties = specialties.slice(0, 7);
  const displayList = [...displayedSpecialties];

  if (specialties.length > 0) {
    displayList.push({
      imgURL: null,
      name:  'Xem tất cả',
      count: `${specialties.length}+ chuyên khoa`,
      more:  true,
      slug:  '',
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
            {displayList.map(({ imgURL, name, count, more, slug }) => (
              <div key={name} className="col-6 col-md-4 col-lg-3">
                <Link
                  to={more ? "/specialties" : `/specialties/${slug}`}
                  className={`sp-card${more ? ' sp-card-more' : ''}`}
                >
                  {/* ── Thumbnail ─────────────────────────────────── */}
                  <div
                    className="specialty-image"
                    style={{
                      width: '100%',
                      aspectRatio: '1 / 1',
                      overflow: 'hidden',
                      borderRadius: '8px',
                      background: '#f0fafb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {more ? (
                      /* Nút "Xem tất cả" */
                      <FaBorderAll style={{ fontSize: '2.5rem', color: '#0ba3a3' }} />
                    ) : imgURL ? (
                      /* Có ảnh từ backend → hiển thị */
                      <img
                        src={imgURL}
                        alt={name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          padding: '16px',
                        }}
                        onError={(e) => {
                          // Nếu ảnh lỗi → ẩn và hiện icon fallback
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}

                    {/* Fallback icon khi không có imgURL hoặc ảnh lỗi */}
                    {!more && (
                      <span
                        style={{
                          display: imgURL ? 'none' : 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%',
                          height: '100%',
                        }}
                      >
                        <FaStethoscope style={{ fontSize: '2.5rem', color: '#0ba3a3', opacity: 0.5 }} />
                      </span>
                    )}
                  </div>

                  {/* ── Name & Doctor count ──────────────────────── */}
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
