import { useRef, useState } from "react";
import { FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import { uploadService } from "../../api/appService";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

const ImageUploadField = ({
  label,
  value,
  name = "imgURL",
  uploadType,
  onChange,
  disabled = false,
  placeholder = "https://...",
}) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP.");
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("Ảnh không được vượt quá 5MB.");
      return;
    }

    setUploading(true);
    try {
      const res = await uploadService.uploadImage(uploadType, file);
      const uploadedUrl = res.data?.data?.url;
      if (!uploadedUrl) throw new Error("Không nhận được URL ảnh sau khi upload.");

      onChange(uploadedUrl);
      toast.success("Upload ảnh thành công.");
    } catch (err) {
      console.error("Lỗi upload ảnh:", err);
      toast.error(err?.response?.data?.message || err?.message || "Không thể upload ảnh.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {label && <label className="form-label">{label}</label>}
      <div className="d-flex gap-2 align-items-center">
        {value && (
          <img
            src={value}
            alt="Preview"
            className="avatar-preview rounded"
            style={{ width: 36, height: 36, objectFit: "cover" }}
          />
        )}
        <input
          className="form-control"
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || uploading}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          className="d-none"
          onChange={handleFileChange}
          disabled={disabled || uploading}
        />
        <button
          type="button"
          className="btn btn-outline-primary d-inline-flex align-items-center gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
        >
          {uploading ? (
            <span className="spinner-border spinner-border-sm" />
          ) : (
            <FaUpload />
          )}
          <span>{uploading ? "Đang tải" : "Upload"}</span>
        </button>
      </div>
      <div className="form-text">JPG, PNG hoặc WEBP, tối đa 5MB.</div>
    </div>
  );
};

export default ImageUploadField;
