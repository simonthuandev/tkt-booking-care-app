import { FaExclamationTriangle } from "react-icons/fa";
import "./ConfirmModal.scss";

const ConfirmModal = ({
  show,
  title = "Xác nhận thao tác",
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  variant = "danger",
  saving = false,
  onConfirm,
  onClose,
}) => {
  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={saving ? undefined : onClose} />
      <div className="modal fade show d-block confirm-modal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0 pb-0">
              <div className={`confirm-modal__icon confirm-modal__icon--${variant}`}>
                <FaExclamationTriangle />
              </div>
              <button className="btn-close" onClick={onClose} disabled={saving} />
            </div>
            <div className="modal-body pt-2">
              <h5 className="confirm-modal__title">{title}</h5>
              <p className="confirm-modal__message">{message}</p>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button className="btn btn-light border" onClick={onClose} disabled={saving}>
                {cancelText}
              </button>
              <button className={`btn btn-${variant}`} onClick={onConfirm} disabled={saving}>
                {saving ? "Đang xử lý..." : confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
