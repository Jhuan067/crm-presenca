import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState({
    funcionarios: 0,
    presentes: 0,
    atrasos: 0,
    fora_area: 0,
    alertas: [],
    registros: {
      total: 0,
      entradas: 0,
      saidas: 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await api.get("/crm/dashboard");
        setData(response.data);
      } catch (err) {
        console.log(err);
        setErro("Erro ao carregar dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  return (
    <MainLayout>
      <div style={styles.container}>

        {/* STATUS */}
        {loading && <p style={styles.info}>Carregando dados...</p>}
        {erro && <p style={styles.error}>{erro}</p>}

        {/* CARDS */}
        <div style={styles.cards}>
          <Card title="Funcionários" value={data.funcionarios} />
          <Card title="Presentes" value={data.presentes} />
          <Card title="Atrasos" value={data.atrasos} alert />
          <Card title="Fora da Área" value={data.fora_area} alert />
        </div>

        {/* PARTE DE BAIXO */}
        <div style={styles.bottom}>

          {/* ALERTAS */}
          <div style={styles.box}>
            <h3 style={styles.title}>Alertas</h3>

            {data.alertas.length === 0 ? (
              <p style={styles.empty}>Nenhum alerta</p>
            ) : (
              <ul style={styles.list}>
                {data.alertas.map((alerta, index) => (
                  <li key={index}>⚠️ {alerta}</li>
                ))}
              </ul>
            )}
          </div>

          {/* RESUMO */}
          <div style={styles.box}>
            <h3 style={styles.title}>Resumo</h3>

            <p>Total: {data.registros.total}</p>
            <p>Entradas: {data.registros.entradas}</p>
            <p>Saídas: {data.registros.saidas}</p>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}

/* CARD */
function Card({ title, value, alert }) {
  return (
    <div
      style={{
        ...styles.card,
        borderLeft: alert ? "4px solid #f87171" : "4px solid #60a5fa", // azul pastel
      }}
    >
      <p style={styles.cardTitle}>{title}</p>
      <h2 style={styles.cardValue}>{value}</h2>
    </div>
  );
}

/* ESTILO */
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  info: {
    color: "#64748b",
    fontSize: "14px",
  },

  error: {
    color: "#ef4444",
    fontSize: "14px",
  },

  empty: {
    color: "#94a3b8",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },

  card: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },

  cardTitle: {
    fontSize: "14px",
    color: "#64748b",
  },

  cardValue: {
    fontSize: "28px",
    fontWeight: "600",
    marginTop: "10px",
    color: "#0f172a",
  },

  bottom: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px",
  },

  box: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },

  title: {
    marginBottom: "15px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e293b",
  },

  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
};