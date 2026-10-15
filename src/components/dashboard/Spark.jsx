import React from "react";
export default function Spark({ down = false }) {
  return (
    <svg className="spark" viewBox="0 0 112 38">
      <path
        d={
          down
            ? "M0 9 12 14 23 10 33 23 45 17 56 23 68 18 79 29 90 25 101 31 112 28"
            : "M0 32 11 24 20 29 30 17 41 21 51 12 62 17 71 7 82 13 91 6 102 10 112 1"
        }
        fill="none"
        stroke={down ? "#d59a48" : "#52896d"}
        strokeWidth="2"
      />
    </svg>
  );
}
