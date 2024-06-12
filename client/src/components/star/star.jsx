import { FaStar } from "react-icons/fa";
import "./star.css";

const Star = ({ initialRate }) => {
  return (
    <div className="rating">
      {[...Array(5)].map((star, index) => {
        const currentRating = index + 1;
        return (
          <label key={currentRating}>
            <input
              type="radio"
              name="rate"
              value={currentRating}
              defaultValue={initialRate}
            />
            <FaStar
              className="star"
              size={20}
              color={currentRating <= initialRate ? "#ffc107" : "#e4e5e9"}
            />
          </label>
        );
      })}
    </div>
  );
};

export default Star;
