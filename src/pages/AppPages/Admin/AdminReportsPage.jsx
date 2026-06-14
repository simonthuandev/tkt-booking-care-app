// ─────────────────────────────────────────────────────────────────────────────
// AdminReportsPage.jsx  —  Reports & Analytics
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import {
  FaChartBar,
  FaChartPie,
  FaUserMd,
  FaHospital,
  FaCheckCircle,
  FaBan,
  FaMoneyBillWave,
  FaUserPlus,
  FaCalendarAlt,
} from "react-icons/fa";
import { BsCalendar2WeekFill } from "react-icons/bs";
import { adminSystemService } from "../../../api/appService";
import "./AdminReportsPage.scss";

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: KpiCard
// ─────────────────────────────────────────────────────────────────────────────
const KpiCard = ({ label, value, icon, color, subText }) => {
  const IconComponent = icon;
  return (
    <div className={`kpi-card kpi-card--${color}`}>
      <div className="kpi-card__top">
        <div className="kpi-card__icon">
          <IconComponent />
        </div>
      </div>
      <p className="kpi-card__value">{value}</p>
      <p className="kpi-card__label">{label}</p>
      {subText && <p className="kpi-card__period">{subText}</p>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: Timeline Bar Chart
// ─────────────────────────────────────────────────────────────────────────────
const TimelineChart = ({ data }) => {
  if (!data || data.length === 0) return <p>Không có dữ liệu</p>;

  const maxTotal = Math.max(...data.map((d) => d.total));

  return (
    <div className="rep-bar-chart">
      {data.map((item, idx) => {
        const pct = maxTotal === 0 ? 0 : (item.total / maxTotal) * 100;
        const dateObj = new Date(item.date);
        const dateStr = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;

        return (
          <div key={idx} className="rep-bar-chart__col">
            <span className="rep-bar-chart__count">{item.total}</span>
            <div className="rep-bar-chart__bar-wrap">
              <div
                className="rep-bar-chart__bar"
                style={{ height: `${pct}%` }}
                title={`Hoàn thành: ${item.completed} | Đã hủy: ${item.cancelled} | Không đến: ${item.noShow}`}
              />
            </div>
            <span className="rep-bar-chart__month">{dateStr}</span>
          </div>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: Donut Chart
// ─────────────────────────────────────────────────────────────────────────────
function DonutChart({ data, total }) {
  const gradient = (() => {
    let acc = 0;
    return data
      .map(({ color, value }) => {
        const pct = total === 0 ? 0 : (value / total) * 100;
        const start = acc;
        acc += pct;
        return `${color} ${start}% ${acc}%`;
      })
      .join(", ");
  })();

  return (
    <div className="rep-donut-container">
      <div className="rep-donut" style={{ background: total === 0 ? "#e2ebf0" : `conic-gradient(${gradient})` }}>
        <div className="rep-donut__hole">
          <p className="rep-donut__total">{total}</p>
          <p className="rep-donut__label">Tổng</p>
        </div>
      </div>
      <div className="rep-donut-legend">
        {data.map((d, idx) => (
          <div key={idx} className="rep-donut-legend__item">
            <span className="rep-donut-legend__dot" style={{ background: d.color }} />
            <span className="rep-donut-legend__label">{d.label}</span>
            <span className="rep-donut-legend__value">{d.value}</span>
            <span className="rep-donut-legend__pct">
              {total === 0 ? 0 : Math.round((d.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const toDateInputValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateLabel = (value) => {
  if (!value) return "Chọn ngày";
  return new Date(`${value}T00:00:00`).toLocaleDateString("vi-VN");
};

const buildCalendarDays = (monthDate) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstWeekday = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: firstWeekday }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(new Date(year, month, day));
  return cells;
};

const DatePickerField = ({ label, value, onChange, min, max, align = "start" }) => {
  const [open, setOpen] = useState(false);
  const [monthDate, setMonthDate] = useState(() => value ? new Date(`${value}T00:00:00`) : new Date());
  const days = buildCalendarDays(monthDate);
  const monthLabel = monthDate.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });

  const isDisabled = (date) => {
    const dateValue = toDateInputValue(date);
    return (min && dateValue < min) || (max && dateValue > max);
  };

  const selectDate = (date) => {
    if (isDisabled(date)) return;
    onChange(toDateInputValue(date));
    setOpen(false);
  };

  return (
    <div className={`date-picker-field date-picker-field--${align}`}>
      <label>{label}</label>
      <button type="button" className="date-picker-trigger" onClick={() => setOpen((current) => !current)}>
        <FaCalendarAlt /> {formatDateLabel(value)}
      </button>
      {open && (
        <div className="date-popover">
          <div className="date-popover__head">
            <button type="button" onClick={() => setMonthDate(new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 1))}>‹</button>
            <strong>{monthLabel}</strong>
            <button type="button" onClick={() => setMonthDate(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1))}>›</button>
          </div>
          <div className="date-popover__weekdays">
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="date-popover__grid">
            {days.map((date, index) => {
              if (!date) return <span key={`blank-${index}`} />;
              const dateValue = toDateInputValue(date);
              return (
                <button
                  key={dateValue}
                  type="button"
                  className={dateValue === value ? "is-selected" : ""}
                  onClick={() => selectDate(date)}
                  disabled={isDisabled(date)}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminReportsPage() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(false);

  // Default dates: From 7 days ago to today
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split("T")[0];
  });
  const [toDate, setToDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await adminSystemService.getReports({ from: fromDate, to: toDate });
      const data = response.data?.data || response.data;
      setReports(data);
    } catch (error) {
      console.error("Failed to fetch reports", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [fromDate, toDate]);

  // Format currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  return (
    <div className="admin-rep">
      {/* Header & Date Picker */}
      <div className="rep-header">
        <div>
          <h1 className="rep-title">Báo Cáo Thống Kê</h1>
          <p className="rep-sub">Theo dõi hiệu suất và số liệu hệ thống</p>
        </div>
        <div className="rep-header__right">
          <div className="date-picker-group">
            <DatePickerField label="Từ ngày" value={fromDate} onChange={setFromDate} max={toDate} />
            <DatePickerField label="Đến ngày" value={toDate} onChange={setToDate} min={fromDate} align="end" />
          </div>
        </div>
      </div>

      {loading && <div style={{ padding: "2rem" }}>Đang tải báo cáo...</div>}

      {!loading && reports && (
        <>
          {/* KPI Grid */}
          <section className="rep-section">
            <div className="kpi-grid">
              <KpiCard
                label="Tổng Lịch Hẹn"
                value={reports.overview?.appointments || 0}
                icon={BsCalendar2WeekFill}
                color="teal"
                subText="Trong khoảng thời gian chọn"
              />
              <KpiCard
                label="Tỷ Lệ Hoàn Thành"
                value={`${(reports.overview?.completionRate || 0).toFixed(1)}%`}
                icon={FaCheckCircle}
                color="green"
                subText={`${reports.overview?.completedAppointments || 0} lịch hoàn thành`}
              />
              <KpiCard
                label="Tỷ Lệ Hủy"
                value={`${(reports.overview?.cancellationRate || 0).toFixed(1)}%`}
                icon={FaBan}
                color="danger"
                subText={`${reports.overview?.cancelledAppointments || 0} lịch đã hủy`}
              />
              <KpiCard
                label="Doanh Thu Ước Tính"
                value={formatCurrency(reports.overview?.estimatedRevenue || 0)}
                icon={FaMoneyBillWave}
                color="gold"
                subText="Dựa trên lịch hẹn hoàn thành"
              />
              <KpiCard
                label="Tài Khoản Mới"
                value={reports.growth?.newUsers || 0}
                icon={FaUserPlus}
                color="navy"
                subText="Đăng ký mới"
              />
              <KpiCard
                label="Bác Sĩ Mới"
                value={reports.growth?.newDoctors || 0}
                icon={FaUserMd}
                color="purple"
                subText="Tham gia hệ thống"
              />
            </div>
          </section>

          {/* Timeline & Donut Chart */}
          <section className="rep-section rep-two-col">
            <div className="rep-card">
              <div className="rep-card__header">
                <h2 className="rep-card__title">
                  <FaChartBar /> Lịch Hẹn Theo Ngày
                </h2>
              </div>
              <div className="rep-card__body rep-card__body--scroll">
                <TimelineChart data={reports.dailyTimeline} />
              </div>
            </div>

            <div className="rep-card">
              <div className="rep-card__header">
                <h2 className="rep-card__title">
                  <FaChartPie /> Phân Bố Trạng Thái
                </h2>
              </div>
              <div className="rep-card__body rep-card__body--center">
                <DonutChart
                  total={reports.overview?.appointments || 0}
                  data={[
                    { label: "Chờ xác nhận", value: reports.appointmentsByStatus?.pending || 0, color: "#f5a623" },
                    { label: "Đã xác nhận", value: reports.appointmentsByStatus?.confirmed || 0, color: "#534ab7" },
                    { label: "Đang xử lý", value: reports.appointmentsByStatus?.processing || 0, color: "#0ba3a3" },
                    { label: "Hoàn thành", value: reports.appointmentsByStatus?.completed || 0, color: "#1a9e5c" },
                    { label: "Đã hủy", value: reports.appointmentsByStatus?.cancelled || 0, color: "#e24b4a" },
                    { label: "Vắng mặt", value: reports.appointmentsByStatus?.no_show || 0, color: "#6b7f8e" },
                  ].filter((d) => d.value > 0 || d.label === "Chờ xác nhận")}
                />
              </div>
            </div>
          </section>

          {/* Top Doctors & Hospitals */}
          <section className="rep-section rep-two-col">
            {/* Top Doctors */}
            <div className="rep-card">
              <div className="rep-card__header">
                <h2 className="rep-card__title">
                  <FaUserMd /> Top Bác Sĩ Nổi Bật
                </h2>
              </div>
              <div className="rep-card__body rep-card__body--list">
                {reports.topDoctors && reports.topDoctors.length > 0 ? (
                  reports.topDoctors.map((doc, idx) => (
                    <div key={doc.id} className="rank-row">
                      <span className="rank-row__rank">#{idx + 1}</span>
                      <img
                        src={doc?.imgURL || `https://ui-avatars.com/api/?name=${doc.user?.firstName}&background=0ba3a3&color=fff`}
                        alt={`${doc.user?.lastName} ${doc.user?.firstName}`}
                        className="rank-row__avatar"
                      />
                      <div className="rank-row__info">
                        <p className="rank-row__name">{`${doc.user?.lastName} ${doc.user?.firstName}`}</p>
                      </div>
                      <div className="rank-row__stats">
                        <span className="rank-row__visits">{doc.appointmentCount} lịch hẹn</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ padding: "1rem" }}>Không có dữ liệu bác sĩ</p>
                )}
              </div>
            </div>

            {/* Top Hospitals */}
            <div className="rep-card">
              <div className="rep-card__header">
                <h2 className="rep-card__title">
                  <FaHospital /> Top Cơ Sở Y Tế
                </h2>
              </div>
              <div className="rep-card__body rep-card__body--list">
                {reports.topHospitals && reports.topHospitals.length > 0 ? (
                  reports.topHospitals.map((hosp, idx) => (
                    <div key={hosp.id} className="rank-row">
                      <span className="rank-row__rank">#{idx + 1}</span>
                      <div className="rank-row__icon-wrap">
                        {hosp.imgURL ? (
                          <img
                            src={hosp?.imgURL}
                            alt={hosp.name}
                          />
                        ) : (
                          <FaHospital />
                        )}
                      </div>
                      <div className="rank-row__info">
                        <p className="rank-row__name">{hosp.name}</p>
                        <p className="rank-row__sub">{hosp.city}</p>
                      </div>
                      <div className="rank-row__stats">
                        <span className="rank-row__visits">{hosp.appointmentCount} lịch hẹn</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ padding: "1rem" }}>Không có dữ liệu cơ sở y tế</p>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
