import { useState } from "react";
import MainLayout from "../layouts/MainLayout";

export default function Funcionarios() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <MainLayout>
      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.top}>
          <h2 style={styles.title}>Funcionários</h2>

          <button style={styles.button} onClick={() => setModalOpen(true)}>
            + Novo Funcionário
          </button>
        </div>

        {/* TABELA (TEMPLATE VISUAL) */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nome</th>
                <th style={styles.th}>Matrícula</th>
                <th style={styles.th}>Local de Trabalho</th>
              </tr>
            </thead>

            <tbody>
              {/* vazio por enquanto */}
              <tr>
                <td style={styles.empty} colSpan="3">
                  Nenhum funcionário cadastrado
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {modalOpen && (
          <div style={styles.overlay}>
            <div style={styles.modal}>

              <h3 style={styles.modalTitle}>Novo Funcionário</h3>

              <input placeholder="Nome" style={styles.input} />
              <input placeholder="Matrícula" style={styles.input} />
              <input placeholder="Local de Trabalho" style={styles.input} />

              <div style={styles.actions}>
                <button
                  style={styles.cancel}
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </button>

                <button style={styles.save}>
                  Salvar
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
}

/* ESTILOS */
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1e293b",
  },

  button: {
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  tableContainer: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "14px",
    backgroundColor: "#f1f5f9",
    fontSize: "13px",
    color: "#475569",
  },

  empty: {
    padding: "20px",
    textAlign: "center",
    color: "#94a3b8",
  },

  /* MODAL */
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  modal: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "12px",
    width: "320px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  modalTitle: {
    marginBottom: "10px",
    fontWeight: "600",
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    outline: "none",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "10px",
  },

  cancel: {
    backgroundColor: "#e2e8f0",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  save: {
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};