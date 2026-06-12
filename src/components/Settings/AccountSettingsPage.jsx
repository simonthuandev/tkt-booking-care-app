import { useEffect, useMemo, useState } from "react";
import {
  FaCamera,
  FaCheck,
  FaChevronRight,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaNotesMedical,
  FaUser,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import authService from "../../api/authService";
import { doctorService } from "../../api/appService";
import ImageUploadField from "../Common/ImageUploadField";
import {
  fetchCurrentUser,
  updateCurrentUserProfile,
} from "../../store/slices/authSlice";
import "./AccountSettingsPage.scss";

const splitLines = (value) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const joinLines = (items) => (Array.isArray(items) ? items.join("\n") : "");

const initialsOf = (user) =>
  `${user?.lastName?.[0] || ""}${user?.firstName?.[0] || ""}`.toUpperCase() ||
  "U";

function SectionMenu({ sections, active, onChange }) {
  return (
    <nav className="settings-menu">
      <p className="settings-menu__heading">Settings</p>
      {sections.map((section) => {
        const MenuIcon = section.icon;

        return (
          <button
            key={section.key}
            className={`settings-menu__item ${active === section.key ? "settings-menu__item--active" : ""}`}
            onClick={() => onChange(section.key)}
            type="button"
          >
            <div className="settings-menu__item-icon">
              <MenuIcon />
            </div>
            <div className="settings-menu__item-text">
              <span className="settings-menu__item-label">{section.label}</span>
              <span className="settings-menu__item-desc">{section.desc}</span>
            </div>
            <FaChevronRight className="settings-menu__item-arrow" />
          </button>
        );
      })}
    </nav>
  );
}

function SaveBar({ onSave, saving, saved, label = "Save Changes" }) {
  return (
    <div className="settings-save-bar">
      <button
        className="settings-btn settings-btn--save"
        onClick={onSave}
        disabled={saving}
        type="button"
      >
        {saved ? (
          <>
            <FaCheck /> Saved!
          </>
        ) : saving ? (
          "Saving..."
        ) : (
          label
        )}
      </button>
    </div>
  );
}

function ProfileSection({ user }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    avatar: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      avatar: user?.avatar || "",
    });
  }, [user]);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await dispatch(updateCurrentUserProfile(form)).unwrap();
      toast.success("Cập nhật thông tin tài khoản thành công.");
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch (error) {
      toast.error(error || "Không thể cập nhật thông tin.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-content">
      <h2 className="settings-content__title">Thông tin tài khoản</h2>
      <p className="settings-content__sub">
        Cập nhật tên hiển thị và ảnh đại diện của tài khoản.
      </p>

      <div className="profile-avatar-row">
        <div className="profile-avatar">
          {form.avatar ? (
            <img src={form.avatar} alt="Avatar" />
          ) : (
            <span>{initialsOf({ ...user, ...form })}</span>
          )}
          <button className="profile-avatar__edit" title="Change avatar" type="button">
            <FaCamera />
          </button>
        </div>
        <div>
          <p className="profile-avatar__name">
            {form.lastName} {form.firstName}
          </p>
          <p className="profile-avatar__email">{user?.email}</p>
        </div>
      </div>

      <div className="settings-form">
        <div className="settings-form__row">
          <div className="settings-form__group">
            <label>Họ</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
            />
          </div>
          <div className="settings-form__group">
            <label>Tên</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
            />
          </div>
        </div>

        <div className="settings-form__group settings-form__group--full">
          <label>Email</label>
          <input value={user?.email || ""} disabled readOnly />
        </div>

        <div className="settings-form__group settings-form__group--full">
          <ImageUploadField
            label="Avatar"
            name="avatar"
            value={form.avatar}
            uploadType="avatars"
            onChange={(avatar) => setForm((prev) => ({ ...prev, avatar }))}
            disabled={saving}
          />
        </div>
      </div>

      <SaveBar onSave={save} saving={saving} saved={saved} />
    </div>
  );
}

function SecuritySection({ user }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({});
  const [saving, setSaving] = useState(false);
  const isGoogle = user?.provider === "google";

  const save = async () => {
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }

    setSaving(true);
    try {
      await authService.changePassword(form);
      toast.success("Đổi mật khẩu thành công.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Không thể đổi mật khẩu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-content">
      <h2 className="settings-content__title">Bảo mật</h2>
      <p className="settings-content__sub">
        Đổi mật khẩu đăng nhập cho tài khoản local.
      </p>

      {isGoogle ? (
        <div className="danger-zone">
          <p className="danger-zone__title">Tài khoản Google</p>
          <p className="danger-zone__sub">
            Tài khoản này đăng nhập bằng Google nên không thể đổi mật khẩu tại đây.
          </p>
        </div>
      ) : (
        <>
          <div className="settings-form" style={{ maxWidth: 520 }}>
            {[
              ["currentPassword", "Mật khẩu hiện tại"],
              ["newPassword", "Mật khẩu mới"],
              ["confirmPassword", "Xác nhận mật khẩu mới"],
            ].map(([key, label]) => (
              <div className="settings-form__group settings-form__group--full" key={key}>
                <label>{label}</label>
                <div className="input-password">
                  <input
                    type={show[key] ? "text" : "password"}
                    value={form[key]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                    placeholder="••••••••"
                  />
                  <button
                    className="input-password__toggle"
                    type="button"
                    onClick={() => setShow((prev) => ({ ...prev, [key]: !prev[key] }))}
                  >
                    {show[key] ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <SaveBar onSave={save} saving={saving} saved={false} label="Đổi mật khẩu" />
        </>
      )}
    </div>
  );
}

function EmailVerificationSection({ user }) {
  const dispatch = useDispatch();
  const [requestResult, setRequestResult] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const requestVerification = async () => {
    setLoading(true);
    try {
      const res = await authService.requestEmailVerification();
      setRequestResult(res.data);
      toast.success(res.data?.message || "Đã tạo link xác thực email.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Không thể tạo link xác thực.");
    } finally {
      setLoading(false);
    }
  };

  const confirm = async () => {
    if (!token.trim()) {
      toast.error("Vui lòng nhập token xác thực.");
      return;
    }

    setLoading(true);
    try {
      await authService.confirmEmailVerification({ token: token.trim() });
      await dispatch(fetchCurrentUser()).unwrap();
      toast.success("Xác thực email thành công.");
      setToken("");
      setRequestResult(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Token không hợp lệ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-content">
      <h2 className="settings-content__title">Xác thực email</h2>
      <p className="settings-content__sub">
        Xác thực email giúp tăng độ tin cậy và hỗ trợ khôi phục tài khoản.
      </p>

      <div className="notif-list">
        <div className="notif-item">
          <div className="notif-item__text">
            <p className="notif-item__label">{user?.email}</p>
            <p className="notif-item__sub">
              {user?.isEmailVerified ? "Email đã được xác thực." : "Email chưa được xác thực."}
            </p>
          </div>
          <span className={`badge ${user?.isEmailVerified ? "bg-success" : "bg-warning text-dark"}`}>
            {user?.isEmailVerified ? "Verified" : "Pending"}
          </span>
        </div>
      </div>

      {!user?.isEmailVerified && (
        <>
          <button
            className="settings-btn settings-btn--save"
            onClick={requestVerification}
            disabled={loading}
            type="button"
          >
            Tạo link xác thực
          </button>

          {requestResult?.devLink && (
            <div className="danger-zone mt-3">
              <p className="danger-zone__title">Dev verification link</p>
              <p className="danger-zone__sub" style={{ wordBreak: "break-all" }}>
                {requestResult.devLink}
              </p>
            </div>
          )}

          <div className="settings-form mt-3" style={{ maxWidth: 560 }}>
            <div className="settings-form__group settings-form__group--full">
              <label>Token xác thực</label>
              <input value={token} onChange={(e) => setToken(e.target.value)} />
            </div>
          </div>

          <button
            className="settings-btn settings-btn--save"
            onClick={confirm}
            disabled={loading}
            type="button"
          >
            Xác thực email
          </button>
        </>
      )}
    </div>
  );
}

function DoctorProfileSection() {
  const [form, setForm] = useState({
    imgURL: "",
    information: "",
    treatment: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    doctorService
      .getMeProfile()
      .then((res) => {
        if (!mounted) return;
        const data = res.data?.data || {};
        setForm({
          imgURL: data.imgURL || "",
          information: joinLines(data.information),
          treatment: joinLines(data.treatment),
        });
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Không thể tải hồ sơ bác sĩ.");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await doctorService.updateMeProfile({
        imgURL: form.imgURL || undefined,
        information: splitLines(form.information),
        treatment: splitLines(form.treatment),
      });
      toast.success("Cập nhật hồ sơ bác sĩ thành công.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Không thể cập nhật hồ sơ bác sĩ.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="settings-content">Đang tải hồ sơ bác sĩ...</div>;
  }

  return (
    <div className="settings-content">
      <h2 className="settings-content__title">Hồ sơ bác sĩ</h2>
      <p className="settings-content__sub">
        Cập nhật ảnh đại diện công khai, thông tin giới thiệu và hướng điều trị.
      </p>

      <div className="settings-form">
        <div className="settings-form__group settings-form__group--full">
          <ImageUploadField
            label="Ảnh đại diện bác sĩ"
            value={form.imgURL}
            uploadType="doctors"
            onChange={(imgURL) => setForm((prev) => ({ ...prev, imgURL }))}
            disabled={saving}
          />
        </div>

        <div className="settings-form__group settings-form__group--full">
          <label>Thông tin giới thiệu</label>
          <textarea
            rows={5}
            value={form.information}
            onChange={(e) => setForm((prev) => ({ ...prev, information: e.target.value }))}
            placeholder="Mỗi dòng là một ý giới thiệu"
          />
        </div>

        <div className="settings-form__group settings-form__group--full">
          <label>Hướng điều trị</label>
          <textarea
            rows={5}
            value={form.treatment}
            onChange={(e) => setForm((prev) => ({ ...prev, treatment: e.target.value }))}
            placeholder="Mỗi dòng là một hướng điều trị"
          />
        </div>
      </div>

      <SaveBar onSave={save} saving={saving} saved={false} />
    </div>
  );
}

const ROLE_LABELS = {
  admin: "Admin Settings",
  doctor: "Doctor Settings",
  user: "User Settings",
};

export default function AccountSettingsPage({ role = "user" }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { isAuthenticated, isInitializing } = useSelector((state) => state.auth);
  const [activeSection, setActiveSection] = useState("profile");

  const isHydrated =
    !!user &&
    Object.prototype.hasOwnProperty.call(user, "provider") &&
    Object.prototype.hasOwnProperty.call(user, "isEmailVerified") &&
    Object.prototype.hasOwnProperty.call(user, "isActive");

  useEffect(() => {
    if (isAuthenticated && !isHydrated && !isInitializing) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isAuthenticated, isHydrated, isInitializing]);

  const sections = useMemo(() => {
    const base = [
      { key: "profile", label: "Profile", icon: FaUser, desc: "Account information" },
      { key: "security", label: "Security", icon: FaLock, desc: "Password" },
      { key: "email", label: "Email Verify", icon: FaEnvelope, desc: "Verification" },
    ];

    if (role === "doctor") {
      base.push({
        key: "doctor-profile",
        label: "Doctor Profile",
        icon: FaNotesMedical,
        desc: "Public profile",
      });
    }

    return base;
  }, [role]);

  const content = {
    profile: <ProfileSection user={user} />,
    security: <SecuritySection user={user} />,
    email: <EmailVerificationSection user={user} />,
    "doctor-profile": <DoctorProfileSection />,
  };

  if (!isHydrated) {
    return (
      <div className="settings-page">
        <div className="settings-page__header">
          <h1 className="settings-page__title">{ROLE_LABELS[role] || "Settings"}</h1>
          <p className="settings-page__subtitle">Đang tải thông tin tài khoản...</p>
        </div>
        <div className="settings-panel">
          <div className="settings-content">Đang tải thông tin tài khoản...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="settings-page__header">
        <h1 className="settings-page__title">{ROLE_LABELS[role] || "Settings"}</h1>
        <p className="settings-page__subtitle">
          Quản lý thông tin tài khoản và bảo mật.
        </p>
      </div>

      <div className="settings-body">
        <SectionMenu sections={sections} active={activeSection} onChange={setActiveSection} />
        <div className="settings-panel">{content[activeSection]}</div>
      </div>
    </div>
  );
}
