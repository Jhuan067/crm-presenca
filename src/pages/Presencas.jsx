import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Table from "../components/Table";
import { theme } from "../styles/theme";
import { getErrorMessage } from "../services/api";
import { getPresencas } from "../services/presencaService";

export default function Presencas() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPresencas() {
      setLoading(true);
      setError("");

      try {
        const payload = await getPresencas();
        setDados(Array.isArray(payload) ? payload : []);
      } catch (err) {
        console.log(err);
        setDados([]);
        setError(getErrorMessage(err, "Não foi possível carregar os registros de presença."));
      } finally {
        setLoading(false);
      }
    }

    loadPresencas();
  }, []);

  return (
    <MainLayout>
      <div style={styles.container}>
        <div>
          <h1 style={styles.title}>Presença</h1>
          <p style={styles.subtitle}>
            Regras visuais mantidas: tolerância de 30 minutos na entrada, na saída e jornada padrão de 8 horas.
          </p>
        </div>

        {loading && <p style={styles.info}>Carregando...</p>}
        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.legend}>
          <span style={{ ...styles.legendItem, backgroundColor: "#e0f2fe", color: "#0369a1" }}>
            Azul: fora da tolerância
          </span>
          <span style={{ ...styles.legendItem, backgroundColor: "#fef9c3", color: "#854d0e" }}>
            Amarelo: hora extra
          </span>
          <span style={{ ...styles.legendItem, backgroundColor: "#fee2e2", color: "#b91c1c" }}>
            Vermelho: jornada incompleta
          </span>
        </div>

        <Table
          columns={[
            { key: "nome", title: "Nome" },
            { key: "matricula", title: "Matrícula" },
            { key: "entrada", title: "Entrada", render: (row) => row.entrada || "-" },
            { key: "saida", title: "Saída", render: (row) => row.saida || "-" },
            { key: "jornada", title: "Jornada", render: (row) => getStatus(row).jornada },
            { key: "turno", title: "Turno",render: (row) => {const turno = row.turno;const label =
              turno === "manha"
              ? "🌅 Manhã"
              : turno === "tarde"
              ? "🌇 Tarde"
              : turno === "noite"
              ? "🌙 Noite"
              : "-";
              return label;
  },
},
          ]}
          data={dados}
          emptyMessage="Nenhum dado encontrado"
          rowKey="matricula"
          getRowStyle={(row) => ({ backgroundColor: getStatus(row).cor })}
        />
      </div>
    </MainLayout>
  );
}

function getStatus(item) {
  if (!item.entrada || !item.saida) {
    return { cor: "#ffffff", jornada: "-" };
  }

  const entrada = toMin(item.entrada);
  const saida = toMin(item.saida);
  const jornadaMin = saida - entrada;
  const jornadaHoras = `${(jornadaMin / 60).toFixed(1)}h`;
  const entradaPadrao = 480;
  const saidaPadrao = entradaPadrao + 480;
  const tolerancia = 30;

  if (jornadaMin > 480) {
    return { cor: "#fef9c3", jornada: jornadaHoras };
  }

  if (jornadaMin < 480) {
    return { cor: "#fee2e2", jornada: jornadaHoras };
  }

  if (
    entrada > entradaPadrao + tolerancia ||
    entrada < entradaPadrao - tolerancia ||
    saida > saidaPadrao + tolerancia ||
    saida < saidaPadrao - tolerancia
  ) {
    return { cor: "#e0f2fe", jornada: jornadaHoras };
  }

  return { cor: "#ffffff", jornada: jornadaHoras };
}

function toMin(hora) {
  const [h, m] = String(hora).split(":").map(Number);
  return h * 60 + m;
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
  legend: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  legendItem: {
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 600,
  },
};
