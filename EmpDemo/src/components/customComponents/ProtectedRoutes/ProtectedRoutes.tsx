import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    const checkUserIdFromCache = async () => {
      try {
        const cache = await caches.open("login-cache");
        const response = await cache.match("/loginDetails");

        if (response) {
          const data = await response.json();
          setIsAuth(!!data?.UserID);
        } else {
          setIsAuth(false);
        }
      } catch {
        setIsAuth(false);
      }
    };

    checkUserIdFromCache();
  }, []);

  if (isAuth === null) return null; // or loading spinner

  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

