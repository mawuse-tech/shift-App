import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children, allowedRoles }) => {
  const { loading, user } = useSelector((store) => store.loggedInUserData);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If user not logged in, go to login page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If user is logged in but not authorized for this route
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { loading, user } = useSelector((store) => store.loggedInUserData);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#e71919] to-[#2e0101]">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user) {
    // check user role
    if (user.role === "admin") {
      return <Navigate to="/adminDash" replace />;
    } else if (user.role === "worker") {
      return <Navigate to="/workersDash" replace />;
    }
  }

  return children;
};
