import { useEffect, useRef, useState } from "react";
import ReactPaginateModule from "react-paginate";
import { Link } from "react-router";
import { toast } from "react-toastify";
import {
  FaChevronLeft,
  FaChevronRight,
  FaLocationDot,
  FaMagnifyingGlass,
  FaRegHospital,
  FaUserDoctor,
  FaXmark,
} from "react-icons/fa6";
import { hospitalService } from "../../api/appService";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import "./HospitalsPage.scss";

const PAGE_LIMIT = 12;
const DEBOUNCE_MS = 400;
const ALL_CITIES = "Tất cả";
const ALL_TYPES = "";
const FALLBACK_HOSPITAL_IMAGE =
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&q=80";
const ReactPaginate = ReactPaginateModule.default || ReactPaginateModule;

const TYPE_OPTIONS = [
  { value: ALL_TYPES, label: "Tất cả" },
  { value: "public", label: "Công lập" },
  { value: "private", label: "Tư nhân" },
];

const getHospitalTypeLabel = (type) => (type === "private" ? "Tư nhân" : "Công lập");

const HospitalsPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [cities, setCities] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: PAGE_LIMIT, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const [selectedCity, setSelectedCity] = useState(ALL_CITIES);
  const [selectedType, setSelectedType] = useState(ALL_TYPES);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debounceTimer = useRef(null);

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

    const params = {
      page: currentPage + 1,
      limit: PAGE_LIMIT,
      ...(searchQuery && { search: searchQuery }),
      ...(selectedCity !== ALL_CITIES && { city: selectedCity }),
      ...(selectedType && { type: selectedType }),
    };

    hospitalService
      .hospitals(params)
      .then((res) => {
        if (!isMounted) return;
        setHospitals(res.data?.data || []);
        setMeta(res.data?.meta || { total: 0, page: 1, limit: PAGE_LIMIT, totalPages: 1 });
        setHasError(false);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy danh sách bệnh viện:", err);
        toast.error("Không thể tải danh sách bệnh viện.");
        if (!isMounted) return;
        setHospitals([]);
        setHasError(true);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentPage, searchQuery, selectedCity, selectedType]);

  useEffect(() => {
    return () => clearTimeout(debounceTimer.current);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setIsLoading(true);
      setHasError(false);
      setSearchQuery(value.trim());
      setCurrentPage(0);
    }, DEBOUNCE_MS);
  };

  const handleClearSearch = () => {
    setIsLoading(true);
    setHasError(false);
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(0);
    clearTimeout(debounceTimer.current);
  };

  const handleCityChange = (e) => {
    setIsLoading(true);
    setHasError(false);
    setSelectedCity(e.target.value);
    setCurrentPage(0);
  };

  const handleTypeChange = (type) => {
    setIsLoading(true);
    setHasError(false);
    setSelectedType(type);
    setCurrentPage(0);
  };

  const handlePageChange = ({ selected }) => {
    setIsLoading(true);
    setHasError(false);
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearCityFilter = () => {
    setIsLoading(true);
    setHasError(false);
    setSelectedCity(ALL_CITIES);
    setCurrentPage(0);
  };

  const clearTypeFilter = () => {
    setIsLoading(true);
    setHasError(false);
    setSelectedType(ALL_TYPES);
    setCurrentPage(0);
  };

  const hasActiveFilters = searchQuery || selectedCity !== ALL_CITIES || selectedType;
  const totalPages = Math.max(Number(meta.totalPages) || 1, 1);
  const safeCurrentPage = Math.min(currentPage, totalPages - 1);

  return (
    <div className="hospitals-wrapper">
      <div className="hospitals-header">
        <h1 className="hospitals-title">Phòng khám và Bệnh viện</h1>
        <p className="hospitals-subtitle">
          {isLoading
            ? "Đang tải danh sách cơ sở y tế..."
            : `Tìm thấy ${meta.total || 0} cơ sở y tế uy tín trên toàn quốc`}
        </p>
      </div>

      <div className="filter-section">
        <div className="filter-content">
          <div className="filter-group search-filter-group">
            <label htmlFor="search-name" className="filter-label">
              Tìm kiếm theo tên
            </label>
            <div className="hospital-search-wrap">
              <FaMagnifyingGlass className="search-icon" />
              <input
                id="search-name"
                type="text"
                className="search-input"
                placeholder="Nhập tên bệnh viện..."
                value={searchInput}
                onChange={handleSearchChange}
              />
              {searchInput && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={handleClearSearch}
                  aria-label="Xoá tìm kiếm"
                >
                  <FaXmark />
                </button>
              )}
            </div>
          </div>

          <div className="filter-group">
            <label htmlFor="city-select" className="filter-label">
              Lọc theo tỉnh/thành phố
            </label>
            <select
              id="city-select"
              className="city-select"
              value={selectedCity}
              onChange={handleCityChange}
            >
              <option value={ALL_CITIES}>{ALL_CITIES}</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group hospital-type-filter">
            <span className="filter-label">Loại cơ sở</span>
            <div className="type-toggle-group" role="group" aria-label="Lọc theo loại bệnh viện">
              {TYPE_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  className={`type-toggle ${selectedType === option.value ? "active" : ""}`}
                  onClick={() => handleTypeChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="hospital-active-filters">
          {searchQuery && (
            <span className="filter-tag">
              Tìm: "{searchQuery}"
              <button type="button" onClick={handleClearSearch} aria-label="Xoá tìm kiếm">
                <FaXmark />
              </button>
            </span>
          )}
          {selectedCity !== ALL_CITIES && (
            <span className="filter-tag">
              {selectedCity}
              <button type="button" onClick={clearCityFilter} aria-label="Xoá lọc thành phố">
                <FaXmark />
              </button>
            </span>
          )}
          {selectedType && (
            <span className="filter-tag">
              {getHospitalTypeLabel(selectedType)}
              <button type="button" onClick={clearTypeFilter} aria-label="Xoá lọc loại cơ sở">
                <FaXmark />
              </button>
            </span>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="hospitals-loading">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="hospitals-container">
          {hospitals.length > 0 ? (
            hospitals.map((hospital) => {
              const { id, slug, name, city, address, type, imgURL, _count } = hospital;
              const doctorCount = _count?.doctors ?? 0;

              return (
                <Link
                  key={id || slug}
                  to={`/hospitals/${slug}`}
                  className="hospital-card"
                >
                  <div className="hospital-image">
                    <img
                      src={imgURL || FALLBACK_HOSPITAL_IMAGE}
                      alt={name}
                      loading="lazy"
                    />
                    <span className="city-badge">{city || "Chưa cập nhật"}</span>
                    <span className={`hospital-type-badge ${type || "public"}`}>
                      {getHospitalTypeLabel(type)}
                    </span>
                  </div>
                  <div className="hospital-card-body">
                    <h3 className="hospital-name">{name}</h3>
                    <div className="hospital-address">
                      <FaLocationDot />
                      <span>{address || city || "Chưa cập nhật địa chỉ"}</span>
                    </div>
                    <div className="hospital-meta">
                      <span>
                        <FaUserDoctor />
                        {doctorCount} bác sĩ
                      </span>
                      <span>
                        <FaRegHospital />
                        {getHospitalTypeLabel(type)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="no-results">
              <FaRegHospital className="no-results-icon" />
              <p>
                {hasError
                  ? "Không thể tải danh sách cơ sở y tế. Vui lòng thử lại sau."
                  : "Không tìm thấy cơ sở y tế phù hợp."}
              </p>
            </div>
          )}
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <div className="doctors-pagination-wrap hospitals-pagination-wrap">
          <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={handlePageChange}
            forcePage={safeCurrentPage}
            previousLabel={<FaChevronLeft />}
            nextLabel={<FaChevronRight />}
            breakLabel="..."
            containerClassName="doctors-pagination"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item page-prev"
            previousLinkClassName="page-link"
            nextClassName="page-item page-next"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            activeClassName="active"
            disabledClassName="disabled"
          />
          <div className="pagination-info">
            Trang {safeCurrentPage + 1} / {totalPages} &nbsp;·&nbsp; Tổng {meta.total} cơ sở
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalsPage;
