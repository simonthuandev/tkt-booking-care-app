import axiosInstance from "./axiosInstance";

// ==========================================
// 0. Module Upload (Tải ảnh lên backend)
// ==========================================
export const uploadService = {
  uploadImage: (type, file) => {
    const formData = new FormData();
    formData.append("file", file);

    return axiosInstance.post(`/uploads/${type}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// ==========================================
// 1. Module User Profile (Bệnh nhân quản lý hồ sơ)
// ==========================================
export const patientProfileService = {
  // Lấy danh sách hồ sơ khám bệnh của User
  getProfiles: () => axiosInstance.get("/users/me/patient-profiles"),

  // Xem chi tiết 1 hồ sơ
  getProfileDetail: (id) => axiosInstance.get(`/users/me/patient-profiles/${id}`),

  // Tạo mới hồ sơ
  createProfile: (data) => axiosInstance.post("/users/me/patient-profiles", data),

  // Cập nhật hồ sơ
  updateProfile: (id, data) => axiosInstance.patch(`/users/me/patient-profiles/${id}`, data),

  // Chọn làm hồ sơ mặc định
  setDefaultProfile: (id) => axiosInstance.patch(`/users/me/patient-profiles/${id}/default`),

  // Xóa hồ sơ
  deleteProfile: (id) => axiosInstance.delete(`/users/me/patient-profiles/${id}`),
};

// ==========================================
// 2. Module Doctor (Quản lý Bác Sĩ)
// ==========================================
export const doctorService = {
  // Public: Danh sách Bác Sĩ
  doctors: (params = {}) => axiosInstance.get("/doctors", { params }),

  // Public: Chi tiết Bác Sĩ
  doctorDetail: (slug) => axiosInstance.get(`/doctors/${slug}`),

  // Doctor: Lấy Profile cá nhân
  getMeProfile: () => axiosInstance.get("/doctors/me/profile"),

  // Doctor: Cập nhật Profile cá nhân
  updateMeProfile: (data) => axiosInstance.patch("/doctors/me/profile", data),

  // Admin: Quản lý Bác Sĩ - Danh sách
  adminGetDoctors: (params = {}) => axiosInstance.get("/admin/doctors", { params }),

  adminGetDoctorDetail: (id) => axiosInstance.get(`/admin/doctors/${id}`),

  // Admin: Quản lý Bác Sĩ - Tạo mới
  adminCreateDoctor: (data) => axiosInstance.post("/admin/doctors", data),

  // Admin: Quản lý Bác Sĩ - Cập nhật
  adminUpdateDoctor: (id, data) => axiosInstance.patch(`/admin/doctors/${id}`, data),

  // Admin: Quản lý Bác Sĩ - Xóa mềm/Vô hiệu hóa
  adminDeleteDoctor: (id) => axiosInstance.delete(`/admin/doctors/${id}`),
};

// ==========================================
// 3. Module Hospital (Quản lý Cơ Sở Y Tế / Bệnh Viện)
// ==========================================
export const hospitalService = {
  // Public: Danh sách Bệnh viện
  hospitals: (params = {}) => axiosInstance.get("/hospitals", { params }),

  // Public: Lấy danh sách Thành phố
  getCities: () => axiosInstance.get("/hospitals/cities"),

  // Public: Chi tiết Bệnh viện
  hospitalDetail: (slug) => axiosInstance.get(`/hospitals/${slug}`),

  // Admin: Quản lý Bệnh viện - Danh sách đầy đủ
  adminGetHospitals: (params = {}) => axiosInstance.get("/admin/hospitals", { params }),

  // Admin: Quản lý Bệnh viện - Tạo mới
  adminCreateHospital: (data) => axiosInstance.post("/admin/hospitals", data),

  // Admin: Quản lý Bệnh viện - Cập nhật
  adminUpdateHospital: (id, data) => axiosInstance.patch(`/admin/hospitals/${id}`, data),

  // Admin: Quản lý Bệnh viện - Xóa mềm
  adminDeleteHospital: (id) => axiosInstance.delete(`/admin/hospitals/${id}`),
};

// ==========================================
// 4. Module Specialty (Quản lý Chuyên Khoa)
// ==========================================
export const specialtyService = {
  // Public: Danh sách Chuyên khoa
  specialties: (params = {}) => axiosInstance.get("/specialties", { params }),

  // Public: Chi tiết Chuyên khoa
  specialtyDetail: (slug) => axiosInstance.get(`/specialties/${slug}`),

  // Admin: Quản lý Chuyên khoa - Danh sách đầy đủ
  adminGetSpecialties: (params = {}) => axiosInstance.get("/admin/specialties", { params }),

  // Admin: Quản lý Chuyên khoa - Tạo mới
  adminCreateSpecialty: (data) => axiosInstance.post("/admin/specialties", data),

  // Admin: Quản lý Chuyên khoa - Cập nhật
  adminUpdateSpecialty: (id, data) => axiosInstance.patch(`/admin/specialties/${id}`, data),

  // Admin: Quản lý Chuyên khoa - Xóa mềm
  adminDeleteSpecialty: (id) => axiosInstance.delete(`/admin/specialties/${id}`),
};

// ==========================================
// 4.1 Module AI (Gợi ý chuyên khoa)
// ==========================================
export const aiService = {
  triage: (message) => axiosInstance.post("/ai/triage", { message }),
};

// ==========================================
// 5. Module TimeSlot (Quản lý Lịch Khám / Ca Làm Việc)
// ==========================================
export const timeSlotService = {
  // Public: Xem ca trống của Bác sĩ
  getTimeSlots: (params = {}) => axiosInstance.get("/timeslots", { params }),

  // Doctor: Xem lịch biểu đăng ký chung
  getDoctorSchedule: () => axiosInstance.get("/doctors/me/schedule"),

  // Doctor: Lấy tất cả slot chi tiết của bản thân
  getDoctorTimeSlots: (params = {}) => axiosInstance.get("/doctors/me/timeslots", { params }),

  // Doctor: Tự khóa/mở khóa slot của mình
  doctorBlockTimeSlot: (id, data = {}) => axiosInstance.patch(`/doctors/me/timeslots/${id}/block`, data),

  // Admin: Xem tổng hợp tất cả slots
  adminGetTimeSlots: (params = {}) => axiosInstance.get("/admin/timeslots", { params }),

  // Admin: Chức năng sinh slots tự động
  adminGenerateTimeSlots: (data) => axiosInstance.post("/admin/timeslots/generate", data),

  // Admin: Chủ động khóa slot
  adminBlockTimeSlot: (id, data = {}) => axiosInstance.patch(`/admin/timeslots/${id}/block`, data),

  // Admin: Xóa cứng 1 slot (nếu chưa có ai đặt)
  adminDeleteTimeSlot: (id) => axiosInstance.delete(`/admin/timeslots/${id}`),

  // Admin: Xóa hàng loạt theo ngày (nếu chưa ai đặt)
  adminBulkDeleteTimeSlots: (data = {}) => axiosInstance.delete("/admin/timeslots/bulk", { data }),
};

// ==========================================
// 6. Module Appointment (Quản lý Đặt Lịch)
// ==========================================
export const appointmentService = {
  // User: Đặt lịch mới
  createAppointment: (data) => axiosInstance.post("/appointments", data),

  // User: Tự hủy lịch
  cancelAppointment: (id, data = {}) => axiosInstance.post(`/appointments/${id}/cancel`, data),

  // User: Liệt kê lịch hẹn của bản thân
  getMyAppointments: (params = {}) => axiosInstance.get("/users/me/appointments", { params }),

  // User: Chi tiết một lịch hẹn cụ thể
  getMyAppointmentDetail: (id) => axiosInstance.get(`/users/me/appointments/${id}`),

  // Doctor: Lấy danh sách lịch hẹn đặt với bác sĩ
  getDoctorAppointments: (params = {}) => axiosInstance.get("/doctors/me/appointments", { params }),

  // Doctor: Cập nhật trạng thái lịch hẹn
  doctorUpdateAppointmentStatus: (id, data) => axiosInstance.patch(`/appointments/${id}/status`, data),

  // Admin: Quản lý toàn bộ lịch hẹn hệ thống
  adminGetAppointments: (params = {}) => axiosInstance.get("/admin/appointments", { params }),

  // Admin: Xem chi tiết lịch hẹn
  adminGetAppointmentDetail: (id) => axiosInstance.get(`/admin/appointments/${id}`),

  // Admin: Sửa trạng thái bất kỳ lịch nào
  adminUpdateAppointmentStatus: (id, data) => axiosInstance.patch(`/admin/appointments/${id}/status`, data),

  // Admin: Cưỡng chế hủy lịch hẹn
  adminCancelAppointment: (id, data = {}) => axiosInstance.patch(`/admin/appointments/${id}/cancel`, data),
};

// ==========================================
// 7. Module Review (Đánh Giá & Phản Hồi)
// ==========================================
export const reviewService = {
  // Public: Xem đánh giá công khai
  getReviews: (params = {}) => axiosInstance.get("/reviews", { params }),

  // User: Viết review
  createReview: (data) => axiosInstance.post("/reviews", data),

  // User: Danh sách review chính mình đã viết
  getMyReviews: (params = {}) => axiosInstance.get("/users/me/reviews", { params }),

  // Doctor: Danh sách review bệnh nhân đánh giá mình
  getDoctorReviews: (params = {}) => axiosInstance.get("/doctors/me/reviews", { params }),

  // Admin: Xem toàn bộ đánh giá (kể cả bị ẩn)
  adminGetReviews: (params = {}) => axiosInstance.get("/admin/reviews", { params }),

  // Admin: Xem chi tiết 1 bài đánh giá
  adminGetReviewDetail: (id) => axiosInstance.get(`/admin/reviews/${id}`),

  // Admin: Ẩn/Hiện một bình luận
  adminUpdateReviewVisibility: (id, data) => axiosInstance.patch(`/admin/reviews/${id}/visibility`, data),
};

// ==========================================
// 8. Module Search (Tìm Kiếm Tổng Hợp)
// ==========================================
export const searchService = {
  // Public: Tìm kiếm tổng hợp
  search: (params = {}) => axiosInstance.get("/search", { params }),
};

// ==========================================
// 9. Module Public Stats (Thống kê công khai)
// ==========================================
export const publicStatsService = {
  // Public: Thống kê hiển thị trang chủ
  getStats: () => axiosInstance.get("/public/stats"),
};

// ==========================================
// 10. Module Payment (Thanh Toán)
// ==========================================
export const paymentService = {
  // User: Tạo link thanh toán VNPAY/MoMo cho một lịch hẹn cụ thể
  createPaymentUrl: (data) => axiosInstance.post("/payment/create-url", data),

  // Admin/Nhân viên lễ tân xác nhận bệnh nhân đã thanh toán tiền mặt
  confirmCashPayment: (id) => axiosInstance.patch(`/payment/confirm-cash/${id}`),
};

// ==========================================
// 11. Các API Quản Trị Hệ Thống (Module Admin System)
// ==========================================
export const adminSystemService = {
  // Dashboard Statistics
  getStats: () => axiosInstance.get("/admin/stats"),

  // Báo cáo tài chính/lịch hẹn theo khoảng thời gian
  getReports: (params = {}) => axiosInstance.get("/admin/reports", { params }),

  // Quản lý người dùng hệ thống
  getUsers: (params = {}) => axiosInstance.get("/admin/users", { params }),

  // Đổi vai trò user
  updateUserRole: (id, data) => axiosInstance.patch(`/admin/users/${id}/role`, data),

  // Khóa/Mở khóa tài khoản (Cấm đăng nhập)
  banUser: (id, data) => axiosInstance.patch(`/admin/users/${id}/ban`, data),
};
