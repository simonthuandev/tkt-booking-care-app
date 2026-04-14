import { 
  FaBandage
} from "react-icons/fa6";

import { 
  FaClipboardList,
  FaHospital,
  FaHeart,
  FaEye,
  FaLungs,
  FaBaby,
  FaCapsules,
  FaBrain,
  FaBorderAll,

 } from "react-icons/fa";

import { 
  BsSearchHeartFill,
  BsCalendar2WeekFill,
  BsBellFill,
  BsCameraVideoFill,
  BsHouseHeartFill,
  BsFileEarmarkMedicalFill,
  BsShieldFillPlus,
  BsPersonBadgeFill
 } from "react-icons/bs";

const howIcons = {
  searchHeartFill: BsSearchHeartFill,
  calendar2WeekFill: BsCalendar2WeekFill,
  bellFill: BsBellFill,
};

const serviceIcons = {
  cameraVideoFill: BsCameraVideoFill,
  houseHeartFill: BsHouseHeartFill,
  fileEarmarkMedicalFill: BsFileEarmarkMedicalFill,
  shieldFillPlus: BsShieldFillPlus,
}

const heroIcons = {
  bsPersonBadgeFill: BsPersonBadgeFill,
  faClipboardList: FaClipboardList,
  faHospital: FaHospital,
}

const specialtyIcons = {
  faHeart: FaHeart,
  faEye: FaEye,
  faLungs: FaLungs,
  faBaby: FaBaby,
  faBandage: FaBandage,
  faCapsules: FaCapsules,
  faBrain: FaBrain,
  faBorderAll: FaBorderAll,
  
}

const iconMap = {
  ...howIcons,
  ...serviceIcons,
  ...heroIcons,
  ...specialtyIcons,
};

export default iconMap;