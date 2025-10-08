export async function apiRequest(route, method = "GET", body = null, callback = null) {
  const token = localStorage.getItem("jwt");

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(`/api${route}`, options);

    if (res.status === 401) {
      // Token invalide → on supprime et on redirige
      localStorage.removeItem("jwt");
      window.location.href = "/auth";
      return;
    }

    if (!res.ok) {
      throw new Error(`Erreur API: ${res.status}`);
    }

    const data = await res.json();

    // ⚡️ si un callback est fourni → on l’appelle
    if (callback && typeof callback === "function") {
      callback(data);
    }

    return data;
  } catch (err) {
    console.error("Erreur API:", err);
    throw err;
  }
}