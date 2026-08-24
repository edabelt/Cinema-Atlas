import React, { useContext } from "react";
import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { AuthContext } from "../../contexts/authContext";
import Spinner from "../spinner";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<
  ProtectedRouteProps
> = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          message:
            "You must log in to access that page.",
          from: location.pathname,
        }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;