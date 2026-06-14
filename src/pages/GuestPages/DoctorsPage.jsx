import { useState, useEffect, useRef } from "react";
import ReactPaginateModule from "react-paginate";
import { FaChevronLeft, FaChevronRight, FaClipboardList, FaHospital, FaStar, FaMagnifyingGlass, FaChevronDown, FaXmark } from "react-icons/fa6";
import { Link } from "react-router";
import { doctorService, specialtyService } from "../../api/appService";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import StarRating from "../../components/Common/StarRating";
import "./DoctorsPage.scss";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=0fa39b&color=fff&size=200&name=";
const PAGE_LIMIT = 12;
const DEBOUNCE_MS = 400;
const ReactPaginate = ReactPaginateModule.default || ReactPaginateModule;

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Search & filter state
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const debounceTimer = useRef(null);
  const dropdownRef = useRef(null);

  // Load specialties once on mount
  useEffect(() => {
    specialtyService
      .specialties()
      .then((res) => {
        setSpecialties(res.data?.data || []);
      })
      .catch((err) => console.error("Lỗi lấy danh sách chuyên khoa:", err));
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce search input
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setSearchQuery(value.trim());
      setCurrentPage(0);
    }, DEBOUNCE_MS);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(0);
    clearTimeout(debounceTimer.current);
  };

  const handleSelectSpecialty = (specialty) => {
    setSelectedSpecialty(specialty);
    setIsDropdownOpen(false);
    setCurrentPage(0);
  };

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const params = {
      page: currentPage + 1,
      limit: PAGE_LIMIT,
      ...(searchQuery && { search: searchQuery }),
      ...(selectedSpecialty && { specialtyId: selectedSpecialty.id }),
    };

    doctorService
      .doctors(params)
      .then((res) => {
        if (!isMounted) return;
        const data = res.data?.data || [];
        const metaInfo = res.data?.meta || {};
        setDoctors(data);
        setMeta(metaInfo);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy danh sách bác sĩ:", err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentPage, searchQuery, selectedSpecialty]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.max(Number(meta.totalPages) || 1, 1);
  const safeCurrentPage = Math.min(currentPage, totalPages - 1);

  return (
    <>
      <div className="doctors-page-container">
        {/* Header Info */}
        <div className="doctors-page-header">
          <h1 className="doctors-page-title">
            Đội ngũ <span className="highlight">chuyên gia</span>
          </h1>
          <p className="doctors-page-sub">
            {isLoading
              ? "Đang tải..."
              : `Tìm thấy ${meta.total || 0} bác sĩ chuyên khoa`}
          </p>
        </div>

        {/* Search & Filter bar */}
        <div className="doctors-filter-bar">
          <div className="doctors-search-wrap">
            <FaMagnifyingGlass className="search-icon" />
            <input
              type="text"
              className="doctors-search-input"
              placeholder="Tìm kiếm theo tên bác sĩ..."
              value={searchInput}
              onChange={handleSearchChange}
            />
            {searchInput && (
              <button className="search-clear-btn" onClick={handleClearSearch} aria-label="Xoá tìm kiếm">
                <FaXmark />
              </button>
            )}
          </div>

          <div className="doctors-specialty-dropdown" ref={dropdownRef}>
            <button
              className={`specialty-dropdown-trigger ${isDropdownOpen ? "open" : ""}`}
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              <FaClipboardList className="trigger-icon" />
              <span>{selectedSpecialty ? selectedSpecialty.name : "Tất cả chuyên khoa"}</span>
              <FaChevronDown className={`trigger-chevron ${isDropdownOpen ? "rotated" : ""}`} />
            </button>

            {isDropdownOpen && (
              <div className="specialty-dropdown-menu">
                <button
                  className={`specialty-dropdown-item ${!selectedSpecialty ? "active" : ""}`}
                  onClick={() => handleSelectSpecialty(null)}
                >
                  Tất cả chuyên khoa
                </button>
                {specialties.map((s) => (
                  <button
                    key={s.id}
                    className={`specialty-dropdown-item ${selectedSpecialty?.id === s.id ? "active" : ""}`}
                    onClick={() => handleSelectSpecialty(s)}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active filters display */}
        {(searchQuery || selectedSpecialty) && (
          <div className="doctors-active-filters">
            {searchQuery && (
              <span className="filter-tag">
                Tìm: "{searchQuery}"
                <button onClick={handleClearSearch}><FaXmark /></button>
              </span>
            )}
            {selectedSpecialty && (
              <span className="filter-tag">
                {selectedSpecialty.name}
                <button onClick={() => { setSelectedSpecialty(null); setCurrentPage(0); }}><FaXmark /></button>
              </span>
            )}
          </div>
        )}

        {/* Doctors List */}
        {isLoading ? (
          <LoadingSpinner />
        ) : doctors.length === 0 ? (
          <div className="doctors-empty">
            <FaStar size={48} className="empty-icon" />
            <p>Không tìm thấy bác sĩ nào.</p>
          </div>
        ) : (
          <div className="doctors-list">
            {doctors.map((doctor) => {
              const { id, slug, user, specialties, hospitals, rating, totalReviews, consultationFee, experience, imgURL } = doctor;
              const fullName = `${user?.lastName || ""} ${user?.firstName || ""}`.trim();
              const avatar = imgURL || `${DEFAULT_AVATAR}${encodeURIComponent(fullName)}`;
              const primarySpecialty = specialties?.find((s) => s.isPrimary)?.specialty?.name || "Không có thông tin";

              const primaryHospital = hospitals?.[0];
              const hospitalInfo = primaryHospital?.hospital;
              const hospitalDisplay = hospitalInfo
                ? `${hospitalInfo.name}, ${hospitalInfo.city}`
                : "Không có thông tin";
              const { workingDays, startTime, endTime } = primaryHospital || {};

              const priceDisplay = consultationFee ? `${consultationFee.toLocaleString("vi-VN")}đ` : "Không có thông tin";

              return (
                <div key={id} className="doctor-item">
                  <div className="doctor-item-avatar-wrap">
                    <img src={avatar} alt={fullName} className="doctor-item-avatar" />
                    {/* <span className="doctor-item-badge available">Còn lịch</span> */}
                  </div>
                  <div className="doctor-item-info">
                    <div className="doctor-item-name">{fullName}</div>
                    <div className="doctor-item-meta-row">
                      <span className="doctor-item-spec">
                        <FaClipboardList className="icon" /> {primarySpecialty}
                      </span>
                      <span className="doctor-item-hospital">
                        <FaHospital className="icon" /> {hospitalDisplay}
                      </span>
                    </div>
                    {(startTime || endTime) && (
                      <div className="doctor-item-schedule">
                        {startTime} – {endTime}
                        {workingDays && (
                          <span className="ms-2">
                            ({workingDays.split(",").join(", ")})
                          </span>
                        )}
                      </div>
                    )}
                    <div className="doctor-item-footer">
                      <div className="doctor-item-rating">
                        <StarRating rating={rating || 0} showValue reviewCount={totalReviews || 0} size={13} />
                      </div>
                      {experience && (
                        <span className="doctor-item-exp">{experience} năm KN</span>
                      )}
                    </div>
                  </div>
                  <div className="doctor-item-right">
                    <div className="doctor-item-price">{priceDisplay}</div>
                    <div className="doctor-item-price-label">Phí khám</div>
                    <Link to={`/doctors/${slug}`} className="btn-view-doctor">
                      Xem bác sĩ
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="doctors-pagination-wrap">
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
              Trang {safeCurrentPage + 1} / {totalPages} &nbsp;·&nbsp; Tổng {meta.total} bác sĩ
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DoctorsPage;
