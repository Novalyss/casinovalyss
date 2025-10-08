import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const SCOPES = import.meta.env.VITE_SCOPES;

export default function Auth() {
  const navigate = useNavigate();

    async function saveUserToken(access_token) {
        await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ access_token })
        })
        .then(res => res.json())
        .then(data => {
            localStorage.setItem("jwt", data.token);
            const returnTo = sessionStorage.getItem("returnTo") || "/";
            sessionStorage.removeItem("returnTo");
            navigate(returnTo, { replace: true });
        });
    }
  
  async function saveUserInfo() {
    const data = await apiRequest("/me");
    localStorage.setItem("userInfo", data.result);
  }

  useEffect(() => {

    if (window.location.hash.includes("access_token")) {
      const params = new URLSearchParams(window.location.hash.substring(1));
      const access_token = params.get("access_token");
      if (access_token) {
      (async () => {
        await saveUserToken(access_token);
        saveUserInfo();
        //window.history.replaceState({}, document.title, window.location.pathname);
      })();
    }
    }
  }, [navigate]);

  const handleLogin = () => {
    const authUrl =
      `https://id.twitch.tv/oauth2/authorize` +
      `?client_id=${encodeURIComponent(CLIENT_ID)}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&response_type=token` +
      `&scope=${encodeURIComponent(SCOPES)}`;
    window.location.href = authUrl;
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Connexion Twitch</h1>
      <button onClick={handleLogin} className="px-4 py-2 bg-purple-600 text-white rounded">
        Se connecter avec Twitch
      </button>
    </div>
  );

}