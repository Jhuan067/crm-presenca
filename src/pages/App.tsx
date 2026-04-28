import { useEffect, useState } from "react";
import { CSSProperties } from "react";
import MainLayout from "../layouts/MainLayout";
import Table from "../components/Table";
import Button from "../components/Button";
import Badge from "../components/Badge";
import { theme } from "../styles/theme";
import { getErrorMessage } from "../services/api";
import {
  createAppAccess,
  getAppAccessList,
  resetAppPassword,
} from "../services/appService";

type Funcionario = {
  id?: number | string;
  _id?: number | string;
  nome?: string;
  matricula?: string;
  ativo?: boolean;
  status?: string;
  email?: string;
};

const initialForm = {
  nome: "",
  matricula: "",
  email: "",
};

export default function AppPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    loadAppAccess();
  }, []);

  async function loadAppAccess() {
    setLoading(true);
    setError("");

    try {
      const payload = await getAppAccessList();
      setFuncionarios(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.log(err);
      setFuncionarios([]);
      setError(
        getErrorMessage(err, "Não foi possível carregar os acessos do app.")
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAccess(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setFeedback("");

    try {
      await createAppAccess(form);
      setFeedback("Acesso criado com sucesso.");
      setModalOpen(false);
      setForm(initialForm);
      await loadAppAccess();
    } catch (err) {
      console.log(err);
      setError(getErrorMessage(err, "Não foi possível criar o acesso."));
    } finally {
      setSaving(false);
    }
  }

  async function handleResetPassword(item: Funcionario) {
    setError("");
    setFeedback("");

    try {
      await resetAppPassword({
        id: item.id ?? item._id,
        matricula: item.matricula,
      });
      setFeedback(
        `Senha resetada para ${
          item.nome || item.matricula || "usuário"
        }.`
      );
    } catch (err) {
      console.log(err);
      setError(getErrorMessage(err, "Não foi possível resetar a senha."));
    }
  }

  return (
    <MainLayout>
      <div style={styles.container}>
        <div style={styles.top}>
          <div>
            <h2 style={styles.title}>App</h2>
            <p style={styles.subtitle}>
              Controle de acesso dos funcionários ao aplicativo.
            </p>
          </div>

          <Button style={{}} onClick={() => setModalOpen(true)}>
            + Gerar Acesso
          </Button>
        </div>

        {loading && <p style={styles.info}>Carregando...</p>}
        {error && <p style={styles.error}>{error}</p>}
        {feedback && <p style={styles.feedback}>{feedback}</p>}

        <Table
          columns={[
            {
              key: "nome",
              title: "Nome",
              render: (row: Funcionario) => row.nome || "-",
            },
            {
              key: "matricula",
              title: "Matrícula",
              render: (row: Funcionario) => row.matricula || "-",
            },
            {
              key: "status",
              title: "Status",
              render: (row: Funcionario) => {
                const ativo = row.ativo ?? row.status === "ativo";

                return (
                  <Badge
                    style={{}}
                    backgroundColor={ativo ? "#dcfce7" : "#fee2e2"}
                    color={ativo ? "#166534" : "#991b1b"}
                  >
                    {ativo ? "Ativo" : "Inativo"}
                  </Badge>
                );
              },
            },
            {
              key: "acoes",
              title: "Ações",
              render: (row: Funcionario) => (
                <div style={styles.actions}>
                  <Button
                    style={{}}
                    variant="soft"
                    onClick={() => handleResetPassword(row)}
                  >
                    Resetar senha
                  </Button>
                </div>
              ),
            },
          ]}
          data={funcionarios}
          emptyMessage="Nenhum dado encontrado"
          rowKey="id"
          getRowStyle={() => ({})}
        />

        {modalOpen && (
          <div style={styles.overlay}>
            <form style={styles.modal} onSubmit={handleCreateAccess}>
              <h3 style={styles.modalTitle}>Criar acesso</h3>
              <p style={styles.modalText}>
                As informações serão enviadas diretamente para o endpoint do app.
              </p>

              <input
                placeholder="Nome"
                style={styles.input}
                value={form.nome}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    nome: event.target.value,
                  }))
                }
              />

              <input
                placeholder="Matrícula"
                style={styles.input}
                value={form.matricula}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    matricula: event.target.value,
                  }))
                }
                required
              />

              <input
                placeholder="Email"
                type="email"
                style={styles.input}
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
              />

              <div style={styles.modalActions}>
                <Button
                  style={{}}
                  variant="secondary"
                  type="button"
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </Button>

                <Button style={{}} type="submit">
                  {saving ? "Salvando..." : "Criar acesso"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

const styles: { [key: string]: CSSProperties } = {
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
  feedback: {
    margin: 0,
    color: "#166534",
  },
  actions: {
    display: "flex",
    gap: "8px",
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
    padding: "24px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "380px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    boxShadow: theme.shadow,
    border: `1px solid ${theme.colors.border}`,
  },
  modalTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 700,
    color: theme.colors.textPrimary,
  },
  modalText: {
    margin: 0,
    color: theme.colors.textSecondary,
    fontSize: "14px",
  },
  input: {
    padding: "12px",
    borderRadius: "12px",
    border: `1px solid ${theme.colors.border}`,
    outline: "none",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "10px",
  },
};