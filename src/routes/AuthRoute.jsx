// protected route

import React from "react";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to={"/login"} />;
  }
  return children;
};

export default AuthRoute;
