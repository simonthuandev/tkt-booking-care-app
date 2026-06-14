import ReactPaginateModule from "react-paginate";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import "./AppPagination.scss";

const ReactPaginate = ReactPaginateModule.default || ReactPaginateModule;

const AppPagination = ({
  pageCount = 1,
  currentPage = 0,
  onPageChange,
  total,
  itemLabel = "mục",
  className = "",
}) => {
  const totalPages = Math.max(Number(pageCount) || 1, 1);
  const safeCurrentPage = Math.min(Math.max(Number(currentPage) || 0, 0), totalPages - 1);

  if (totalPages <= 1) return null;

  return (
    <div className={`app-pagination-wrap ${className}`.trim()}>
      <ReactPaginate
        pageCount={totalPages}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        onPageChange={({ selected }) => onPageChange?.(selected)}
        forcePage={safeCurrentPage}
        previousLabel={<FaChevronLeft />}
        nextLabel={<FaChevronRight />}
        breakLabel="..."
        containerClassName="app-pagination"
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
      <p className="app-pagination-info">
        Trang {safeCurrentPage + 1} / {totalPages}
        {total !== undefined && total !== null ? ` · Tổng ${total} ${itemLabel}` : ""}
      </p>
    </div>
  );
};

export default AppPagination;
