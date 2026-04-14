import { FaStar } from "react-icons/fa";
import { FaStarHalfStroke } from "react-icons/fa6";

export default function StarRating({ rating, half }) {
  const full = Math.floor(rating);
  return (
    <>
      {Array.from({ length: full }).map((_, i) => (
        <FaStar key={i}/>
      ))}
      {half && 
        <FaStarHalfStroke />
      }
    </>
  );
}