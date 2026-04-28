import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Table from "../components/Table";
import Badge from "../components/Badge";
import { theme } from "../styles/theme";
import { getErrorMessage } from "../services/api";
import { getAlertas } from "../services/alertasService";

export default function Alertas() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAlertas() {
      setLoading(true);
      setError("");

      try {
        const payload = await getAlertas();
        setAlertas(Array.isArray(payload) ? payload : []);
      } catch (err) {
        console.log(err);
        setAlertas([]);
        setError(getErrorMessage(err, "Não foi possível carregar os alertas."));
      } finally {
        setLoading(false);
      }
    }

    loadAlertas();
  }, []);

  return (
    <MainLayout>
      <div style={styles.container}>
        <div>
          <h1 style={styles.title}>Alertas</h1>
          <p style={styles.subtitle}>Ocorrências reais retornadas pelo serviço.</p>
        </div>

        {loading && <p style={styles.info}>Carregando...</p>}
        {error && <p style={styles.error}>{error}</p>}

        <Table
          columns={[
            { key: "nome", title: "Nome", render: (row) => row.nome || "-" },
            { key: "matricula", title: "Matrícula", render: (row) => row.matricula || "-" },
            {
              key: "tipo",
              title: "Tipo",
              render: (row) => {
                const colors = getCorAlerta(row.tipo);
                return (
                  <Badge backgroundColor={colors.background} color={colors.color}>
                    {formatTipo(row.tipo)}
                  </Badge>
                );
              },
            },
          ]}
          data={alertas}
          emptyMessage="Nenhum dado encontrado"
          rowKey="id"
        />
      </div>
    </MainLayout>
  );
}

function getCorAlerta(tipo) {
  if (tipo === "ausencia") return { background: "#dbeafe", color: "#2563eb" };
  if (tipo === "fora_area") return { background: "#fef3c7", color: "#b45309" };
  return { background: "#e2e8f0", color: "#475569" };
}

function formatTipo(tipo) {
  if (!tipo) return "Não informado";
  return String(tipo).replaceAll("_", " ");
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
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
};
