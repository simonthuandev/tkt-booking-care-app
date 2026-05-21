// ─────────────────────────────────────────────────────────────────────────────
// AdminUsersPage.jsx  —  Users Management CRUD
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useMemo } from "react";
import {
  FaUser,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaEye,
  FaUserMd,
  FaUserInjured,
  FaUserShield,
  FaCheckCircle,
  FaTimesCircle,
  FaBan,
  FaUnlock,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaLock,
  FaEyeSlash,
} from "react-icons/fa";
import { BsPersonBadgeFill } from "react-icons/bs";
import "./AdminUsersPage.scss";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const ROLE_CFG = {
  admin: {
    label: "Admin",
    color: "#e24b4a",
    bg: "#fef2f2",
    avatarBg: "#e24b4a",
    icon: FaUserShield,
  },
  doctor: {
    label: "Doctor",
    color: "#0ba3a3",
    bg: "#e6f7f7",
    avatarBg: "#0ba3a3",
    icon: FaUserMd,
  },
  patient: {
    label: "Patient",
    color: "#0d2b45",
    bg: "#e6eef5",
    avatarBg: "#534ab7",
    icon: FaUserInjured,
  },
  user: {
    label: "User",
    color: "#6b7f8e",
    bg: "#f7fafb",
    avatarBg: "#6b7f8e",
    icon: FaUser,
  },
};

const STATUS_CFG = {
  active: { label: "Active", cls: "st-active" },
  inactive: { label: "Inactive", cls: "st-inactive" },
  banned: { label: "Banned", cls: "st-banned" },
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — 10 users
// ─────────────────────────────────────────────────────────────────────────────
const INIT_USERS = [
  {
    id: 1,
    firstName: "Nguyen Van",
    lastName: "An",
    email: "dr.an@tkt.com",
    phone: "+84 912 345 678",
    role: "doctor",
    status: "active",
    created: "Jan 15, 2024",
    lastLogin: "Apr 20, 2026",
    notes: "Senior cardiologist. Top rated.",
    appointments: 312,
  },
  {
    id: 2,
    firstName: "Le Thi",
    lastName: "Bich",
    email: "dr.bich@tkt.com",
    phone: "+84 909 876 543",
    role: "doctor",
    status: "active",
    created: "Mar 10, 2024",
    lastLogin: "Apr 19, 2026",
    notes: "Neurology specialist. Excellent patient reviews.",
    appointments: 287,
  },
  {
    id: 3,
    firstName: "Admin",
    lastName: "TKT",
    email: "admin@tkt.com",
    phone: "+84 900 000 001",
    role: "admin",
    status: "active",
    created: "Jan 1, 2024",
    lastLogin: "Apr 20, 2026",
    notes: "System administrator. Full access.",
    appointments: 0,
  },
  {
    id: 4,
    firstName: "Tran Thi",
    lastName: "Mai",
    email: "mai.tran@email.com",
    phone: "+84 912 111 222",
    role: "patient",
    status: "active",
    created: "Feb 20, 2024",
    lastLogin: "Apr 17, 2026",
    notes: "Regular patient. Hypertension management.",
    appointments: 18,
  },
  {
    id: 5,
    firstName: "Le Van",
    lastName: "Binh",
    email: "binh.le@email.com",
    phone: "+84 909 333 444",
    role: "patient",
    status: "active",
    created: "Mar 5, 2024",
    lastLogin: "Apr 17, 2026",
    notes: "Cardiac patient. Requires close monitoring.",
    appointments: 12,
  },
  {
    id: 6,
    firstName: "Pham Duc",
    lastName: "Thanh",
    email: "thanh@email.com",
    phone: "+84 936 555 666",
    role: "user",
    status: "inactive",
    created: "Apr 1, 2024",
    lastLogin: "Apr 10, 2026",
    notes: "Registered but no bookings yet.",
    appointments: 0,
  },
  {
    id: 7,
    firstName: "Hoang Thi",
    lastName: "Thu",
    email: "thu.hoang@email.com",
    phone: "+84 903 777 888",
    role: "patient",
    status: "active",
    created: "Jan 28, 2024",
    lastLogin: "Apr 15, 2026",
    notes: "Valve disease monitoring patient.",
    appointments: 9,
  },
  {
    id: 8,
    firstName: "Dang Van",
    lastName: "Long",
    email: "long.dang@email.com",
    phone: "+84 945 999 000",
    role: "user",
    status: "banned",
    created: "Feb 14, 2024",
    lastLogin: "Mar 1, 2026",
    notes: "Banned: repeated no-shows and abusive behavior.",
    appointments: 2,
  },
  {
    id: 9,
    firstName: "Bui Thi",
    lastName: "Huong",
    email: "huong.bui@email.com",
    phone: "+84 908 112 233",
    role: "patient",
    status: "active",
    created: "Mar 22, 2024",
    lastLogin: "Apr 10, 2026",
    notes: "Long-term AF management patient.",
    appointments: 14,
  },
  {
    id: 10,
    firstName: "Tran Van",
    lastName: "Nam",
    email: "nam.admin@tkt.com",
    phone: "+84 900 000 002",
    role: "admin",
    status: "active",
    created: "Jan 1, 2024",
    lastLogin: "Apr 20, 2026",
    notes: "Content and news manager.",
    appointments: 0,
  },
];

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "user",
  status: "active",
  password: "",
  confirmPassword: "",
  notes: "",
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const getInitials = (firstName, lastName) =>
  `${firstName.trim().split(" ").pop().charAt(0)}${lastName.charAt(0)}`.toUpperCase();

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: UserRow
// ─────────────────────────────────────────────────────────────────────────────
const UserRow = ({ u, onView, onEdit, onBan, onUnban, onDelete }) => {
  const role = ROLE_CFG[u.role] || ROLE_CFG.user;
  const status = STATUS_CFG[u.status] || STATUS_CFG.active;
  const initials = getInitials(u.firstName, u.lastName);

  return (
    <div className="user-row">
      {/* Avatar */}
      <div className="user-row__avatar" style={{ background: role.avatarBg }}>
        {initials}
      </div>

      {/* Name + email */}
      <div className="user-row__identity">
        <p className="user-row__name">
          {u.firstName} {u.lastName}
        </p>
        <p className="user-row__email">
          <FaEnvelope /> {u.email}
        </p>
      </div>

      {/* Role badge */}
      <span
        className="user-role-badge"
        style={{ color: role.color, background: role.bg }}
      >
        <role.icon /> {role.label}
      </span>

      {/* Phone */}
      <span className="user-row__phone">
        <FaPhone /> {u.phone}
      </span>

      {/* Created */}
      <div className="user-row__dates">
        <span>
          <FaCalendarAlt /> {u.created}
        </span>
        <span className="user-row__last-login">Login: {u.lastLogin}</span>
      </div>

      {/* Status */}
      <span className={`user-status-badge ${status.cls}`}>{status.label}</span>

      {/* Actions */}
      <div className="user-row__actions">
        <button
          className="user-btn user-btn--view"
          onClick={() => onView(u)}
          title="View"
        >
          <FaEye />
        </button>
        <button
          className="user-btn user-btn--edit"
          onClick={() => onEdit(u)}
          title="Edit"
        >
          <FaEdit />
        </button>
        {u.status !== "banned" ? (
          <button
            className="user-btn user-btn--ban"
            onClick={() => onBan(u.id)}
            title="Ban"
          >
            <FaBan />
          </button>
        ) : (
          <button
            className="user-btn user-btn--unban"
            onClick={() => onUnban(u.id)}
            title="Unban"
          >
            <FaUnlock />
          </button>
        )}
        <button
          className="user-btn user-btn--delete"
          onClick={() => onDelete(u)}
          title="Delete"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: UserFormModal (Add / Edit)
// ─────────────────────────────────────────────────────────────────────────────
const UserFormModal = ({ mode, form, onChange, onSave, onClose }) => {
  if (mode !== "add" && mode !== "edit") return null;
  const isEdit = mode === "edit";
  const role = ROLE_CFG[form.role] || ROLE_CFG.user;
  const initials =
    form.firstName || form.lastName
      ? getInitials(form.firstName || "?", form.lastName || "?")
      : "?";

  const [showPw, setShowPw] = useState(false);

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <BsPersonBadgeFill
                  className="me-2"
                  style={{ color: "#0ba3a3" }}
                />
                {isEdit ? "Edit User" : "Add New User"}
              </h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              {/* Avatar preview */}
              <div className="user-form-avatar-row">
                <div
                  className="user-form-avatar"
                  style={{ background: role.avatarBg }}
                >
                  {initials}
                </div>
                <div>
                  <p className="user-form-avatar__name">
                    {form.firstName || form.lastName
                      ? `${form.firstName} ${form.lastName}`.trim()
                      : "Preview Name"}
                  </p>
                  <span
                    className="user-role-badge"
                    style={{ color: role.color, background: role.bg }}
                  >
                    <role.icon /> {role.label}
                  </span>
                </div>
              </div>

              <div className="row g-3">
                {/* Name */}
                <div className="col-md-6">
                  <label className="form-label">First Name</label>
                  <input
                    className="form-control"
                    name="firstName"
                    value={form.firstName}
                    onChange={onChange}
                    placeholder="Nguyen Van"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Last Name</label>
                  <input
                    className="form-control"
                    name="lastName"
                    value={form.lastName}
                    onChange={onChange}
                    placeholder="An"
                  />
                </div>

                {/* Email + Phone */}
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    className="form-control"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="user@email.com"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input
                    className="form-control"
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="+84 912 345 678"
                  />
                </div>

                {/* Role + Status */}
                <div className="col-md-6">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    name="role"
                    value={form.role}
                    onChange={onChange}
                  >
                    {Object.entries(ROLE_CFG).map(([key, cfg]) => (
                      <option key={key} value={key}>
                        {cfg.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={form.status}
                    onChange={onChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>

                {/* Password — chỉ hiện khi Add */}
                {!isEdit && (
                  <>
                    <div className="col-md-6">
                      <label className="form-label">Password</label>
                      <div className="pw-input-wrap">
                        <input
                          className="form-control"
                          name="password"
                          type={showPw ? "text" : "password"}
                          value={form.password}
                          onChange={onChange}
                          placeholder="Min. 8 characters"
                        />
                        <button
                          type="button"
                          className="pw-toggle"
                          onClick={() => setShowPw(!showPw)}
                        >
                          {showPw ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Confirm Password</label>
                      <input
                        className="form-control"
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={onChange}
                        placeholder="Repeat password"
                      />
                    </div>
                  </>
                )}

                {/* Notes */}
                <div className="col-12">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-control"
                    name="notes"
                    rows={2}
                    value={form.notes}
                    onChange={onChange}
                    placeholder="Optional notes about this user..."
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-light border" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-save" onClick={onSave}>
                {isEdit ? (
                  <>
                    <FaEdit className="me-1" />
                    Update
                  </>
                ) : (
                  <>
                    <FaPlus className="me-1" />
                    Save User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: UserViewModal
// ─────────────────────────────────────────────────────────────────────────────
const UserViewModal = ({ u, onEdit, onClose }) => {
  if (!u) return null;
  const role = ROLE_CFG[u.role] || ROLE_CFG.user;
  const status = STATUS_CFG[u.status] || STATUS_CFG.active;
  const initials = getInitials(u.firstName, u.lastName);

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">User Profile</h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              {/* Avatar + name */}
              <div className="user-view-header">
                <div
                  className="user-view-avatar"
                  style={{ background: role.avatarBg }}
                >
                  {initials}
                </div>
                <div>
                  <h4 className="user-view-name">
                    {u.firstName} {u.lastName}
                  </h4>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span
                      className="user-role-badge"
                      style={{ color: role.color, background: role.bg }}
                    >
                      <role.icon /> {role.label}
                    </span>
                    <span className={`user-status-badge ${status.cls}`}>
                      {status.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info grid */}
              <div className="row g-2 mt-3">
                {[
                  { icon: FaEnvelope, label: "Email", val: u.email },
                  { icon: FaPhone, label: "Phone", val: u.phone },
                  {
                    icon: FaCalendarAlt,
                    label: "Member Since",
                    val: u.created,
                  },
                  {
                    icon: FaCalendarAlt,
                    label: "Last Login",
                    val: u.lastLogin,
                  },
                  {
                    icon: BsPersonBadgeFill,
                    label: "Appointments",
                    val: `${u.appointments} total`,
                  },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="col-12">
                    <div className="user-view-info-item">
                      <Icon className="view-info-icon" />
                      <div>
                        <p className="view-info-label">{label}</p>
                        <p className="view-info-val">{val}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes */}
              {u.notes && (
                <div className="user-view-notes">
                  <p className="user-view-notes__title">Notes</p>
                  <p className="user-view-notes__text">{u.notes}</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-light border" onClick={onClose}>
                Close
              </button>
              <button className="btn btn-save" onClick={onEdit}>
                <FaEdit className="me-1" /> Edit User
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: DeleteConfirmModal
// ─────────────────────────────────────────────────────────────────────────────
const DeleteConfirmModal = ({ u, onConfirm, onClose }) => {
  if (!u) return null;
  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-sm modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center py-4">
              <div className="delete-icon-wrap">
                <FaExclamationTriangle />
              </div>
              <h5 className="delete-title">Delete User?</h5>
              <p className="delete-desc">
                Are you sure you want to delete
                <br />
                <strong>
                  {u.firstName} {u.lastName}
                </strong>
                ?<br />
                This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer justify-content-center gap-2 border-0 pt-0 pb-4">
              <button className="btn btn-light border px-4" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-danger px-4" onClick={onConfirm}>
                <FaTrash className="me-1" /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const [users, setUsers] = useState(INIT_USERS);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStat, setFilterStat] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // ── Modal helpers ─────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setSelected(null);
    setModal("add");
  };

  const openEdit = (u) => {
    setForm({
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      phone: u.phone,
      role: u.role,
      status: u.status,
      password: "",
      confirmPassword: "",
      notes: u.notes,
    });
    setSelected(u);
    setModal("edit");
  };

  const openView = (u) => {
    setSelected(u);
    setModal("view");
  };
  const openDelete = (u) => {
    setSelected(u);
    setModal("delete");
  };
  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = () => {
    const { password, confirmPassword, ...rest } = form;
    if (modal === "add") {
      setUsers((prev) => [
        ...prev,
        {
          ...rest,
          id: Date.now(),
          appointments: 0,
          created: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          lastLogin: "Never",
        },
      ]);
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === selected.id ? { ...u, ...rest } : u)),
      );
    }
    closeModal();
  };

  // ── Ban / Unban ───────────────────────────────────────────────────────────
  const handleBan = (id) =>
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "banned" } : u)),
    );
  const handleUnban = (id) =>
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "active" } : u)),
    );

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = () => {
    setUsers((prev) => prev.filter((u) => u.id !== selected.id));
    closeModal();
  };

  // ── Filter pipeline ───────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...users];
    if (filterRole !== "all") list = list.filter((u) => u.role === filterRole);
    if (filterStat !== "all")
      list = list.filter((u) => u.status === filterStat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q),
      );
    }
    if (sortBy === "name")
      list.sort((a, b) => a.lastName.localeCompare(b.lastName));
    if (sortBy === "newest") list.sort((a, b) => b.id - a.id);
    if (sortBy === "login")
      list.sort((a, b) => b.lastLogin.localeCompare(a.lastLogin));
    return list;
  }, [users, filterRole, filterStat, search, sortBy]);

  // ── Summary ───────────────────────────────────────────────────────────────
  const total = users.length;
  const doctors = users.filter((u) => u.role === "doctor").length;
  const patients = users.filter((u) => u.role === "patient").length;
  const admins = users.filter((u) => u.role === "admin").length;

  return (
    <div className="admin-users">
      {/* Header */}
      <div className="users-header">
        <div>
          <h1 className="users-title">Users Management</h1>
          <p className="users-sub">
            Manage system users, roles, and access control.
          </p>
        </div>
        <div className="users-header__right">
          <span className="users-badge">
            <FaUser /> {total} users
          </span>
          <button className="btn-add-user" onClick={openAdd}>
            <FaPlus /> Add User
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="users-summary">
        {[
          { label: "Total Users", value: total, cls: "s-teal" },
          { label: "Doctors", value: doctors, cls: "s-primary" },
          { label: "Patients", value: patients, cls: "s-navy" },
          { label: "Admins", value: admins, cls: "s-danger" },
        ].map((s) => (
          <div key={s.label} className={`users-summary__card ${s.cls}`}>
            <p className="users-summary__value">{s.value}</p>
            <p className="users-summary__label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="users-toolbar">
        <div className="toolbar-search">
          <FaSearch className="toolbar-search__icon" />
          <input
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="toolbar-select">
          <FaFilter className="toolbar-select__icon" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            {Object.entries(ROLE_CFG).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>
        </div>
        <div className="toolbar-select">
          <FaCheckCircle className="toolbar-select__icon" />
          <select
            value={filterStat}
            onChange={(e) => setFilterStat(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="banned">Banned</option>
          </select>
        </div>
        <div className="toolbar-select">
          <FaSortAmountDown className="toolbar-select__icon" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name A→Z</option>
            <option value="newest">Newest</option>
            <option value="login">Last Login</option>
          </select>
        </div>
      </div>

      <p className="users-count">
        Showing <strong>{filtered.length}</strong> of {total} users
      </p>

      {/* List */}
      <div className="users-list">
        {filtered.length === 0 ? (
          <div className="users-empty">
            <FaUser className="users-empty__icon" />
            <p>No users found.</p>
            <span>Try adjusting your search or filters.</span>
          </div>
        ) : (
          filtered.map((u) => (
            <UserRow
              key={u.id}
              u={u}
              onView={openView}
              onEdit={openEdit}
              onBan={handleBan}
              onUnban={handleUnban}
              onDelete={openDelete}
            />
          ))
        )}
      </div>

      {/* Modals */}
      <UserFormModal
        mode={modal}
        form={form}
        onChange={handleChange}
        onSave={handleSave}
        onClose={closeModal}
      />
      <UserViewModal
        u={modal === "view" ? selected : null}
        onEdit={() => {
          closeModal();
          openEdit(selected);
        }}
        onClose={closeModal}
      />
      <DeleteConfirmModal
        u={modal === "delete" ? selected : null}
        onConfirm={handleDelete}
        onClose={closeModal}
      />
    </div>
  );
}
