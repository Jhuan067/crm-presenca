import api from "./api";

export async function getPresencas() {
  const response = await api.get("/crm/presenca");
  return response.data;
}
