import { FaClipboardList, FaHospital } from "react-icons/fa6";
import RoutePage from "../../components/Common/RoutePage";
import StarRating from "../../components/Common/StarRating";
import NavBar from "../../components/NavBar";
import { Link } from "react-router";
import { toSlug } from "../../utils/helpers";
import "./DoctorsPage.scss";

const doctors = [
  {
    id: 2,
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "PGS.TS. Trần Minh Khoa",
    spec: "Tim mạch",
    hospital: "BV Chợ Rẫy, TP.HCM",
    rating: 4.9,
  },
  {
    id: 2,
    img: "https://randomuser.me/api/portraits/women/65.jpg",
    name: "TS.BS. Lê Thu Hằng",
    spec: "Da liễu",
    hospital: "BV Da Liễu TW, HN",
    rating: 4.8,
  },
  {
    id: 2,
    img: "https://randomuser.me/api/portraits/men/54.jpg",
    name: "GS.TS. Nguyễn Đức Tuấn",
    spec: "Nhi khoa",
    hospital: "BV Nhi Đồng 1, TP.HCM",
    rating: 4.9,
  },
  {
    id: 2,
    img: "https://randomuser.me/api/portraits/women/29.jpg",
    name: "ThS.BS. Phạm Bích Ngọc",
    spec: "Sản phụ khoa",
    hospital: "BV Từ Dũ, TP.HCM",
    rating: 3,
  },
  {
    id: 2,
    img: "https://randomuser.me/api/portraits/women/29.jpg",
    name: "ThS.BS. Phạm Bích Ngọc",
    spec: "Sản phụ khoa",
    hospital: "BV Từ Dũ, TP.HCM",
    rating: 3,
  },
  {
    id: 2,
    img: "https://randomuser.me/api/portraits/women/29.jpg",
    name: "ThS.BS. Phạm Bích Ngọc",
    spec: "Sản phụ khoa",
    hospital: "BV Từ Dũ, TP.HCM",
    rating: 3,
  },
  {
    id: 2,
    img: "https://randomuser.me/api/portraits/women/29.jpg",
    name: "ThS.BS. Phạm Bích Ngọc",
    spec: "Sản phụ khoa",
    hospital: "BV Từ Dũ, TP.HCM",
    rating: 3,
  },
  {
    id: 2,
    img: "https://randomuser.me/api/portraits/women/29.jpg",
    name: "ThS.BS. Phạm Bích Ngọc",
    spec: "Sản phụ khoa",
    hospital: "BV Từ Dũ, TP.HCM",
    rating: 3,
  },
  {
    id: 2,
    img: "https://randomuser.me/api/portraits/women/29.jpg",
    name: "ThS.BS. Phạm Bích Ngọc",
    spec: "Sản phụ khoa",
    hospital: "BV Từ Dũ, TP.HCM",
    rating: 3,
  },
  {
    id: 2,
    img: "https://randomuser.me/api/portraits/women/29.jpg",
    name: "ThS.BS. Phạm Bích Ngọc",
    spec: "Sản phụ khoa",
    hospital: "BV Từ Dũ, TP.HCM",
    rating: 3,
  },
  {
    id: 2,
    img: "https://randomuser.me/api/portraits/women/29.jpg",
    name: "ThS.BS. Phạm Bích Ngọc",
    spec: "Sản phụ khoa",
    hospital: "BV Từ Dũ, TP.HCM",
    rating: 3,
  },
  {
    id: 2,
    img: "https://randomuser.me/api/portraits/women/29.jpg",
    name: "ThS.BS. Phạm Bích Ngọc",
    spec: "Sản phụ khoa",
    hospital: "BV Từ Dũ, TP.HCM",
    rating: 3,
  },
  {
    id: 2,
    img: "https://randomuser.me/api/portraits/women/29.jpg",
    name: "ThS.BS. Phạm Bích Ngọc",
    spec: "Sản phụ khoa",
    hospital: "BV Từ Dũ, TP.HCM",
    rating: 3,
  },
  {
    id: 2,
    img: "https://randomuser.me/api/portraits/women/29.jpg",
    name: "ThS.BS. Phạm Bích Ngọc",
    spec: "Sản phụ khoa",
    hospital: "BV Từ Dũ, TP.HCM",
    rating: 3,
  },
  {
    id: 2,
    img: "https://randomuser.me/api/portraits/women/29.jpg",
    name: "ThS.BS. Phạm Bích Ngọc",
    spec: "Sản phụ khoa",
    hospital: "BV Từ Dũ, TP.HCM",
    rating: 3,
  },
  {
    id: 2,
    img: "https://randomuser.me/api/portraits/women/29.jpg",
    name: "ThS.BS. Phạm Bích Ngọc",
    spec: "Sản phụ khoa",
    hospital: "BV Từ Dũ, TP.HCM",
    rating: 3,
  },
  {
    id: 2,
    img: "https://randomuser.me/api/portraits/women/29.jpg",
    name: "ThS.BS. Phạm Bích Ngọc",
    spec: "Sản phụ khoa",
    hospital: "BV Từ Dũ, TP.HCM",
    rating: 3,
  },
  {
    id: 2,
    img: "https://randomuser.me/api/portraits/women/29.jpg",
    name: "ThS.BS. Phạm Bích Ngọc",
    spec: "Sản phụ khoa",
    hospital: "BV Từ Dũ, TP.HCM",
    rating: 3,
  },
];

const DoctorsPage = () => {
  return (
    <div className="doctors-page-container p-5">
      <div className="d-flex flex-column">
        {doctors.map(({ id, img, name, spec, hospital, rating }) => (
          <div
            key={id}
            className="doctor-item d-flex align-items-center gap-4 p-4 border-bottom"
          >
            <img src={img} alt={name} className="rounded flex-shrink-0" />
            <div className="d-flex flex-column gap-2 flex-grow-1">
              <div className="fw-bold">{name}</div>
              <div className="text-muted">{spec}</div>
              <div className="stars">
                <StarRating rating={rating} half={!Number.isInteger(rating)} />
              </div>
            </div>
            <button className="btn-book-doc btn btn-rounded flex-shrink-0">
              <Link to={`/doctors/${toSlug(name)}`}>Xem bác sĩ</Link>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsPage;
