import { useState, useEffect } from "react";
import {
  BsCalendar2WeekFill,
  BsClockFill,
  BsPersonBadgeFill,
  BsTelephoneFill, // Thêm icon điện thoại
} from "react-icons/bs";
import {
  FaUserInjured,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaCheck,
  FaBan,
  FaFilter,
  FaStethoscope,
  FaPlay,
  FaExclamationTriangle
} from "react-icons/fa";
import { toast } from "react-toastify";
import { appointmentService } from "../../../api/appService";
import LoadingSpinner from "../../../components/Common/LoadingSpinner";
import AppPagination from "../../../components/Common/AppPagination";
import ConfirmModal from "../../../components/Common/ConfirmModal";
import "./DoctorAppointmentsPage.scss";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const calculateAge = (dobString) => {
  if (!dobString) return "?";
  const dob = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

const getAvatarInitials = (name) => {
  if (!name) return "BN";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const COLORS = ["#0ba3a3", "#077d7d", "#f5a623", "#534ab7", "#1a9e5c", "#ff6b35", "#0d2b45", "#9b59b6", "#e67e22", "#16a085"];
const getColorForId = (id) => {
  if (!id) return COLORS[0];
  const charCode = id.charCodeAt(id.length - 1);
  return COLORS[charCode % COLORS.length];
};

// ── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { key: "all",        label: "Tất cả",      statusVal: "" },
  { key: "pending",    label: "Chờ xác nhận", statusVal: "pending" },
  { key: "confirmed",  label: "Đã xác nhận",  statusVal: "confirmed" },
  { key: "processing", label: "Đang khám",    statusVal: "processing" },
  { key: "completed",  label: "Hoàn tất",     statusVal: "completed" },
  { key: "no_show",    label: "Vắng mặt",     statusVal: "no_show" }, // Bổ sung Tab Vắng mặt
  { key: "cancelled",  label: "Đã huỷ",       statusVal: "cancelled" },
];

// ── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:    { label: "Chờ xác nhận", icon: FaClock,       className: "status--pending" },
  confirmed:  { label: "Đã xác nhận",  icon: BsPersonBadgeFill, className: "status--confirmed" },
  processing: { label: "Đang khám",    icon: FaStethoscope, className: "status--processing" },
  completed:  { label: "Hoàn tất",     icon: FaCheckCircle, className: "status--completed" },
  no_show:    { label: "Vắng mặt",     icon: FaExclamationTriangle, className: "status--noshow" },
  cancelled:  { label: "Đã huỷ",       icon: FaBan,         className: "status--cancelled" },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return <span className="appt-status-badge status--pending">{status}</span>;
  const Icon = cfg.icon;
  return (
    <span className={`appt-status-badge ${cfg.className}`}>
      <Icon />
      {cfg.label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: AppointmentRow
// ─────────────────────────────────────────────────────────────────────────────
function AppointmentRow({ appt, onUpdateStatus, onRequestStatusConfirm, loadingId }) {
  const patient = appt.patientProfile?.fullName || "Bệnh nhân";
  const phone = appt.patientProfile?.phoneNumber || "Chưa cập nhật SĐT";
  const age = calculateAge(appt.patientProfile?.dob);
  const avatar = getAvatarInitials(patient);
  const color = getColorForId(appt.patientProfile?.id);
  const dateStr = new Date(appt.timeSlot?.date).toLocaleDateString("vi-VN");
  const timeStr = `${appt.timeSlot?.startTime} - ${appt.timeSlot?.endTime}`;
  const status = appt.status;
  const isUpdating = loadingId === appt.id;

  return (
    <div className="doc-appt-row">
      <div className="doc-appt-row__avatar" style={{ background: color }}>
        {avatar}
      </div>

      <div className="doc-appt-row__patient">
        <p className="doc-appt-row__name">
          {patient}
          <span className="doc-appt-row__age">{age} tuổi</span>
          <span className="doc-appt-row__gender ms-2">
            {appt.patientProfile?.gender === 'MALE' ? 'Nam' : appt.patientProfile?.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
          </span>
        </p>
        {/* Hiển thị thêm Số điện thoại và Lý do khám */}
        <div className="doc-appt-row__contact-info mt-1">
          <span className="text-primary small fw-medium me-3">
            <BsTelephoneFill className="me-1" style={{fontSize: '0.7rem'}}/> {phone}
          </span>
          <span className="text-muted small">
            Lý do: {appt.reason || "Không ghi rõ"}
          </span>
        </div>
      </div>

      <div className="doc-appt-row__datetime">
        <span className="doc-appt-row__date">
          <BsCalendar2WeekFill /> {dateStr}
        </span>
        <span className="doc-appt-row__time">
          <BsClockFill /> {timeStr}
        </span>
      </div>

      <div className="doc-appt-row__status">
        <StatusBadge status={status} />
      </div>

      <div className="doc-appt-row__actions">
        {status === "pending" && (
          <button 
            className="doc-appt-btn doc-appt-btn--confirm" 
            onClick={() => onUpdateStatus(appt.id, "confirmed")}
            disabled={isUpdating}
          >
            {isUpdating ? <span className="spinner-border spinner-border-sm" /> : <><FaCheck /> Xác nhận</>}
          </button>
        )}

        {status === "confirmed" && (
          <>
            <button 
              className="doc-appt-btn doc-appt-btn--processing" 
              onClick={() => onUpdateStatus(appt.id, "processing")}
              disabled={isUpdating}
            >
              {isUpdating ? <span className="spinner-border spinner-border-sm" /> : <><FaPlay /> Tiến hành khám</>}
            </button>
            <button 
              className="doc-appt-btn doc-appt-btn--cancel" 
              onClick={() => onRequestStatusConfirm(appt.id, "cancelled", "Hủy lịch khám?", "Bạn có chắc muốn hủy lịch khám này không?")}
              disabled={isUpdating}
            >
              <FaTimes /> Huỷ lịch
            </button>
          </>
        )}

        {status === "processing" && (
          <>
            <button 
              className="doc-appt-btn doc-appt-btn--done" 
              onClick={() => onUpdateStatus(appt.id, "completed")}
              disabled={isUpdating}
            >
              {isUpdating ? <span className="spinner-border spinner-border-sm" /> : <><FaCheckCircle /> Hoàn tất</>}
            </button>
            <button 
              className="doc-appt-btn doc-appt-btn--noshow" 
              onClick={() => onRequestStatusConfirm(appt.id, "no_show", "Xác nhận bệnh nhân không đến?", "Lịch hẹn sẽ được chuyển sang trạng thái không đến.")}
              disabled={isUpdating}
            >
              <FaExclamationTriangle /> Không đến
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [activeTab, setActiveTab] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [confirmState, setConfirmState] = useState(null);

  const PAGE_LIMIT = 20; // Đồng bộ với Backend

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const tabConfig = TABS.find(t => t.key === activeTab);
      const params = {
        page: currentPage,
        limit: PAGE_LIMIT
      };

      if (tabConfig && tabConfig.statusVal) {
        params.status = tabConfig.statusVal;
      }
      if (filterDate) {
        params.date = filterDate;
      }

      const res = await appointmentService.getDoctorAppointments(params);
      const respData = res.data?.data?.data || res.data?.data || [];
      const meta = res.data?.meta || res.data?.data?.meta || {};
      
      setAppointments(Array.isArray(respData) ? respData : []);
      setTotalPages(meta.totalPages || 1);
      setTotalCount(meta.total || 0);

    } catch (error) {
      console.error("Lỗi lấy danh sách lịch hẹn:", error);
      toast.error("Không thể tải danh sách lịch hẹn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [activeTab, filterDate, currentPage]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      await appointmentService.doctorUpdateAppointmentStatus(id, { status: newStatus });
      toast.success("Cập nhật trạng thái thành công!");
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi cập nhật trạng thái.");
    } finally {
      setUpdatingId(null);
    }
  };

  const requestStatusConfirm = (id, status, title, message) => {
    setConfirmState({ id, status, title, message });
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  const handleFilterDateChange = (e) => {
    setFilterDate(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="doc-appts-page">
      <div className="doc-appts-page__header">
        <div>
          <h1 className="doc-appts-page__title">Quản lý lịch hẹn</h1>
          <p className="doc-appts-page__subtitle">Theo dõi và cập nhật trạng thái lịch khám.</p>
        </div>
      </div>

      <div className="doc-appts-tabs">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            className={`doc-appts-tabs__btn ${activeTab === key ? "doc-appts-tabs__btn--active" : ""}`}
            onClick={() => handleTabChange(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="doc-appts-toolbar card shadow-sm border-0 mb-4 p-3 bg-white rounded-3">
        <div className="row g-3 align-items-center">       
          
          {/* CỘT BÊN TRÁI: BỘ LỌC NGÀY (Căn sang TRÁI hoàn toàn) */}
          <div className="col-12 col-md-6 d-flex justify-content-md-start">
            <div className="doc-appts-date-filter">
              <label className="text-muted small fw-semibold me-2 mb-0"><FaFilter className="me-1"/> Ngày:</label>
              <div className="doc-appts-date-filter__input-wrap">
                <input 
                  type="date" 
                  className="form-control form-control-sm border" 
                  value={filterDate}
                  onChange={handleFilterDateChange}
                />
              </div>
              {filterDate && (
                <button className="btn btn-sm btn-light border text-danger ms-1" onClick={() => { setFilterDate(""); setCurrentPage(1); }}>
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          {/* CỘT BÊN PHẢI: HIỂN THỊ SỐ LƯỢNG (Dạt hẳn sang PHẢI hoàn toàn) */}
          <div className="col-12 col-md-6 d-flex justify-content-md-end align-items-center">
            <span className="doc-appts-results-count">
              Hiển thị <strong>{appointments.length}</strong> / <strong>{totalCount}</strong> lịch hẹn
            </span>
          </div>

        </div>
      </div>

      <div className="doc-appts-list position-relative" style={{ minHeight: "300px" }}>
        {loading && (
          <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75" style={{ zIndex: 10 }}>
            <LoadingSpinner />
          </div>
        )}

        {!loading && appointments.length === 0 ? (
          <div className="doc-appts-empty">
            <FaUserInjured className="doc-appts-empty__icon" />
            <p className="doc-appts-empty__text">Không có lịch hẹn nào.</p>
          </div>
        ) : (
          appointments.map((appt) => (
            <AppointmentRow
              key={appt.id}
              appt={appt}
              onUpdateStatus={handleUpdateStatus}
              onRequestStatusConfirm={requestStatusConfirm}
              loadingId={updatingId}
            />
          ))
        )}
      </div>

      <AppPagination
        pageCount={totalPages}
        currentPage={currentPage - 1}
        total={totalCount}
        itemLabel="lịch hẹn"
        onPageChange={(selected) => handlePageChange(selected + 1)}
      />

      <ConfirmModal
        show={!!confirmState}
        title={confirmState?.title}
        message={confirmState?.message}
        confirmText="Xác nhận"
        saving={!!updatingId}
        onClose={() => setConfirmState(null)}
        onConfirm={async () => {
          const next = confirmState;
          setConfirmState(null);
          await handleUpdateStatus(next.id, next.status);
        }}
      />
    </div>
  );
}
