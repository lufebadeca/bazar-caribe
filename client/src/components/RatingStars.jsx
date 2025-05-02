const Star = ({ type }) => {
    const baseClass = "w-5 h-5";
    const colors = {
      full: "text-yellow-500",
      half: "text-yellow-500",
      empty: "text-gray-300",
    };
  
    if (type === "half") {
      return (
        <svg
          className={`${baseClass} ${colors[type]}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <defs>
            <linearGradient id="half-gradient">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half-gradient)"
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 
               9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          />
        </svg>
      );
    }
  
    return (
      <svg
        className={`${baseClass} ${colors[type]}`}
        viewBox="0 0 24 24"
        fill={type === "empty" ? "none" : "currentColor"}
        stroke="currentColor"
        strokeWidth="1"
      >
        <path
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 
             9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        />
      </svg>
    );
  };
  
  const RatingStars = ({ rating }) => {
    if (typeof rating !== "number" || rating <= 0) return null;
  
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} type="full" />
        ))}
        {halfStar && <Star key="half" type="half" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} type="empty" />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  export default RatingStars;