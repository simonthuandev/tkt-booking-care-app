// ─────────────────────────────────────────────────────────────────────────────
// AdminUsersPage.jsx  —  Users Management CRUD
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import {
  FaUser,
  FaEdit,
  FaSearch,
  FaEye,
  FaUserMd,
  FaUserInjured,
  FaUserShield,
  FaBan,
  FaUnlock,
  FaEnvelope,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaUserCheck,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import { BsPersonBadgeFill } from "react-icons/bs";
import { adminSystemService } from "../../../api/appService";
import LoadingSpinner from "../../../components/Common/LoadingSpinner";
import "./AdminUsersPage.scss";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const PAGE_LIMIT = 12;

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
  user: {
    label: "User",
    color: "#6b7f8e",
    bg: "#f7fafb",
    avatarBg: "#6b7f8e",
    icon: FaUser,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const getInitials = (firstName, lastName) =>
  `${firstName?.trim().split(" ").pop().charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase() || "?";

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: UserRow
// ─────────────────────────────────────────────────────────────────────────────
const UserRow = ({ u, onView, onEditRole, onToggleBan }) => {
  const role = ROLE_CFG[u.role] || ROLE_CFG.user;
  const initials = getInitials(u.firstName, u.lastName);

  // isActive mapping
  const statusCls = u.isActive ? "st-active" : "st-banned";
  const statusLabel = u.isActive ? "Active" : "Banned";

  return (
    <div className="user-row">
      {u.avatar ? (
        <img src={u.avatar} alt="Avatar" className="user-row__avatar" style={{ objectFit: "cover" }} />
      ) : (
        <div className="user-row__avatar" style={{ background: role.avatarBg }}>
          {initials}
        </div>
      )}

      <div className="user-row__identity">
        <p className="user-row__name">
          {u.firstName} {u.lastName}
        </p>
        <p className="user-row__email">
          <FaEnvelope /> {u.email}
        </p>
      </div>

      <span
        className="user-role-badge"
        style={{ color: role.color, background: role.bg }}
      >
        <role.icon /> {role.label}
      </span>

      <div className="user-row__dates">
        <span>
          <FaCalendarAlt /> Joined: {formatDate(u.createdAt)}
        </span>
      </div>

      <span className={`user-status-badge ${statusCls}`}>{statusLabel}</span>

      <div className="user-row__actions">
        <button className="user-btn user-btn--view" onClick={() => onView(u)} title="View Detail">
          <FaEye />
        </button>
        <button className="user-btn user-btn--edit" onClick={() => onEditRole(u)} title="Change Role">
          <FaEdit />
        </button>
        {u.isActive ? (
          <button className="user-btn user-btn--ban" onClick={() => onToggleBan(u)} title="Ban User">
            <FaBan />
          </button>
        ) : (
          <button className="user-btn user-btn--unban" onClick={() => onToggleBan(u)} title="Unban User">
            <FaUnlock />
          </button>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: UserRoleModal (Change Role)
// ─────────────────────────────────────────────────────────────────────────────
const UserRoleModal = ({ u, onSave, onClose, saving }) => {
  if (!u) return null;
  const [role, setRole] = useState(u.role || "user");
  const currentRoleCfg = ROLE_CFG[u.role] || ROLE_CFG.user;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-sm modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Change User Role</h5>
              <button className="btn-close" onClick={onClose} disabled={saving} />
            </div>
            <div className="modal-body">
              <div className="text-center mb-3">
                <span className="user-role-badge mb-2 d-inline-flex" style={{ color: currentRoleCfg.color, background: currentRoleCfg.bg }}>
                   Current: {currentRoleCfg.label}
                </span>
                <p className="mb-0 fw-semibold">{u.firstName} {u.lastName}</p>
                <small className="text-muted">{u.email}</small>
              </div>
              <label className="form-label">New Role</label>
              <select className="form-select" value={role} onChange={e => setRole(e.target.value)} disabled={saving}>
                {Object.entries(ROLE_CFG).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button className="btn btn-light border w-100 mb-2" onClick={onClose} disabled={saving}>Cancel</button>
              <button className="btn btn-save w-100 m-0" onClick={() => onSave(u.id, role)} disabled={saving}>
                {saving ? "Saving..." : "Save Role"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: BanConfirmModal
// ─────────────────────────────────────────────────────────────────────────────
const BanConfirmModal = ({ u, onConfirm, onClose, saving }) => {
  if (!u) return null;
  const isBanning = u.isActive;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-sm modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center py-4">
              <div className="delete-icon-wrap" style={{ background: isBanning ? '#fef2f2' : '#e6f9f0', color: isBanning ? '#e24b4a' : '#1a9e5c' }}>
                {isBanning ? <FaBan /> : <FaUnlock />}
              </div>
              <h5 className="delete-title mt-3">{isBanning ? "Ban User?" : "Unban User?"}</h5>
              <p className="delete-desc">
                {isBanning ? "Are you sure you want to ban this user?" : "Are you sure you want to restore access to this user?"}
                <br />
                <strong>{u.firstName} {u.lastName}</strong>
              </p>
            </div>
            <div className="modal-footer justify-content-center gap-2 border-0 pt-0 pb-4">
              <button className="btn btn-light border px-4" onClick={onClose} disabled={saving}>Cancel</button>
              <button className={`btn px-4 ${isBanning ? 'btn-danger' : 'btn-success'}`} onClick={() => onConfirm(u)} disabled={saving}>
                {saving ? "Processing..." : (isBanning ? "Yes, Ban" : "Yes, Unban")}
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
const UserViewModal = ({ u, onClose }) => {
  if (!u) return null;
  const role = ROLE_CFG[u.role] || ROLE_CFG.user;
  const defaultInitial = getInitials(u.firstName, u.lastName);

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">User Profile Details</h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <div className="user-view-header">
                {u.avatar ? (
                  <img src={u.avatar} alt="Avatar" className="user-view-avatar" style={{ objectFit: "cover" }} />
                ) : (
                  <div className="user-view-avatar" style={{ background: role.avatarBg }}>
                    {defaultInitial}
                  </div>
                )}
                <div>
                  <h4 className="user-view-name">{u.firstName} {u.lastName}</h4>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <span className="user-role-badge" style={{ color: role.color, background: role.bg }}>
                      <role.icon /> {role.label}
                    </span>
                    <span className={`user-status-badge ${u.isActive ? "st-active" : "st-banned"}`}>
                      {u.isActive ? "Active" : "Banned"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="row g-3 mt-4">
                <div className="col-12">
                  <small className="text-muted d-block mb-1">Email</small>
                  <div className="p-2 border rounded bg-light">{u.email}</div>
                </div>
                
                <div className="col-6">
                  <small className="text-muted d-block mb-1">Account ID</small>
                  <div className="p-2 border rounded bg-light text-truncate" title={u.id}>
                    <small>{u.id}</small>
                  </div>
                </div>
                
                <div className="col-6">
                  <small className="text-muted d-block mb-1">Provider</small>
                  <div className="p-2 border rounded bg-light text-capitalize">{u.provider || "Local"}</div>
                </div>

                <div className="col-6">
                  <small className="text-muted d-block mb-1">Email Verified</small>
                  <div className="p-2 border rounded bg-light">
                    {u.isEmailVerified ? <span className="text-success"><FaUserCheck className="me-1"/> Yes</span> : <span className="text-danger">No</span>}
                  </div>
                </div>

                <div className="col-6">
                  <small className="text-muted d-block mb-1">Joined Date</small>
                  <div className="p-2 border rounded bg-light">{formatDate(u.createdAt)}</div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-0">
              <button className="btn btn-light border w-100" onClick={onClose}>Close</button>
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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Search
  const [search, setSearch] = useState("");
  const [inputSearch, setInputSearch] = useState("");

  // Modals
  const [modal, setModal] = useState(null); // 'view' | 'role' | 'ban'
  const [selectedUser, setSelectedUser] = useState(null);
  const [saving, setSaving] = useState(false);

  // 1. Fetch Users
  const fetchUsers = async (pageIndex = 0, searchQuery = "") => {
    try {
      setLoading(true);
      const res = await adminSystemService.getUsers({
        page: pageIndex + 1, // backend 1-indexed
        limit: PAGE_LIMIT,
        search: searchQuery
      });
      
      const respData = res.data?.data;
      
      // Fallback matching response types
      if (Array.isArray(respData)) {
         setUsers(respData);
         setTotalPages(res.data?.meta?.totalPages ?? 1);
         setTotalCount(res.data?.meta?.total ?? 0);
      } else {
         setUsers(respData?.users || respData?.items || []);
         const metaObj = respData?.meta || respData?.pagination || res.data?.meta || {};
         setTotalPages(metaObj.totalPages ?? 1);
         setTotalCount(metaObj.totalItems ?? metaObj.total ?? 0);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, search]);

  // 2. Handlers
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(inputSearch);
    setCurrentPage(0);
  };

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeModal = () => {
    setModal(null);
    setSelectedUser(null);
  };

  const openModal = (type, u) => {
    setSelectedUser(u);
    setModal(type);
  };

  // 3. API Actions
  const handleSaveRole = async (userId, newRole) => {
    setSaving(true);
    try {
      await adminSystemService.updateUserRole(userId, { role: newRole });
      closeModal();
      fetchUsers(currentPage, search);
    } catch (err) {
      console.error("Failed to update role", err);
      alert(err?.response?.data?.message || "Failed to update role. See console.");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmBan = async (u) => {
    setSaving(true);
    try {
      const newStatus = !u.isActive; // Toggle target
      await adminSystemService.banUser(u.id, { isActive: newStatus });
      closeModal();
      fetchUsers(currentPage, search);
    } catch (err) {
      console.error("Failed to toggle ban", err);
      alert(err?.response?.data?.message || "Failed to change user ban status. See console.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-users">
      {/* Header */}
      <div className="users-header">
        <div>
          <h1 className="users-title">Quản lý tài khoản</h1>
          <p className="users-sub">
            Quản lý tài khoản của người dùng, thay đổi quyền hoặc ban tài khoản
          </p>
        </div>
        <div className="users-header__right">
          <span className="users-badge">
            <FaUser /> {totalCount} tài khoản
          </span>
        </div>
      </div>

      {/* Toolbar / Search */}
      <div className="card shadow-sm border-0 mb-4 p-3 bg-white">
        <form onSubmit={handleSearchSubmit} className="d-flex gap-2" style={{ maxWidth: '400px' }}>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0"><FaSearch className="text-muted"/></span>
            <input 
              type="text" 
              className="form-control border-start-0 bg-light" 
              placeholder="Search by name or email..." 
              value={inputSearch}
              onChange={e => setInputSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary px-4" style={{ backgroundColor: "#0ba3a3", borderColor: "#0ba3a3"}}>Find</button>
        </form>
      </div>

      {/* List */}
      <div className="users-list position-relative" style={{ minHeight: "200px" }}>
        {loading && (
          <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: "rgba(255,255,255,0.7)", zIndex: 10 }}>
            <LoadingSpinner />
          </div>
        )}

        {!loading && users.length === 0 ? (
          <div className="users-empty py-5 text-center text-muted">
            <FaUser className="users-empty__icon mb-3" style={{ fontSize: '3rem', opacity: 0.2 }} />
            <p className="mb-0 fs-5">No users found.</p>
            <span className="small">Try a different search keyword.</span>
          </div>
        ) : (
          users.map((u) => (
            <UserRow
              key={u.id}
              u={u}
              onView={(user) => openModal("view", user)}
              onEditRole={(user) => openModal("role", user)}
              onToggleBan={(user) => openModal("ban", user)}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-4">
          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center mb-3">
              <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  <FaChevronLeft className="me-1" /> Trước
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => {
                const start = Math.max(0, currentPage - 2);
                const end = Math.min(totalPages, start + 5);
                const adjustedStart = Math.max(0, end - 5);

                if (i < adjustedStart || i >= end) return null;

                return (
                  <li
                    key={i}
                    className={`page-item ${i === currentPage ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(i)}
                    >
                      {i + 1}
                    </button>
                  </li>
                );
              })}

              <li className={`page-item ${currentPage === totalPages - 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                >
                  Sau <FaChevronRight className="ms-1" />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Modals */}
      <UserViewModal
        u={modal === "view" ? selectedUser : null}
        onClose={closeModal}
      />
      <UserRoleModal
        u={modal === "role" ? selectedUser : null}
        onSave={handleSaveRole}
        onClose={closeModal}
        saving={saving}
      />
      <BanConfirmModal
        u={modal === "ban" ? selectedUser : null}
        onConfirm={handleConfirmBan}
        onClose={closeModal}
        saving={saving}
      />
    </div>
  );
}
