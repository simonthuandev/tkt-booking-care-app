import RoutePage from "../../components/Common/RoutePage";
import "./DoctorDetailPage.scss";
import { useState } from "react";

const doctor = {
  id: 2,
  img: "https://randomuser.me/api/portraits/women/29.jpg",
  name: "ThS.BS. Phạm Bích Ngọc",
  spec: "Sản phụ khoa",
  hospital: "BV Từ Dũ, TP.HCM",
  city: "Ho Chi Minh",
  rating: 3,
  examinationPrice: 500000, // Giá khám (đơn vị: VNĐ)
  slot: [
    "7:30 - 8:00",
    "8:00 - 8:30",
    "8:30 - 9:00",
    "9:00 - 9:30",
    "9:30 - 10:00",
    "10:00 - 10:30",
    "10:30 - 11:00",
    "11:00 - 11:30",
    "11:30 - 12:00",
    "13:00 - 13:30",
    "13:30 - 14:00",
    "14:00 - 14:30",
    "14:30 - 15:00",
    "15:00 - 15:30",
    "15:30 - 16:00",
    "16:00 - 16:30",
    "16:30 - 17:00",
    "17:00 - 17:30",
  ],

  address: [
    "3 Đường Số 17A, phường An Lạc, Thành phố Hồ Chí Minh",
    "Bệnh viện chợ rẫy",
  ],
  infomation: [
    "Chuyên gia 30 năm kinh nghiệm lâm sàng dày dặn trong lĩnh vực Cơ xương khớp - Chấn thương chỉnh hình",
    "Chuyên gia đầu ngành trong lĩnh vực chấn thương chỉnh hình và cơ xương khớp",
    "Từng công tác tại các bệnh viện lớn như: Bệnh viện Chợ Rẫy, Bệnh viện Chấn thương chỉnh hình TP.HCM, Bệnh viện Pháp Việt (FV)",
    "Trưởng khoa Chấn thương chỉnh hình tại Bệnh viện Quốc tế City (CIH)",
    "Bác sĩ nổi tiếng là người tiên phong và có kinh nghiệm vượt trội trong các ca phẫu thuật thay khớp háng, khớp gối, đặc biệt là ở bệnh nhân lớn tuổi đòi hỏi trình độ chuyên môn cao",
    "Bác sĩ được đánh giá cao về y đức và sự tận tình với bệnh nhân. Nhiều bệnh nhân và gia đình đã bày tỏ sự tin tưởng và yên tâm khi được bác sĩ thăm khám và điều trị",
  ],

  examinationTreatment: [
    "Chấn thương khớp gối, vai, cột sống (trong tai nạn sinh hoạt, chấn thương thể thao)",
    "Đứt dây chằng gối, dẹp rách sụn gối - trật khớp vai",
    "Chấn thương đứt dây chằng khớp gối",
    "Chấn thương rách đứt dây chằng cổ chân",
    "Chấn thương rách lật khớp vai",
    "Chấn thương rách gân khớp vai",
    "Thoái hóa khớp gối, cột sống cổ …",
    "Các bệnh lý đặc biệt trong thể thao",
    "Bệnh thoái hóa cột sống cổ tay đĩa đệm",
    "Bệnh lý khớp gối",
    "Hội chứng Tennis Elbow (viêm lồi cầu ngoài xương cánh tay là chấn thương thường gặp ở người chơi tennis)",
    "Gai gót chân",
    "Bệnh lý gối lệch trục xương ( vẹo trong , vẹo ngoài )",
    "Thoái hóa khớp háng",
  ],

  workExperience: [
    "Currently Head of Orthopedics Department, City International Hospital (2013 - present)",
    "Lecturer in Orthopedics and Traumatology, Pham Ngoc Thach University of Medicine; Lecturer in Surgery, Faculty of Medicine, Vietnam National University Ho Chi Minh City (2013 - present)",
    "Orthopedic Trauma Surgeon, French-Vietnamese Hospital (FV) (2002 - 2013)",
    "Physician in the Lower Extremity Department, Ho Chi Minh City Orthopedic and Trauma Hospital (1993 - 2002)",
    "Doctor in the Orthopedics Department, Cho Ray Hospital (1986 - 1993)",
  ],

  trainingProcess: [
    "Tốt nghiệp Bác sĩ tại Đại học Y dược TPHCM (1986)",
    "Tốt nghiệp Thạc sĩ chuyên ngành Chấn thương chỉnh hình, Đại học Y Dược TP.HCM (2002)",
    "Tốt nghiệp Tiến sĩ chuyên ngành Chấn thương chỉnh hình Đại học Y Dược TP.HCM (2011)",
    "Tốt nghiệp lớp đào tạo nội trú chuyên khoa Chấn thương chỉnh hình tại trường Đại học Y khoa Bordeaux 2, Pháp (1995)",
    "Bác sĩ nội trú khoa Chấn thương chỉnh hình Bệnh viện DAX, Bordeaux, Pháp (1995)",
  ],
};

const DoctorDetailPage = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Lấy ngày hôm nay để set min date
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="doctor-detail">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="doctor-image">
          <img src={doctor.img} alt={doctor.name} />
        </div>
        <div className="doctor-header">
          <h2>{doctor.name}</h2>
          <div className="doctor-meta">
            <span className="meta-item spec">{doctor.spec}</span>
            <span className="meta-item hospital">{doctor.hospital}</span>
            <span className="meta-item location">{doctor.city}</span>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div className="info-section-full">
        <div className="booking-container">
          <h3 className="booking-title">Đặt lịch khám</h3>

          {/* Date & Slot Selection */}
          <div className="booking-form">
            <div className="form-group">
              <label htmlFor="examination-date" className="form-label">
                Chọn ngày khám
              </label>
              <input
                type="date"
                id="examination-date"
                className="form-input date-input"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={getTodayDate()}
              />
            </div>

            {selectedDate && (
              <div className="form-group">
                <label className="form-label">Chọn giờ khám</label>
                <div className="slots-grid">
                  {doctor.slot.map((item, index) => (
                    <div
                      key={index}
                      className={`slot-box ${selectedSlot === item ? "selected" : ""}`}
                      onClick={() => setSelectedSlot(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Examination Price */}
            <div className="price-box">
              <div className="price-header">
                <span className="price-label">Giá khám:</span>
                <span className="price-value">
                  {doctor.examinationPrice.toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <p className="price-note">*Giá chỉ mang tính chất tham khảo</p>
            </div>
          </div>
        </div>
      </div>

      <div className="info-section-full">
        <h4>Thông tin bác sĩ</h4>
        <ul>
          {doctor.infomation.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="info-section-full">
        <h4>Khám và điều trị</h4>
        <ul>
          {doctor.examinationTreatment.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="info-section-full">
        <h4>Quá trình công tác</h4>
        <ul>
          {doctor.workExperience.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="info-section-full">
        <h4>Quá trình đào tạo</h4>
        <ul>
          {doctor.trainingProcess.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DoctorDetailPage;
