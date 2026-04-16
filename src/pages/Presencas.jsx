import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

export default function Presencas() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function fetchPresenca() {
      try {
        const response = await api.get("/crm/presenca");
        setDados(response.data);
      } catch (err) {
        console.log(err);
        setErro("Erro ao carregar presença");
      } finally {
        setLoading(false);
      }
    }

    fetchPresenca();
  }, []);

  return (
    <MainLayout>
      <div style={styles.container}>
        <h1 style={styles.title}>Controle de Presença</h1>

        {loading && <p style={styles.info}>Carregando...</p>}
        {erro && <p style={styles.error}>{erro}</p>}

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nome</th>
                <th style={styles.th}>Matrícula</th>
                <th style={styles.th}>Entrada</th>
                <th style={styles.th}>Saída</th>
                <th style={styles.th}>Jornada</th>
              </tr>
            </thead>

            <tbody>
              {dados.length === 0 ? (
                <tr>
                  <td colSpan={5} style={styles.empty}>
                    Nenhum registro encontrado
                  </td>
                </tr>
              ) : (
                dados.map((item, index) => {
                  const status = getStatus(item);

                  return (
                    <tr
                      key={index}
                      style={{
                        ...styles.tr,
                        backgroundColor: status.cor,
                      }}
                    >
                      <td style={styles.td}>{item.nome}</td>
                      <td style={styles.td}>{item.matricula}</td>
                      <td style={styles.td}>{item.entrada}</td>
                      <td style={styles.td}>{item.saida}</td>
                      <td style={styles.td}>{status.jornada}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}

/* 🔥 REGRA DE NEGÓCIO */
function getStatus(item) {
  if (!item.entrada || !item.saida) {
    return { cor: "#ffffff", jornada: "-" };
  }

  const entrada = toMin(item.entrada);
  const saida = toMin(item.saida);

  const jornadaMin = saida - entrada;
  const jornadaHoras = (jornadaMin / 60).toFixed(1) + "h";

  // horário esperado (exemplo: 08:00 → 480 min)
  const entradaPadrao = 480;
  const tolerancia = 30;

  const atraso = entrada > entradaPadrao + tolerancia;
  const adiantado = entrada < entradaPadrao - tolerancia;

  // regra de jornada (8h = 480 min)
  if (jornadaMin > 480) {
    return { cor: "#fef9c3", jornada: jornadaHoras }; // amarelo (hora extra)
  }

  if (jornadaMin < 480) {
    return { cor: "#fee2e2", jornada: jornadaHoras }; // vermelho suave (faltou hora)
  }

  // fora da tolerância de entrada
  if (atraso || adiantado) {
    return { cor: "#e0f2fe", jornada: jornadaHoras }; // azul claro
  }

  return { cor: "#ffffff", jornada: jornadaHoras };
}

/* ⏱️ converte HH:mm → minutos */
function toMin(hora) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

/* 🎨 ESTILO */
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  title: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#0f172a",
  },

  info: {
    color: "#64748b",
  },

  error: {
    color: "#ef4444",
  },

  tableContainer: {
    backgroundColor: "#ffffff",
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
    fontSize: "14px",
    color: "#334155",
  },

  td: {
    padding: "14px",
    borderTop: "1px solid #e2e8f0",
    fontSize: "14px",
    color: "#0f172a",
  },

  tr: {
    transition: "0.2s",
  },

  empty: {
    textAlign: "center",
    padding: "20px",
    color: "#94a3b8",
  },
};