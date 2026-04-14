const LoadingSpinner = () => {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Đang tải...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;