import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, UserRound } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import Table from "../components/Table";
import Button from "../components/Button";
import { theme } from "../styles/theme";
import { getErrorMessage } from "../services/api";
import {
  createFuncionario,
  deleteFuncionario,
  getFuncionarios,
  updateFuncionario,
} from "../services/funcionariosService";

const initialForm = {
  nome: "",
  matricula: "",
  local_trabalho_nome: "",
  turno: "manha",
};

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    loadFuncionarios();
  }, []);

  async function loadFuncionarios() {
    setLoading(true);
    setError("");

    try {
      const payload = await getFuncionarios();
      setFuncionarios(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.log(err);
      setFuncionarios([]);
      setError(getErrorMessage(err, "Não foi possível carregar os funcionários."));
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingItem(null);
    setForm(initialForm);
    setModalOpen(true);
  }

  function openEditModal(item) {
    setEditingItem(item);
    setForm({
      nome: item.nome || "",
      matricula: item.matricula || "",
      local_trabalho_nome: item.local_trabalho_nome || item.local || "",
      turno: item.turno || "manha",
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingItem(null);
    setForm(initialForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingItem) {
        await updateFuncionario(getItemId(editingItem), form);
      } else {
        await createFuncionario(form);
      }

      closeModal();
      await loadFuncionarios();
    } catch (err) {
      console.log(err);
      setError(getErrorMessage(err, "Não foi possível salvar o funcionário."));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    const itemId = getItemId(item);
    if (!itemId) {
      setError("Não foi possível identificar o funcionário para exclusão.");
      return;
    }

    setError("");

    try {
      await deleteFuncionario(itemId);
      await loadFuncionarios();
    } catch (err) {
      console.log(err);
      setError(getErrorMessage(err, "Não foi possível excluir o funcionário."));
    }
  }

  return (
    <MainLayout>
      <div style={styles.container}>
        <div style={styles.top}>
          <div>
            <h2 style={styles.title}>Funcionários</h2>
            <p style={styles.subtitle}>Gestão completa da base vinda do backend.</p>
          </div>

          <Button onClick={openCreateModal}>
            <Plus size={16} />
            Novo funcionário
          </Button>
        </div>

        {loading && <p style={styles.info}>Carregando...</p>}
        {error && <p style={styles.error}>{error}</p>}

        <Table
          columns={[
            {
              key: "nome",
              title: "Nome",
              render: (row) => (
                <div style={styles.employeeCell}>
                  <div style={styles.employeeAvatar}>
                    {(row.nome || "F").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={styles.employeeName}>{row.nome || "-"}</div>
                    <div style={styles.employeeMeta}>Colaborador</div>
                  </div>
                </div>
              ),
            },
            { key: "matricula", title: "Matrícula" },
            {
              key: "turno",
              title: "Turno",
              render: (row) => {
                const turno = row.turno;

                const label =
                  turno === "manha"
                    ? "🌅 Manhã"
                    : turno === "tarde"
                    ? "🌇 Tarde"
                    : turno === "noite"
                    ? "🌙 Noite"
                    : "-";

                const color =
                  turno === "manha"
                    ? "#2563eb"
                    : turno === "tarde"
                    ? "#f59e0b"
                    : turno === "noite"
                    ? "#7c3aed"
                    : "#64748b";

                return (
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: "600",
                      backgroundColor: `${color}15`,
                      color,
                    }}
                  >
                    {label}
                  </span>
                );
              },
            },
            {
              key: "local_trabalho",
              title: "Local de Trabalho",
              render: (row) => row.local_trabalho_nome || row.local || "-",
            },
            {
              key: "acoes",
              title: "Ações",
              render: (row) => (
                <div style={styles.actionsRow}>
                  <Button variant="soft" style={styles.inlineButton} onClick={() => openEditModal(row)}>
                    <Pencil size={14} />
                    Editar
                  </Button>
                  <Button
                    variant="secondary"
                    style={styles.inlineButton}
                    onClick={() => handleDelete(row)}
                  >
                    <Trash2 size={14} />
                    Excluir
                  </Button>
                </div>
              ),
            },
          ]}
          data={funcionarios}
          emptyMessage="Nenhum dado encontrado"
          rowKey="id"
        />

        {modalOpen && (
          <div style={styles.overlay}>
            <form style={styles.modal} onSubmit={handleSubmit}>
              <div style={styles.modalIcon}>
                <UserRound size={20} color={theme.colors.primary} />
              </div>
              <h3 style={styles.modalTitle}>
                {editingItem ? "Editar funcionário" : "Novo funcionário"}
              </h3>
              <p style={styles.modalText}>Os dados enviados aqui são persistidos diretamente no backend.</p>

              <input
                placeholder="Nome"
                style={styles.input}
                value={form.nome}
                onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))}
                required
              />
              <input
                placeholder="Matrícula"
                style={styles.input}
                value={form.matricula}
                onChange={(event) =>
                  setForm((current) => ({ ...current, matricula: event.target.value }))
                }
                required
              />
              <input
                placeholder="Local de Trabalho"
                style={styles.input}
                value={form.local_trabalho_nome}
                onChange={(event) =>
                  setForm((current) => ({ ...current, local_trabalho_nome: event.target.value }))
                }
              />

              <select
                value={form.turno}
                onChange={(e) => setForm({ ...form, turno: e.target.value })}
                style={styles.input}
              >
                <option value="manha">Manhã (06h - 14h)</option>
                <option value="tarde">Tarde (15h - 23h)</option>
                <option value="noite">Noite (23h - 07h)</option>
              </select>

              <div style={styles.actions}>
                <Button variant="secondary" style={styles.actionButton} onClick={closeModal} type="button">
                  Cancelar
                </Button>
                <Button style={styles.actionButton} type="submit">
                  {saving ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

function getItemId(item) {
  return item?.id ?? item?._id;
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 700,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    margin: "8px 0 0",
    color: theme.colors.textSecondary,
    fontSize: "14px",
  },
  info: {
    margin: 0,
    color: theme.colors.textSecondary,
  },
  error: {
    margin: 0,
    color: theme.colors.danger,
  },
  employeeCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  employeeAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: theme.colors.primarySoft,
    color: theme.colors.primary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
  },
  employeeName: {
    fontSize: "14px",
    fontWeight: 600,
    color: theme.colors.textPrimary,
  },
  employeeMeta: {
    marginTop: "4px",
    fontSize: "12px",
    color: theme.colors.textSecondary,
  },
  actionsRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  inlineButton: {
    padding: "8px 12px",
    fontSize: "12px",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15,23,42,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  modal: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "380px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    boxShadow: theme.shadow,
    border: `1px solid ${theme.colors.border}`,
  },
  modalIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    backgroundColor: theme.colors.primarySoft,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    margin: 0,
    fontWeight: 700,
    color: theme.colors.textPrimary,
  },
  modalText: {
    margin: 0,
    fontSize: "14px",
    color: theme.colors.textSecondary,
    lineHeight: 1.5,
  },
  input: {
    padding: "12px",
    borderRadius: "12px",
    border: `1px solid ${theme.colors.border}`,
    outline: "none",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "10px",
  },
  actionButton: {
    padding: "10px 14px",
  },
};
