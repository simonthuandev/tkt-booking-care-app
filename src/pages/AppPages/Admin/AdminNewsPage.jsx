// ─────────────────────────────────────────────────────────────────────────────
// AdminNewsPage.jsx  —  News Management CRUD
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useMemo } from "react";
import {
  FaNewspaper,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaEye,
  FaCalendarAlt,
  FaUser,
  FaTag,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaGlobe,
  FaExclamationTriangle,
} from "react-icons/fa";
import "./AdminNewsPage.scss";

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORIES = {
  Health: { color: "#0ba3a3", bg: "#e6f7f7", icon: "🏥" },
  Policy: { color: "#0d2b45", bg: "#e6eef5", icon: "📋" },
  Hospital: { color: "#10b981", bg: "#e6f9f0", icon: "🏨" },
  Event: { color: "#f59e0b", bg: "#fff8e6", icon: "📅" },
  Tips: { color: "#7c3aed", bg: "#eeedfe", icon: "💡" },
};

const CAT_NAMES = Object.keys(CATEGORIES);

// Gradient per category cho thumbnail placeholder
const CAT_GRADIENT = {
  Health: "linear-gradient(135deg, #0ba3a3 0%, #077d7d 100%)",
  Policy: "linear-gradient(135deg, #1a3a5c 0%, #0d2b45 100%)",
  Hospital: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
  Event: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
  Tips: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
};

// Author avatar colors
const AUTHOR_COLORS = [
  "#0ba3a3",
  "#534ab7",
  "#f5a623",
  "#1a9e5c",
  "#e24b4a",
  "#ff6b35",
];

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — 9 articles
// ─────────────────────────────────────────────────────────────────────────────
const INIT_NEWS = [
  {
    id: 1,
    title: "New Telemedicine Guidelines Released for 2026",
    category: "Policy",
    author: "Admin",
    authorColor: "#0d2b45",
    date: "Apr 20, 2026",
    readTime: 4,
    views: 1240,
    status: "published",
    thumbnailUrl: "",
    tags: "telemedicine,policy,2026",
    excerpt:
      "The Ministry of Health has released updated guidelines for telemedicine services, outlining new protocols for remote consultations and digital prescriptions.",
    content:
      "The full guidelines cover patient consent, data privacy, and billing requirements. All licensed physicians must complete a 2-hour training module before offering telemedicine services.",
  },
  {
    id: 2,
    title: "TKT Medical Center Opens New Cardiology Wing",
    category: "Hospital",
    author: "Dr. An",
    authorColor: "#0ba3a3",
    date: "Apr 18, 2026",
    readTime: 3,
    views: 980,
    status: "published",
    thumbnailUrl: "",
    tags: "cardiology,expansion,TKT",
    excerpt:
      "TKT Medical Center has officially opened its state-of-the-art cardiology wing, featuring 12 new examination rooms and advanced cardiac imaging equipment.",
    content:
      "The new wing will accommodate an additional 50 patients daily and features the latest in cardiac catheterization and electrophysiology labs.",
  },
  {
    id: 3,
    title: "Updated Vaccination Schedule for Children 2026",
    category: "Health",
    author: "Health Dept",
    authorColor: "#1a9e5c",
    date: "Apr 15, 2026",
    readTime: 5,
    views: 2100,
    status: "published",
    thumbnailUrl: "",
    tags: "vaccination,children,health",
    excerpt:
      "The national immunization program has been updated with new recommendations for children under 5, including a new meningococcal vaccine now added to the schedule.",
    content:
      "Parents are advised to consult with their pediatrician for the updated schedule. Free vaccination sessions will be available at all registered clinics starting May 2026.",
  },
  {
    id: 4,
    title: "Community Health Screening Event — District 1",
    category: "Event",
    author: "Marketing",
    authorColor: "#f5a623",
    date: "Apr 12, 2026",
    readTime: 2,
    views: 754,
    status: "published",
    thumbnailUrl: "",
    tags: "event,screening,community",
    excerpt:
      "Join us for a free community health screening event at TKT Medical Center on April 25th. Services include blood pressure checks, diabetes screening, and eye exams.",
    content:
      "Registration is open online. All residents of District 1 are welcome. Results will be available within 24 hours. Doctors will be on-site to answer questions.",
  },
  {
    id: 5,
    title: "10 Tips for Managing Hypertension at Home",
    category: "Tips",
    author: "Dr. An",
    authorColor: "#0ba3a3",
    date: "Apr 10, 2026",
    readTime: 6,
    views: 3420,
    status: "published",
    thumbnailUrl: "",
    tags: "hypertension,tips,homecare",
    excerpt:
      "High blood pressure affects millions of people. These practical tips can help you monitor and manage your blood pressure effectively from the comfort of your home.",
    content:
      "1. Monitor daily at the same time. 2. Reduce sodium intake. 3. Exercise 30 minutes daily. 4. Limit alcohol. 5. Manage stress with breathing exercises. 6. Take medications consistently.",
  },
  {
    id: 6,
    title: "New Pediatric Emergency Protocol Implemented",
    category: "Policy",
    author: "Admin",
    authorColor: "#0d2b45",
    date: "Apr 8, 2026",
    readTime: 3,
    views: 612,
    status: "published",
    thumbnailUrl: "",
    tags: "pediatrics,emergency,protocol",
    excerpt:
      "City Hospital has adopted a new rapid-response pediatric emergency protocol, reducing average treatment wait times by 35% for children under 12.",
    content:
      "The protocol standardizes triage, fast-tracks critical cases, and ensures a dedicated pediatric resuscitation team is always on standby during peak hours.",
  },
  {
    id: 7,
    title: "Mental Health Awareness Month — Resources Available",
    category: "Health",
    author: "Health Dept",
    authorColor: "#1a9e5c",
    date: "Apr 5, 2026",
    readTime: 4,
    views: 1880,
    status: "published",
    thumbnailUrl: "",
    tags: "mental-health,awareness,support",
    excerpt:
      "May is Mental Health Awareness Month. TKT Booking Care has compiled a list of mental health resources, hotlines, and therapists available through our platform.",
    content:
      "Access free counseling sessions, self-assessment tools, and connect with licensed psychiatrists and psychologists. Your mental health matters.",
  },
  {
    id: 8,
    title: "Introducing Online Lab Results — Coming Soon",
    category: "Hospital",
    author: "Dr. Bich",
    authorColor: "#534ab7",
    date: "Apr 2, 2026",
    readTime: 2,
    views: 430,
    status: "draft",
    thumbnailUrl: "",
    tags: "lab,digital,innovation",
    excerpt:
      "We are excited to announce that online lab result delivery is coming to TKT Booking Care. Patients will soon be able to access their test results directly from their dashboard.",
    content:
      "The feature will support PDF downloads, result history tracking, and direct messaging with your doctor for follow-up consultations.",
  },
  {
    id: 9,
    title: "Heart-Healthy Diet Guide for Cardiac Patients",
    category: "Tips",
    author: "Dr. An",
    authorColor: "#0ba3a3",
    date: "Mar 28, 2026",
    readTime: 7,
    views: 2750,
    status: "draft",
    thumbnailUrl: "",
    tags: "diet,cardiology,nutrition",
    excerpt:
      "A proper diet is the cornerstone of cardiac health. This comprehensive guide outlines the best foods, meal plans, and dietary habits for patients with heart conditions.",
    content:
      "Focus on omega-3 rich foods, whole grains, and leafy greens. Avoid trans fats, processed meats, and high-sodium snacks. Consult your cardiologist before making major dietary changes.",
  },
];

const EMPTY_FORM = {
  title: "",
  category: "Health",
  status: "draft",
  author: "",
  authorColor: AUTHOR_COLORS[0],
  date: "",
  readTime: "",
  thumbnailUrl: "",
  tags: "",
  excerpt: "",
  content: "",
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: NewsCard
// ─────────────────────────────────────────────────────────────────────────────
const NewsCard = ({ article, onView, onEdit, onDelete }) => {
  const {
    title,
    category,
    author,
    authorColor,
    date,
    readTime,
    views,
    status,
    thumbnailUrl,
    excerpt,
  } = article;
  const cat = CATEGORIES[category] || CATEGORIES.Health;
  const initial = author.trim().charAt(0).toUpperCase();

  return (
    <div className="news-card">
      {/* Thumbnail */}
      <div className="news-card__thumb">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="news-card__thumb-img"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="news-card__thumb-placeholder"
          style={{
            background: CAT_GRADIENT[category],
            display: thumbnailUrl ? "none" : "flex",
          }}
        >
          <span>{cat.icon}</span>
        </div>
        {/* Status badge trên thumb */}
        <span
          className={`news-card__status-badge ${status === "published" ? "st-published" : "st-draft"}`}
        >
          {status === "published" ? <FaCheckCircle /> : <FaClock />}
          {status === "published" ? "Published" : "Draft"}
        </span>
      </div>

      {/* Body */}
      <div className="news-card__body">
        {/* Category tag */}
        <span
          className="news-card__cat"
          style={{ color: cat.color, background: cat.bg }}
        >
          {cat.icon} {category}
        </span>

        {/* Title */}
        <h3 className="news-card__title">{title}</h3>

        {/* Excerpt */}
        <p className="news-card__excerpt">{excerpt}</p>

        {/* Author + meta */}
        <div className="news-card__meta">
          <div className="news-card__author">
            <div
              className="news-card__author-avatar"
              style={{ background: authorColor }}
            >
              {initial}
            </div>
            <span>{author}</span>
          </div>
          <div className="news-card__stats">
            <span>
              <FaCalendarAlt /> {date}
            </span>
            <span>
              <FaClock /> {readTime} min
            </span>
            <span>
              <FaEye /> {views.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="news-card__actions">
          <button
            className="news-btn news-btn--view"
            onClick={() => onView(article)}
          >
            <FaEye /> View
          </button>
          <button
            className="news-btn news-btn--edit"
            onClick={() => onEdit(article)}
          >
            <FaEdit /> Edit
          </button>
          <button
            className="news-btn news-btn--delete"
            onClick={() => onDelete(article)}
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: NewsFormModal (Add / Edit)
// ─────────────────────────────────────────────────────────────────────────────
const NewsFormModal = ({ mode, form, onChange, onSave, onClose }) => {
  if (mode !== "add" && mode !== "edit") return null;
  const isEdit = mode === "edit";
  const cat = CATEGORIES[form.category] || CATEGORIES.Health;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <FaNewspaper className="me-2" style={{ color: "#0ba3a3" }} />
                {isEdit ? "Edit Article" : "New Article"}
              </h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <div className="row g-3">
                {/* LEFT — Form */}
                <div className="col-md-8">
                  <div className="row g-3">
                    {/* Title */}
                    <div className="col-12">
                      <label className="form-label">Title</label>
                      <input
                        className="form-control form-control-lg"
                        name="title"
                        value={form.title}
                        onChange={onChange}
                        placeholder="Article title..."
                      />
                    </div>

                    {/* Category + Status */}
                    <div className="col-md-6">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        name="category"
                        value={form.category}
                        onChange={onChange}
                      >
                        {CAT_NAMES.map((c) => (
                          <option key={c} value={c}>
                            {CATEGORIES[c].icon} {c}
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
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>

                    {/* Author + Date */}
                    <div className="col-md-6">
                      <label className="form-label">Author Name</label>
                      <input
                        className="form-control"
                        name="author"
                        value={form.author}
                        onChange={onChange}
                        placeholder="e.g. Dr. Nguyen Van An"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Publish Date</label>
                      <input
                        className="form-control"
                        name="date"
                        value={form.date}
                        onChange={onChange}
                        placeholder="Apr 20, 2026"
                      />
                    </div>

                    {/* Reading time + Thumbnail URL */}
                    <div className="col-md-4">
                      <label className="form-label">Reading Time (min)</label>
                      <input
                        className="form-control"
                        name="readTime"
                        type="number"
                        min="1"
                        value={form.readTime}
                        onChange={onChange}
                        placeholder="5"
                      />
                    </div>
                    <div className="col-md-8">
                      <label className="form-label">Thumbnail URL</label>
                      <div className="d-flex gap-2 align-items-center">
                        <input
                          className="form-control"
                          name="thumbnailUrl"
                          value={form.thumbnailUrl}
                          onChange={onChange}
                          placeholder="https://..."
                        />
                        {form.thumbnailUrl && (
                          <img
                            src={form.thumbnailUrl}
                            alt="thumb"
                            className="thumb-preview"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="col-12">
                      <label className="form-label">
                        Tags{" "}
                        <small className="text-muted">(comma separated)</small>
                      </label>
                      <input
                        className="form-control"
                        name="tags"
                        value={form.tags}
                        onChange={onChange}
                        placeholder="health,tips,cardiology"
                      />
                    </div>

                    {/* Excerpt */}
                    <div className="col-12">
                      <label className="form-label">Excerpt</label>
                      <textarea
                        className="form-control"
                        name="excerpt"
                        rows={3}
                        value={form.excerpt}
                        onChange={onChange}
                        placeholder="Short summary..."
                      />
                    </div>

                    {/* Content */}
                    <div className="col-12">
                      <label className="form-label">Content</label>
                      <textarea
                        className="form-control"
                        name="content"
                        rows={6}
                        value={form.content}
                        onChange={onChange}
                        placeholder="Full article content..."
                      />
                    </div>
                  </div>
                </div>

                {/* RIGHT — Preview */}
                <div className="col-md-4">
                  <label className="form-label">Preview</label>
                  <div className="news-preview">
                    {/* Thumb */}
                    <div
                      className="news-preview__thumb"
                      style={{ background: CAT_GRADIENT[form.category] }}
                    >
                      {form.thumbnailUrl ? (
                        <img
                          src={form.thumbnailUrl}
                          alt=""
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <span>{cat.icon}</span>
                      )}
                    </div>
                    <div className="news-preview__body">
                      <span
                        className="news-preview__cat"
                        style={{ color: cat.color, background: cat.bg }}
                      >
                        {cat.icon} {form.category}
                      </span>
                      <p className="news-preview__title">
                        {form.title || "Article Title"}
                      </p>
                      <p className="news-preview__excerpt">
                        {form.excerpt || "Excerpt will appear here..."}
                      </p>
                      <span
                        className={`news-preview__status ${form.status === "published" ? "st-published" : "st-draft"}`}
                      >
                        {form.status === "published"
                          ? "● Published"
                          : "● Draft"}
                      </span>
                    </div>
                  </div>
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
                    Publish Article
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
// SUB-COMPONENT: NewsViewModal
// ─────────────────────────────────────────────────────────────────────────────
const NewsViewModal = ({ article, onEdit, onClose }) => {
  if (!article) return null;
  const {
    title,
    category,
    author,
    authorColor,
    date,
    readTime,
    views,
    status,
    thumbnailUrl,
    excerpt,
    content,
    tags,
  } = article;
  const cat = CATEGORIES[category] || CATEGORIES.Health;
  const initial = author.trim().charAt(0).toUpperCase();
  const tagList = tags
    ? tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header border-0 pb-0">
              <button className="btn-close ms-auto" onClick={onClose} />
            </div>

            <div className="modal-body pt-0">
              {/* Thumbnail */}
              <div
                className="view-news-thumb"
                style={{ background: CAT_GRADIENT[category] }}
              >
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt={title}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <span>{cat.icon}</span>
                )}
              </div>

              {/* Category + Title */}
              <span
                className="news-card__cat mt-3 d-inline-block"
                style={{ color: cat.color, background: cat.bg }}
              >
                {cat.icon} {category}
              </span>
              <h3 className="view-news-title">{title}</h3>

              {/* Meta */}
              <div className="view-news-meta">
                <div className="news-card__author">
                  <div
                    className="news-card__author-avatar"
                    style={{ background: authorColor }}
                  >
                    {initial}
                  </div>
                  <span>{author}</span>
                </div>
                <span>
                  <FaCalendarAlt /> {date}
                </span>
                <span>
                  <FaClock /> {readTime} min read
                </span>
                <span>
                  <FaEye /> {views?.toLocaleString()} views
                </span>
                <span
                  className={`news-preview__status ${status === "published" ? "st-published" : "st-draft"}`}
                >
                  {status === "published" ? "● Published" : "● Draft"}
                </span>
              </div>

              {/* Tags */}
              {tagList.length > 0 && (
                <div className="view-news-tags">
                  {tagList.map((t) => (
                    <span key={t} className="view-news-tag">
                      <FaTag /> {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="view-news-content">
                <p className="view-news-excerpt">{excerpt}</p>
                <p className="view-news-body">{content}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-light border" onClick={onClose}>
                Close
              </button>
              <button className="btn btn-save" onClick={onEdit}>
                <FaEdit className="me-1" /> Edit Article
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
const DeleteConfirmModal = ({ article, onConfirm, onClose }) => {
  if (!article) return null;
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
              <h5 className="delete-title">Delete Article?</h5>
              <p className="delete-desc">
                Are you sure you want to delete
                <br />
                <strong>
                  "
                  {article.title.length > 40
                    ? article.title.slice(0, 40) + "..."
                    : article.title}
                  "
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
export default function AdminNewsPage() {
  const [news, setNews] = useState(INIT_NEWS);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  // Filters
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterStat, setFilterStat] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // ── Modal helpers ─────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setSelected(null);
    setModal("add");
  };

  const openEdit = (a) => {
    setForm({
      title: a.title,
      category: a.category,
      status: a.status,
      author: a.author,
      authorColor: a.authorColor,
      date: a.date,
      readTime: String(a.readTime),
      thumbnailUrl: a.thumbnailUrl,
      tags: a.tags,
      excerpt: a.excerpt,
      content: a.content,
    });
    setSelected(a);
    setModal("edit");
  };

  const openView = (a) => {
    setSelected(a);
    setModal("view");
  };
  const openDelete = (a) => {
    setSelected(a);
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
    const entry = {
      ...form,
      readTime: Number(form.readTime) || 3,
      views: selected?.views ?? 0,
    };
    if (modal === "add") {
      setNews((prev) => [{ ...entry, id: Date.now() }, ...prev]);
    } else {
      setNews((prev) =>
        prev.map((a) => (a.id === selected.id ? { ...a, ...entry } : a)),
      );
    }
    closeModal();
  };

  const handleDelete = () => {
    setNews((prev) => prev.filter((a) => a.id !== selected.id));
    closeModal();
  };

  // ── Filter pipeline ───────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...news];
    if (filterCat !== "all")
      list = list.filter((a) => a.category === filterCat);
    if (filterStat !== "all")
      list = list.filter((a) => a.status === filterStat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.author.toLowerCase().includes(q),
      );
    }
    if (sortBy === "newest") list.sort((a, b) => b.id - a.id);
    if (sortBy === "oldest") list.sort((a, b) => a.id - b.id);
    if (sortBy === "title") list.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "views") list.sort((a, b) => b.views - a.views);
    return list;
  }, [news, filterCat, filterStat, search, sortBy]);

  // ── Summary ───────────────────────────────────────────────────────────────
  const total = news.length;
  const published = news.filter((a) => a.status === "published").length;
  const drafts = news.filter((a) => a.status === "draft").length;
  // "this month" mock — tất cả có date tháng 4
  const thisMonth = news.filter((a) => a.date?.includes("Apr")).length;

  return (
    <div className="admin-news">
      {/* Header */}
      <div className="news-header">
        <div>
          <h1 className="news-title">News Management</h1>
          <p className="news-sub">
            Manage articles, health tips, and announcements.
          </p>
        </div>
        <div className="news-header__right">
          <span className="news-badge">
            <FaNewspaper /> {total} articles
          </span>
          <button className="btn-add-news" onClick={openAdd}>
            <FaPlus /> New Article
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="news-summary">
        {[
          { label: "Total Articles", value: total, cls: "s-teal" },
          { label: "Published", value: published, cls: "s-green" },
          { label: "Draft", value: drafts, cls: "s-amber" },
          { label: "This Month", value: thisMonth, cls: "s-navy" },
        ].map((s) => (
          <div key={s.label} className={`news-summary__card ${s.cls}`}>
            <p className="news-summary__value">{s.value}</p>
            <p className="news-summary__label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="news-toolbar">
        <div className="toolbar-search">
          <FaSearch className="toolbar-search__icon" />
          <input
            placeholder="Search title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="toolbar-select">
          <FaFilter className="toolbar-select__icon" />
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
          >
            <option value="all">All Categories</option>
            {CAT_NAMES.map((c) => (
              <option key={c} value={c}>
                {CATEGORIES[c].icon} {c}
              </option>
            ))}
          </select>
        </div>
        <div className="toolbar-select">
          <FaGlobe className="toolbar-select__icon" />
          <select
            value={filterStat}
            onChange={(e) => setFilterStat(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div className="toolbar-select">
          <FaSortAmountDown className="toolbar-select__icon" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title">Title A→Z</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>
      </div>

      <p className="news-count">
        Showing <strong>{filtered.length}</strong> of {total} articles
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="news-empty">
          <FaNewspaper className="news-empty__icon" />
          <p>No articles found.</p>
          <span>Try adjusting your search or filters.</span>
        </div>
      ) : (
        <div className="news-grid">
          {filtered.map((a) => (
            <NewsCard
              key={a.id}
              article={a}
              onView={openView}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <NewsFormModal
        mode={modal}
        form={form}
        onChange={handleChange}
        onSave={handleSave}
        onClose={closeModal}
      />
      <NewsViewModal
        article={modal === "view" ? selected : null}
        onEdit={() => {
          closeModal();
          openEdit(selected);
        }}
        onClose={closeModal}
      />
      <DeleteConfirmModal
        article={modal === "delete" ? selected : null}
        onConfirm={handleDelete}
        onClose={closeModal}
      />
    </div>
  );
}
