import React from "react";
import { Link } from "react-router-dom";
import error from "../../assets/error.png";

export const NotFound = () => {
  return (
    <div>
      <h2>
        Page Not Found
        <Link className="btn" to="/">
          Go Home
        </Link>
      </h2>
      <br />
      <img src={error} alt="not found error" width="45%" />
    </div>
  );
};
