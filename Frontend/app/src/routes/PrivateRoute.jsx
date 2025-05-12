import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, roles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("roles");

  if (!token || userRole !== roles) {
    return (
      <Navigate to={roles === "admin" ? "/admin/login" : "/login"} replace />
    );
  }

  return children;
};

export default PrivateRoute;
