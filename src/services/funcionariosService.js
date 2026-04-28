import api from "./api";

function validarFuncionario(payload) {
  if (!payload.nome) throw new Error("Nome obrigatório");
  if (!payload.matricula) throw new Error("Matrícula obrigatória");
  if (!payload.local_trabalho_nome) throw new Error("Local de trabalho obrigatório");
  if (!payload.turno) throw new Error("Turno obrigatório");

  const turnosValidos = ["manha", "tarde", "noite"];
  if (!turnosValidos.includes(payload.turno)) {
    throw new Error("Turno inválido");
  }
}

export async function getFuncionarios() {
  const response = await api.get("/crm/funcionarios");
  return response.data;
}

export async function createFuncionario(payload) {
  validarFuncionario(payload);

  const response = await api.post("/crm/funcionarios", payload);
  return response.data;
}

export async function updateFuncionario(id, payload) {
  validarFuncionario(payload);

  const response = await api.put(`/crm/funcionarios/${id}`, payload);
  return response.data;
}

export async function deleteFuncionario(id) {
  const response = await api.delete(`/crm/funcionarios/${id}`);
  return response.data;
}