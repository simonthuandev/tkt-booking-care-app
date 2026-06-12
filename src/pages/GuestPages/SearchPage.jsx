import { useEffect, useMemo, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import {
  FaChevronLeft,
  FaChevronRight,
  FaClipboardList,
  FaHospital,
  FaLocationDot,
  FaMagnifyingGlass,
  FaStar,
  FaUserDoctor,
  FaXmark,
} from "react-icons/fa6";
import { hospitalService, searchService } from "../../api/appService";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import "./SearchPage.scss";

const SEARCH_TYPES = [
  { value: "all", label: "Tất cả", icon: FaMagnifyingGlass },
  { value: "doctor", label: "Bác sĩ", icon: FaUserDoctor },
  { value: "hospital", label: "Bệnh viện", icon: FaHospital },
  { value: "specialty", label: "Chuyên khoa", icon: FaClipboardList },
];

const QUICK_TERMS = ["Tim mạch", "Nhi khoa", "Da liễu", "Nha khoa", "Mắt"];
const ALL_CITIES = "";
const ALL_LIMIT = 6;
const LIST_LIMIT = 10;
const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?background=0fa39b&color=fff&size=200&name=";
const FALLBACK_HOSPITAL_IMAGE =
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&q=80";
const FALLBACK_SPECIALTY_IMAGE =
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=80";

const getTypeConfig = (type) =>
  SEARCH_TYPES.find((item) => item.value === type) || SEARCH_TYPES[0];

const normalizeType = (type) =>
  SEARCH_TYPES.some((item) => item.value === type) ? type : "all";

const getHospitalTypeLabel = (type) => (type === "private" ? "Tư nhân" : "Công lập");

const getDoctorName = (doctor) => {
  const fullName = `${doctor?.user?.lastName || ""} ${doctor?.user?.firstName || ""}`.trim();
  return fullName || "Bác sĩ chưa cập nhật tên";
};

const getMetaTotal = (result, type) => {
  if (!result) return 0;
  if (type === "all") return result.meta?.total || 0;
  return result.meta?.total || 0;
};

const truncate = (text, maxLength = 140) => {
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;
};

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";
  const type = normalizeType(searchParams.get("type") || "all");
  const city = searchParams.get("city") || ALL_CITIES;
  const page = Math.max(Number(searchParams.get("page") || 1), 1);

  const [searchInput, setSearchInput] = useState(query);
  const [cities, setCities] = useState([]);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const requestKey = `${query}|${type}|${city}|${page}`;
  const isWaitingForResult = Boolean(query && !hasError && result?.requestKey !== requestKey);
  const isSearching = isLoading || isWaitingForResult;

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    let isMounted = true;

    hospitalService
      .getCities()
      .then((res) => {
        if (!isMounted) return;
        setCities(res.data?.data || []);
      })
      .catch((err) => {
        console.error("Lỗi lấy danh sách thành phố:", err);
        toast.error("Không thể tải danh sách thành phố.");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (!query) {
      setResult(null);
      setHasError(false);
      setIsLoading(false);
      return () => {
        isMounted = false;
      };
    }

    const params = {
      q: query,
      type,
      page,
      limit: type === "all" ? ALL_LIMIT : LIST_LIMIT,
      ...(city && { city }),
    };

    searchService
      .search(params)
      .then((res) => {
        if (!isMounted) return;
        setResult({ ...(res.data || {}), requestKey });
        setHasError(false);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi tìm kiếm:", err);
        toast.error(err.response?.data?.message || "Không thể tải kết quả tìm kiếm.");
        if (!isMounted) return;
        setResult(null);
        setHasError(true);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [query, type, city, page, requestKey]);

  const totals = useMemo(() => {
    if (!result) return { doctors: 0, hospitals: 0, specialties: 0, total: 0 };
    if (type === "all") {
      const metaTotals = result.meta?.totals || {};
      return {
        doctors: metaTotals.doctors || 0,
        hospitals: metaTotals.hospitals || 0,
        specialties: metaTotals.specialties || 0,
        total: result.meta?.total || 0,
      };
    }
    return {
      doctors: type === "doctor" ? result.meta?.total || 0 : 0,
      hospitals: type === "hospital" ? result.meta?.total || 0 : 0,
      specialties: type === "specialty" ? result.meta?.total || 0 : 0,
      total: result.meta?.total || 0,
    };
  }, [result, type]);

  const updateParams = (nextValues) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(nextValues).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "" || value === "all") {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });

    setSearchParams(next);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextQuery = searchInput.trim();
    setIsLoading(Boolean(nextQuery));
    setHasError(false);
    setResult(null);

    if (!nextQuery) {
      setSearchParams({});
      return;
    }

    const next = new URLSearchParams(searchParams);
    next.set("q", nextQuery);
    next.delete("page");
    if (type !== "all") next.set("type", type);
    if (city) next.set("city", city);
    setSearchParams(next);
  };

  const handleClear = () => {
    setSearchInput("");
    setResult(null);
    setHasError(false);
    setIsLoading(false);
    setSearchParams({});
  };

  const handleTypeChange = (nextType) => {
    if (nextType === type) return;
    setIsLoading(Boolean(query));
    setHasError(false);
    updateParams({ type: nextType, page: "" });
  };

  const handleCityChange = (e) => {
    setIsLoading(Boolean(query));
    setHasError(false);
    updateParams({ city: e.target.value, page: "" });
  };

  const handlePageChange = ({ selected }) => {
    setIsLoading(true);
    setHasError(false);
    updateParams({ page: selected + 1 });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const switchToType = (nextType) => {
    setIsLoading(Boolean(query));
    setHasError(false);
    updateParams({ type: nextType, page: "" });
  };

  const renderDoctorCard = (doctor) => {
    const fullName = getDoctorName(doctor);
    const avatar =
      doctor.imgURL ||
      doctor.user?.avatar ||
      `${DEFAULT_AVATAR}${encodeURIComponent(fullName)}`;
    const specialty = doctor.specialties?.[0]?.specialty?.name || "Chưa cập nhật chuyên khoa";
    const hospitals = doctor.hospitals || [];
    const hospitalDisplay =
      hospitals.length > 0
        ? hospitals.map((item) => item.hospital?.name).filter(Boolean).join(", ")
        : "Chưa cập nhật bệnh viện";
    const cityDisplay =
      hospitals.find((item) => item.hospital?.city)?.hospital?.city || "Chưa cập nhật";
    const priceDisplay = doctor.consultationFee
      ? `${doctor.consultationFee.toLocaleString("vi-VN")}đ`
      : "Liên hệ";

    return (
      <Link key={doctor.id || doctor.slug} to={`/doctors/${doctor.slug}`} className="search-card doctor">
        <div className="search-card-media avatar">
          <img src={avatar} alt={fullName} />
        </div>
        <div className="search-card-body">
          <div className="search-card-kicker">
            <FaUserDoctor />
            Bác sĩ
          </div>
          <h3>{fullName}</h3>
          <div className="search-card-meta">
            <span>
              <FaClipboardList />
              {specialty}
            </span>
            <span>
              <FaHospital />
              {hospitalDisplay}
            </span>
            <span>
              <FaLocationDot />
              {cityDisplay}
            </span>
          </div>
          <div className="search-card-footer">
            <span className="rating">
              <FaStar />
              {doctor.rating || 0} ({doctor.totalReviews || 0})
            </span>
            {doctor.experience && <span>{doctor.experience} năm kinh nghiệm</span>}
            <strong>{priceDisplay}</strong>
          </div>
        </div>
      </Link>
    );
  };

  const renderHospitalCard = (hospital) => (
    <Link key={hospital.id || hospital.slug} to={`/hospitals/${hospital.slug}`} className="search-card hospital">
      <div className="search-card-media">
        <img src={hospital.imgURL || FALLBACK_HOSPITAL_IMAGE} alt={hospital.name} />
      </div>
      <div className="search-card-body">
        <div className="search-card-kicker">
          <FaHospital />
          {getHospitalTypeLabel(hospital.type)}
        </div>
        <h3>{hospital.name}</h3>
        <p>{truncate(hospital.description) || "Cơ sở y tế đang cập nhật mô tả."}</p>
        <div className="search-card-meta">
          <span>
            <FaLocationDot />
            {hospital.address || hospital.city || "Chưa cập nhật địa chỉ"}
          </span>
          <span>
            <FaUserDoctor />
            {hospital._count?.doctors ?? 0} bác sĩ
          </span>
        </div>
      </div>
    </Link>
  );

  const renderSpecialtyCard = (specialty) => (
    <Link key={specialty.id || specialty.slug} to={`/specialties/${specialty.slug}`} className="search-card specialty">
      <div className="search-card-media">
        <img src={specialty.imgURL || FALLBACK_SPECIALTY_IMAGE} alt={specialty.name} />
      </div>
      <div className="search-card-body">
        <div className="search-card-kicker">
          <FaClipboardList />
          Chuyên khoa
        </div>
        <h3>{specialty.name}</h3>
        <p>{truncate(specialty.description) || "Chuyên khoa đang cập nhật mô tả."}</p>
        <div className="search-card-meta">
          <span>
            <FaUserDoctor />
            {specialty._count?.doctors ?? 0} bác sĩ
          </span>
        </div>
      </div>
    </Link>
  );

  const renderSection = ({ title, total, items, typeValue, renderItem }) => (
    <section className="search-result-section">
      <div className="search-section-header">
        <div>
          <span>{total} kết quả</span>
          <h2>{title}</h2>
        </div>
        {total > items.length && (
          <button type="button" onClick={() => switchToType(typeValue)}>
            Xem tất cả
          </button>
        )}
      </div>
      {items.length > 0 ? (
        <div className="search-card-list">{items.map(renderItem)}</div>
      ) : (
        <div className="search-section-empty">Không có kết quả trong nhóm này.</div>
      )}
    </section>
  );

  const renderAllResults = () => {
    const data = result?.data || {};
    return (
      <>
        {renderSection({
          title: "Bác sĩ",
          total: totals.doctors,
          items: data.doctors || [],
          typeValue: "doctor",
          renderItem: renderDoctorCard,
        })}
        {renderSection({
          title: "Bệnh viện",
          total: totals.hospitals,
          items: data.hospitals || [],
          typeValue: "hospital",
          renderItem: renderHospitalCard,
        })}
        {renderSection({
          title: "Chuyên khoa",
          total: totals.specialties,
          items: data.specialties || [],
          typeValue: "specialty",
          renderItem: renderSpecialtyCard,
        })}
      </>
    );
  };

  const renderTypedResults = () => {
    const items = result?.data || [];
    const renderItem =
      type === "doctor"
        ? renderDoctorCard
        : type === "hospital"
          ? renderHospitalCard
          : renderSpecialtyCard;

    if (items.length === 0) {
      return (
        <div className="search-empty">
          <FaMagnifyingGlass />
          <h2>Không tìm thấy kết quả phù hợp</h2>
          <p>Thử đổi từ khóa, bỏ lọc thành phố hoặc tìm trong nhóm khác.</p>
        </div>
      );
    }

    return (
      <>
        <section className="search-result-section">
          <div className="search-section-header">
            <div>
              <span>{getMetaTotal(result, type)} kết quả</span>
              <h2>{getTypeConfig(type).label}</h2>
            </div>
          </div>
          <div className="search-card-list">{items.map(renderItem)}</div>
        </section>

        {result?.meta?.totalPages > 1 && (
          <div className="search-pagination-wrap">
            <ReactPaginate
              pageCount={result.meta.totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={handlePageChange}
              forcePage={page - 1}
              previousLabel={<FaChevronLeft />}
              nextLabel={<FaChevronRight />}
              breakLabel="..."
              containerClassName="search-pagination"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakClassName="page-item"
              breakLinkClassName="page-link"
              activeClassName="active"
              disabledClassName="disabled"
            />
            <p>
              Trang {page} / {result.meta.totalPages} · Tổng {result.meta.total} kết quả
            </p>
          </div>
        )}
      </>
    );
  };

  const hasNoAllResults =
    type === "all" && result && totals.total === 0 && !hasError && !isSearching;

  return (
    <main className="search-page">
      <section className="search-hero">
        <div>
          <span className="search-eyebrow">Tìm kiếm tổng hợp</span>
          <h1>Tìm bác sĩ, bệnh viện và chuyên khoa</h1>
          <p>Nhập từ khóa để xem nhanh các kết quả phù hợp trên toàn hệ thống.</p>
        </div>
      </section>

      <section className="search-panel">
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="search-input-wrap">
            <FaMagnifyingGlass />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Nhập tên bác sĩ, chuyên khoa, bệnh viện..."
            />
            {searchInput && (
              <button type="button" onClick={handleClear} aria-label="Xoá tìm kiếm">
                <FaXmark />
              </button>
            )}
          </div>
          <select value={city} onChange={handleCityChange} aria-label="Lọc theo thành phố">
            <option value={ALL_CITIES}>Tất cả thành phố</option>
            {cities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button type="submit" className="search-submit">
            <FaMagnifyingGlass />
            Tìm kiếm
          </button>
        </form>

        <div className="search-tabs" role="tablist" aria-label="Loại kết quả tìm kiếm">
          {SEARCH_TYPES.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.value}
                type="button"
                className={type === item.value ? "active" : ""}
                onClick={() => handleTypeChange(item.value)}
              >
                <Icon />
                {item.label}
              </button>
            );
          })}
        </div>
      </section>

      {!query ? (
        <section className="search-empty search-landing">
          <FaMagnifyingGlass />
          <h2>Bạn muốn tìm gì hôm nay?</h2>
          <p>Gõ từ khóa hoặc chọn một gợi ý nhanh để bắt đầu.</p>
          <div className="search-suggestions">
            {QUICK_TERMS.map((term) => (
              <Link key={term} to={`/search?q=${encodeURIComponent(term)}`}>
                {term}
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <>
          <section className="search-results-summary">
            <div>
              <span>Kết quả cho</span>
              <strong>"{query}"</strong>
            </div>
            <p>
              {isSearching
                ? "Đang tìm kiếm..."
                : hasError
                  ? "Có lỗi xảy ra khi tải kết quả."
                  : `${totals.total} kết quả${city ? ` tại ${city}` : ""}`}
            </p>
          </section>

          {isSearching ? (
            <div className="search-loading">
              <LoadingSpinner />
            </div>
          ) : hasError ? (
            <div className="search-empty">
              <FaMagnifyingGlass />
              <h2>Không thể tải kết quả</h2>
              <p>Vui lòng thử lại sau ít phút.</p>
            </div>
          ) : hasNoAllResults ? (
            <div className="search-empty">
              <FaMagnifyingGlass />
              <h2>Không tìm thấy kết quả phù hợp</h2>
              <p>Thử đổi từ khóa hoặc bỏ lọc thành phố.</p>
            </div>
          ) : type === "all" ? (
            renderAllResults()
          ) : (
            renderTypedResults()
          )}
        </>
      )}
    </main>
  );
};

export default SearchPage;
