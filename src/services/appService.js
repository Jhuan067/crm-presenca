import api from "./api";

export async function getAppAccessList() {
  const response = await api.get("/crm/app");
  return response.data;
}

export async function createAppAccess(payload) {
  const response = await api.post("/crm/app/criar-acesso", payload);
  return response.data;
}

export async function resetAppPassword(payload) {
  const response = await api.post("/crm/app/resetar-senha", payload);
  return response.data;
}
