import React from "react";

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  return (
    <svg
      width="41"
      height="18"
      viewBox="0 0 41 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="star-rating"
      style={{ width: "41px", height: "18px" }}
    >
      <path
        d="M6.52447 3.46352C6.67415 3.00287 7.32585 3.00287 7.47553 3.46353L8.45934 6.49139C8.52628 6.6974 8.71826 6.83688 8.93487 6.83688H12.1186C12.6029 6.83688 12.8043 7.45669 12.4124 7.74139L9.83679 9.61271C9.66155 9.74003 9.58822 9.96572 9.65516 10.1717L10.639 13.1996C10.7886 13.6602 10.2614 14.0433 9.86955 13.7586L7.29389 11.8873C7.11865 11.76 6.88135 11.76 6.70611 11.8873L4.13045 13.7586C3.73859 14.0433 3.21136 13.6602 3.36103 13.1996L4.34484 10.1717C4.41178 9.96572 4.33845 9.74003 4.16321 9.61271L1.58755 7.74139C1.1957 7.45669 1.39708 6.83688 1.88145 6.83688H5.06513C5.28174 6.83688 5.47372 6.6974 5.54066 6.49139L6.52447 3.46352Z"
        fill="#FFA703"
      />
      <text
        fill="#333333"
        xmlSpace="preserve"
        style={{ whiteSpace: "pre" }}
        fontSize="12"
        letterSpacing="-0.03em"
      >
        <tspan x="18" y="13.5">
          {rating.toFixed(2)}
        </tspan>
      </text>
    </svg>
  );
};

export default StarRating;
