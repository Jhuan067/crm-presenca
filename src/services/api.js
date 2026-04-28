import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://192.168.2.106:3333",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const rawAdmin = localStorage.getItem("admin");
  let admin = null;

  try {
    admin = rawAdmin ? JSON.parse(rawAdmin) : null;
  } catch {
    admin = null;
  }

  if (admin) {
    if (typeof config.headers?.set === "function") {
      config.headers.set("x-admin-id", admin.id);
      config.headers.set("x-admin-email", admin.email);
    } else {
      config.headers = config.headers || {};
      config.headers["x-admin-id"] = admin.id;
      config.headers["x-admin-email"] = admin.email;
    }
  }

  console.log("HEADERS ENVIADOS:", config.headers);

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Não foi possível concluir a solicitação.";

    return Promise.reject({
      ...error,
      friendlyMessage: message,
    });
  }
);

export function getErrorMessage(error, fallback = "Não foi possível concluir a solicitação.") {
  return error?.friendlyMessage || fallback;
}

export default api;
