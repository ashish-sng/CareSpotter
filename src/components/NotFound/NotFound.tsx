import React from "react";
import "./NotFound.css"; // Import the CSS file

const NotFound: React.FC = () => {
  return (
    <div className="no-results">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M15 9l-6 6M9 9l6 6" />
      </svg>
      <h2>No Results Found</h2>
      <p>Sorry, we couldn't find any results matching your search criteria.</p>
    </div>
  );
};

export default NotFound;
