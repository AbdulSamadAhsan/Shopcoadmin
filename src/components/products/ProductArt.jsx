import React from "react";
export default function ProductArt({ type, color }) {
  return (
    <span className="product-art" style={{ background: color }}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        stroke="#44463f"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {type === "headphones" ? (
          <>
            <path d="M15 36V27a17 17 0 0 1 34 0v9" />
            <rect x="11" y="30" width="10" height="21" rx="4" fill="#656b58" />
            <rect x="43" y="30" width="10" height="21" rx="4" fill="#656b58" />
          </>
        ) : type === "bag" ? (
          <>
            <path d="M24 18v-4c0-8 16-8 16 0v4" />
            <rect x="15" y="17" width="34" height="39" rx="10" fill="#7e8971" />
            <rect x="21" y="35" width="22" height="15" rx="4" />
            <path d="M23 25h18" />
          </>
        ) : type === "lamp" ? (
          <>
            <path d="M22 9h20l9 23H13Z" fill="#c6a68e" />
            <path d="M32 33v19m-13 3h26" />
          </>
        ) : type === "shoe" ? (
          <>
            <path d="M10 39l7-17 14 10 7 5 15 5v10H9Z" fill="#faf9f5" />
            <path d="M10 46h43M25 32l-4 5m12-1-5 5" />
          </>
        ) : type === "watch" ? (
          <>
            <path d="M24 8h16v48H24Z" fill="#9ba48b" />
            <circle cx="32" cy="32" r="15" fill="#f6f6ec" />
            <path d="M32 22v10l6 4" />
          </>
        ) : (
          <>
            <path d="M15 20h30v21c0 18-30 18-30 0Z" fill="#b8a0a9" />
            <path d="M45 24h5c14 0 9 20-5 17M14 56h32" />
          </>
        )}
      </svg>
    </span>
  );
}
