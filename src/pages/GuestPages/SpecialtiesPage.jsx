import { Link } from "react-router";
import { useState, useEffect } from "react";
import ReactPaginateModule from "react-paginate";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { specialtyService } from "../../api/appService";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import "./SpecialtiesPage.scss";

const PAGE_LIMIT = 12;
const ReactPaginate = ReactPaginateModule.default || ReactPaginateModule;

const SpecialtiesPage = () => {
  const [specialties, setSpecialties] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // react-paginate 0-indexed
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");            // applied search term

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    specialtyService.specialties({
      page: currentPage + 1,
      limit: PAGE_LIMIT,
      ...(search.trim() && { search: search.trim() }),
    })
      .then((res) => {
        if (!isMounted) return;
        setSpecialties(res.data?.data || []);
        setMeta(res.data?.meta || { total: 0, page: 1, totalPages: 1 });
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy danh sách chuyên khoa:", err);
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, [currentPage, search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    setSearch(searchInput);
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.max(Number(meta.totalPages) || 1, 1);
  const safeCurrentPage = Math.min(currentPage, totalPages - 1);

  return (
    <>
      {/* ── Search bar ─────────────────────────────────── */}
      <div className="specialties-search-bar">
        <form onSubmit={handleSearchSubmit} className="specialties-search-form">
          <input
            type="text"
            className="specialties-search-input"
            placeholder="Tìm kiếm chuyên khoa..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="specialties-search-btn">Tìm kiếm</button>
          {search && (
            <button
              type="button"
              className="specialties-search-clear"
              onClick={() => { setSearch(""); setSearchInput(""); setCurrentPage(0); }}
            >
              Xoá
            </button>
          )}
        </form>
        {!isLoading && (
          <p className="specialties-result-count">
            {search
              ? `Tìm thấy ${meta.total} kết quả cho "${search}"`
              : `${meta.total} chuyên khoa`}
          </p>
        )}
      </div>

      {/* ── Grid ──────────────────────────────────────── */}
      {isLoading ? (
        <LoadingSpinner />
      ) : specialties.length === 0 ? (
        <div className="specialties-empty">
          <p>Không tìm thấy chuyên khoa nào{search ? ` cho "${search}"` : ""}.</p>
        </div>
      ) : (
        <>
          <div className="specialties-container">
            {specialties.map((specialty, index) => {
              const name   = specialty.name  || "Chưa có tên";
              const slug   = specialty.slug  || "";
              const imgUrl = specialty.imgURL;
              const doctorCount = specialty._count?.doctors ?? 0;

              return (
                <Link
                  key={specialty.id || index}
                  to={`/specialties/${slug}`}
                  className="specialty-card"
                >
                  <div className="specialty-image">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={name}
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    ) : null}
                  </div>
                  <h3 className="specialty-name">{name}</h3>
                  <span className="specialty-count">{doctorCount} bác sĩ</span>
                </Link>
              );
            })}
          </div>

          {/* ── Pagination ─────────────────────────────── */}
          {totalPages > 1 && (
            <div className="specialties-pagination-wrap">
              <ReactPaginate
                pageCount={totalPages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                onPageChange={handlePageChange}
                forcePage={safeCurrentPage}
                previousLabel={<FaChevronLeft />}
                nextLabel={<FaChevronRight />}
                breakLabel="..."
                containerClassName="specialties-pagination"
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
              <p className="specialties-pagination-info">
                Trang {safeCurrentPage + 1} / {totalPages} &nbsp;·&nbsp; Tổng {meta.total} chuyên khoa
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default SpecialtiesPage;
