import api from "./api";

export async function getDashboard(params) {
  const response = await api.get("/crm/dashboard", {
    params: {
      periodo: params.periodo,
      data: params.data,
    },
  });

  return response.data;
}
