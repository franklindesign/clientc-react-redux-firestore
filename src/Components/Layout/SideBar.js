import React from "react";
import { Link } from "react-router-dom";

export default () => {
  return (
    <div>
      <Link to="/client/add" className="btn btn-dark">
        Add New Client <i className="fas fa-user-plus ml-1" />
      </Link>
    </div>
  );
};
