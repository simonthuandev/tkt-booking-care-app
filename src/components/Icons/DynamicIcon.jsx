import { FaQuestionCircle } from "react-icons/fa";
import iconMap from "./iconMap";

const DynamicIcon = ({ name }) => {
  const IconComponent = iconMap[name];
  return IconComponent ? <IconComponent /> : <FaQuestionCircle />;
};

export default DynamicIcon;