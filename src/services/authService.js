import api from "./api";

export async function loginAdmin(payload) {
  const response = await api.post("/crm/login", payload);
  return response.data;
}
