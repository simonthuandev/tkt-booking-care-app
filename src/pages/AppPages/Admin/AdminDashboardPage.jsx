// ─────────────────────────────────────────────────────────────────────────────
// AdminDashboardPage.jsx
// Dashboard tổng quan hệ thống: stats (loaded from backend API)
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaUserMd,
  FaHospital,
  FaStethoscope,
  FaCalendarDay,
  FaStar,
  FaChartPie,
} from "react-icons/fa";
import { adminSystemService } from "../../../api/appService";
import "./AdminDashboardPage.scss";

// ── StatCard — thẻ thống kê lớn ─────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, subText }) {
  return (
    <div className={`admin-stat-card admin-stat-card--${color}`}>
      <div className="admin-stat-card__top">
        <div className="admin-stat-card__icon">
          {Icon && <Icon />}
        </div>
      </div>
      <p className="admin-stat-card__value">{value}</p>
      <p className="admin-stat-card__label">{label}</p>
      {subText && <p className="admin-stat-card__period">{subText}</p>}
    </div>
  );
}

// ── DonutChart Component ──────────────────────────────────────────
function DonutChart({ data, total, title, icon: Icon }) {
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
    <div className="admin-card">
      <div className="admin-card__header">
        <h3 className="admin-card__title">
          {Icon && <Icon />} {title}
        </h3>
      </div>
      <div className="admin-donut-wrap">
        <div
          className="admin-donut"
          style={{ background: total === 0 ? "#e2ebf0" : `conic-gradient(${gradient})` }}
        >
          <div className="admin-donut__hole">
            <p className="admin-donut__total">{total}</p>
            <p className="admin-donut__label">Tổng</p>
          </div>
        </div>
      </div>
      <div className="admin-donut-legend">
        {data.map((d, idx) => (
          <div key={idx} className="admin-donut-legend__item">
            <span
              className="admin-donut-legend__dot"
              style={{ background: d.color }}
            />
            <span className="admin-donut-legend__label">{d.label}</span>
            <span className="admin-donut-legend__value">{d.value}</span>
            <span className="admin-donut-legend__pct">
              {total === 0 ? 0 : Math.round((d.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminSystemService.getStats();
        const data = response.data?.data || response.data;
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1 className="admin-page__title">Admin Dashboard</h1>
            <p className="admin-page__subtitle">{today}</p>
          </div>
        </div>
        <div style={{ padding: "2rem" }}>Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1 className="admin-page__title">Admin Dashboard</h1>
            <p className="admin-page__subtitle">{today}</p>
          </div>
        </div>
        <div style={{ padding: "2rem" }}>Không có dữ liệu thống kê</div>
      </div>
    );
  }

  const { users, doctors, hospitals, specialties, appointments, content } = stats;

  const statsData = [
    {
      id: 1,
      label: "Tổng Người Dùng",
      value: users?.total || 0,
      icon: FaUser,
      color: "navy",
      subText: `${users?.active || 0} đang hoạt động`,
    },
    {
      id: 2,
      label: "Tổng Bác Sĩ",
      value: doctors?.total || 0,
      icon: FaUserMd,
      color: "teal",
      subText: `${doctors?.verified || 0} đã xác thực`,
    },
    {
      id: 3,
      label: "Cơ Sở Y Tế",
      value: hospitals?.total || 0,
      icon: FaHospital,
      color: "purple",
      subText: `${hospitals?.active || 0} đang hoạt động`,
    },
    {
      id: 4,
      label: "Chuyên Khoa",
      value: specialties?.total || 0,
      icon: FaStethoscope,
      color: "accent",
      subText: `${specialties?.active || 0} đang hoạt động`,
    },
    {
      id: 5,
      label: "Lịch Hẹn Hôm Nay",
      value: appointments?.today || 0,
      icon: FaCalendarDay,
      color: "green",
      subText: "Trong ngày",
    },
    {
      id: 6,
      label: "Tổng Đánh Giá",
      value: content?.reviews || 0,
      icon: FaStar,
      color: "gold",
      subText: "Phản hồi từ bệnh nhân",
    },
  ];

  // Chỉ lấy những status có dữ liệu để vẽ biểu đồ gọn gàng, hoặc giữ lại label "Chờ xác nhận" nếu rỗng
  const apptStatusData = [
    { label: "Chờ xác nhận", value: appointments?.byStatus?.pending || 0, color: "#f5a623" },
    { label: "Đã xác nhận", value: appointments?.byStatus?.confirmed || 0, color: "#534ab7" },
    { label: "Đang xử lý", value: appointments?.byStatus?.processing || 0, color: "#0ba3a3" },
    { label: "Hoàn thành", value: appointments?.byStatus?.completed || 0, color: "#1a9e5c" },
    { label: "Đã hủy", value: appointments?.byStatus?.cancelled || 0, color: "#e24b4a" },
    { label: "Vắng mặt", value: appointments?.byStatus?.no_show || 0, color: "#6b7f8e" },
  ].filter((d) => d.value > 0 || d.label === "Chờ xác nhận");

  const roleData = [
    { label: "Bệnh nhân", value: users?.byRole?.user || 0, color: "#0ba3a3" },
    { label: "Bác sĩ", value: users?.byRole?.doctor || 0, color: "#1a9e5c" },
    { label: "Quản trị viên", value: users?.byRole?.admin || 0, color: "#534ab7" },
  ].filter((d) => d.value > 0 || d.label === "Bệnh nhân");

  return (
    <div className="admin-page">
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Admin Dashboard</h1>
          <p className="admin-page__subtitle">{today}</p>
        </div>
        <span className="admin-page__online-badge">
          <span className="admin-page__online-dot" />
          Hệ thống hoạt động
        </span>
      </div>

      {/* ── Stats Grid (6 thẻ = 3 cột x 2 hàng, rất cân đối) ────────── */}
      <section className="admin-section">
        <div className="admin-stats-grid">
          {statsData.map((s) => (
            <StatCard key={s.id} {...s} />
          ))}
        </div>
      </section>

      {/* ── Biểu đồ Thống kê Chi tiết (2 cột) ────────── */}
      <section className="admin-section">
        <div className="admin-two-col">
          <DonutChart
            title="Trạng Thái Lịch Hẹn"
            icon={FaChartPie}
            data={apptStatusData}
            total={appointments?.total || 0}
          />
          <DonutChart
            title="Tỷ Lệ Người Dùng"
            icon={FaUser}
            data={roleData}
            total={users?.total || 0}
          />
        </div>
      </section>
    </div>
  );
}
