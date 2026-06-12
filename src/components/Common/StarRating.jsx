import { FaStar } from "react-icons/fa";
import "./StarRating.scss";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const formatRating = (rating) => {
  const value = Number(rating) || 0;
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
};

export default function StarRating({
  rating = 0,
  max = 5,
  size = 14,
  showValue = false,
  reviewCount,
  className = "",
}) {
  const numericRating = Number(rating) || 0;
  const filled = clamp(Math.round(numericRating), 0, max);
  const hasReviewCount = reviewCount !== undefined && reviewCount !== null;

  return (
    <span
      className={`star-rating ${className}`.trim()}
      aria-label={`${formatRating(numericRating)} trên ${max} sao`}
    >
      <span className="star-rating__icons" aria-hidden="true">
        {Array.from({ length: max }).map((_, index) => (
          <FaStar
            key={index}
            size={size}
            className={index < filled ? "star-rating__star star-rating__star--filled" : "star-rating__star star-rating__star--empty"}
          />
        ))}
      </span>

      {(showValue || hasReviewCount) && (
        <span className="star-rating__text">
          {showValue && <strong>{formatRating(numericRating)}</strong>}
          {hasReviewCount && <span>({reviewCount || 0} đánh giá)</span>}
        </span>
      )}
    </span>
  );
}
