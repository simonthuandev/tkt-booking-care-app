import { Link } from "react-router";
import { useState, useEffect } from "react";
import { specialtyService } from "../../api/appService";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import "./SpecialtiesPage.scss";

const SpecialtiesPage = () => {
  const [specialties, setSpecialties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    specialtyService.specialties()
      .then((res) => {
        if (!isMounted) return;
        setSpecialties(res.data?.data || []);
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="specialties-container">
        {specialties.map((specialty, index) => {
          const name = specialty.name || "ko có";
          const slug = specialty.slug || "ko có";
          const imgUrl = specialty.icon;

          return (
            <Link
              key={specialty.id || index}
              to={`/specialties/${slug}`}
              className="specialty-card"
            >
              <div className="specialty-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', minHeight: '150px' }}>
                <img src={imgUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 className="specialty-name">{name}</h3>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default SpecialtiesPage;
