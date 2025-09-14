import { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const location = useLocation();
  const token = localStorage.getItem("jwt");
  const [isValid, setIsValid] = useState(null); // null = en cours, true = ok, false = invalide

  useEffect(() => {
    if (!token) {
      setIsValid(false);
      return;
    }

    // Vérification du token auprès du backend
    fetch("/api/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Token invalide");
        return res.json();
      })
      .then(() => setIsValid(true))
      .catch(() => {
        localStorage.removeItem("jwt");
        setIsValid(false);
      });
  }, [token]);

  // Pas de token → rediriger direct
  if (!token) {
    sessionStorage.setItem("returnTo", location.pathname);
    return <Navigate to="/auth" replace />;
  }

  // Token en cours de validation → afficher un loader
  if (isValid === null) {
    return <div>Chargement...</div>;
  }

  // Token invalide → redirection
  if (isValid === false) {
    sessionStorage.setItem("returnTo", location.pathname);
    return <Navigate to="/auth" replace />;
  }

  // Token ok → afficher la page

  return <Outlet />;
}