// protected route

import React from "react";
import { Navigate } from "react-router-dom";

const NotAuthRoute = ({ children, user }) => {
  if (user) {
    return <Navigate to={"/"} />;
  }
  return children;
};

export default NotAuthRoute;
