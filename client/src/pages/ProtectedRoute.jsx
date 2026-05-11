import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/dad/me`, {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Checking login...</p>;

  if (!isAuthenticated) {
    return <Navigate to="/dad-login" replace state={{ from: location }} />;
  }

  return children;
}