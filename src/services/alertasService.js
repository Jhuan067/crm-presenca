import api from "./api";

export async function getAlertas() {
  const response = await api.get("/crm/alertas");
  return response.data;
}
