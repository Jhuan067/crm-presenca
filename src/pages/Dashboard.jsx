import { useEffect, useState } from "react";
import { AlertTriangle, CalendarDays } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import Card from "../components/Card";
import { theme } from "../styles/theme";
import { getErrorMessage } from "../services/api";
import { getDashboard } from "../services/dashboardService";

const PERIOD_OPTIONS = [
  { label: "Hoje", value: "today" },
  { label: "7 dias", value: "7d" },
  { label: "30 dias", value: "30d" },
  { label: "Ano", value: "year" },
];

export default function Dashboard() {
  const today = new Date().toISOString().slice(0, 10);
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [selectedDate, setSelectedDate] = useState(today);
  const [data, setData] = useState(normalizeDashboard({}));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        const payload = await getDashboard({
          periodo: selectedPeriod,
          data: selectedDate,
        });
        setData(normalizeDashboard(payload));
      } catch (err) {
        console.log(err);
        setData(normalizeDashboard({}));
        setError(getErrorMessage(err, "Não foi possível carregar os dados do dashboard."));
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [selectedPeriod, selectedDate]);

  const metrics = [
    {
      title: "Funcionários",
      value: data.funcionarios,
      accent: theme.colors.primary,
      subtitle: "Total monitorado",
    },
    {
      title: "Presentes",
      value: data.presentes,
      accent: "#22c55e",
      subtitle: "Entradas válidas no período",
    },
    {
      title: "Atrasos",
      value: data.atrasos,
      accent: "#f59e0b",
      subtitle: "Fora da tolerância",
    },
    {
      title: "Fora da Área",
      value: data.fora_area,
      accent: "#38bdf8",
      subtitle: "Ocorrências geográficas",
    },
  ];

  return (
    <MainLayout>
      <div style={styles.container}>
        <div style={styles.topBar}>
          <div>
            <h2 style={styles.pageTitle}>Dashboard</h2>
            <p style={styles.pageDescription}>
              Visão geral operacional com foco em presença, alertas e volume de registros.
            </p>
          </div>

          <div style={styles.filters}>
            {PERIOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                style={{
                  ...styles.filterButton,
                  ...(selectedPeriod === option.value ? styles.filterButtonActive : null),
                }}
                onClick={() => setSelectedPeriod(option.value)}
              >
                {option.label}
              </button>
            ))}

            <label style={styles.datePicker}>
              <CalendarDays size={16} color={theme.colors.textSecondary} />
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                style={styles.dateInput}
              />
            </label>
          </div>
        </div>

        {loading && <p style={styles.info}>Carregando...</p>}
        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.cards}>
          {metrics.map((metric) => (
            <Card
              key={metric.title}
              title={metric.title}
              value={metric.value}
              accent={metric.accent}
              subtitle={metric.subtitle}
            />
          ))}
        </div>

        <div className="responsive-grid" style={styles.middle}>
          <div className="app-card" style={styles.chartCard}>
            <div style={styles.sectionHeader}>
              <div>
                <h3 style={styles.sectionTitle}>Presença por período</h3>
                <p style={styles.sectionSubtitle}>
                  Área reservada para a integração do gráfico com a série temporal do backend.
                </p>
              </div>
            </div>

            <div style={styles.chartPlaceholder}>
              <div style={styles.chartEmptyTitle}>Gráfico disponível em breve</div>
              <div style={styles.chartEmptyText}>
                O layout já está preparado para receber os dados reais da API, sem usar valores fictícios no frontend.
              </div>
            </div>
          </div>

          <div className="app-card" style={styles.alertCard}>
            <h3 style={styles.sectionTitle}>Alertas</h3>
            <p style={styles.sectionSubtitle}>Lista retornada pelo backend para o período selecionado.</p>

            {data.alertas.length === 0 ? (
              <div style={styles.emptyBox}>Nenhum dado encontrado</div>
            ) : (
              <div style={styles.alertList}>
                {data.alertas.map((alerta, index) => (
                  <div key={`${index}-${getAlertText(alerta)}`} style={styles.alertItem}>
                    <div style={styles.alertIconWrap}>
                      <AlertTriangle size={16} color={theme.colors.primary} />
                    </div>
                    <div>
                      <div style={styles.alertText}>{getAlertText(alerta)}</div>
                      <div style={styles.alertMeta}>{getAlertMeta(alerta)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="app-card" style={styles.summaryCard}>
          <div style={styles.sectionHeader}>
            <div>
              <h3 style={styles.sectionTitle}>Resumo</h3>
              <p style={styles.sectionSubtitle}>Consolidação dos registros retornados pela API.</p>
            </div>
          </div>

          <div style={styles.summaryGrid}>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Total</span>
              <strong style={styles.summaryValue}>{data.registros.total}</strong>
            </div>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Entradas</span>
              <strong style={styles.summaryValue}>{data.registros.entradas}</strong>
            </div>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Saídas</span>
              <strong style={styles.summaryValue}>{data.registros.saidas}</strong>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function normalizeDashboard(payload) {
  return {
    funcionarios: Number(payload?.funcionarios ?? 0),
    presentes: Number(payload?.presentes ?? 0),
    atrasos: Number(payload?.atrasos ?? 0),
    fora_area: Number(payload?.fora_area ?? 0),
    alertas: Array.isArray(payload?.alertas) ? payload.alertas : [],
    registros: {
      total: Number(payload?.registros?.total ?? 0),
      entradas: Number(payload?.registros?.entradas ?? 0),
      saidas: Number(payload?.registros?.saidas ?? 0),
    },
  };
}

function getAlertText(alerta) {
  if (typeof alerta === "string") return alerta;
  if (alerta?.mensagem) return alerta.mensagem;
  if (alerta?.tipo && alerta?.nome) return `${alerta.nome} - ${alerta.tipo}`;
  return "Alerta disponível";
}

function getAlertMeta(alerta) {
  if (typeof alerta === "string") return "Origem: dashboard";
  if (alerta?.matricula) return `Matrícula ${alerta.matricula}`;
  if (alerta?.tipo) return `Tipo: ${String(alerta.tipo).replaceAll("_", " ")}`;
  return "Sem detalhes adicionais";
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    flexWrap: "wrap",
  },
  pageTitle: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 700,
    color: theme.colors.textPrimary,
  },
  pageDescription: {
    margin: "8px 0 0",
    color: theme.colors.textSecondary,
    fontSize: "14px",
  },
  filters: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  filterButton: {
    padding: "10px 14px",
    borderRadius: "12px",
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: "#ffffff",
    color: theme.colors.textSecondary,
    fontWeight: 600,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    color: "#ffffff",
    borderColor: theme.colors.primary,
  },
  datePicker: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 12px",
    borderRadius: "12px",
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: "#ffffff",
  },
  dateInput: {
    border: "none",
    outline: "none",
    color: theme.colors.textPrimary,
    backgroundColor: "transparent",
  },
  info: {
    margin: 0,
    color: theme.colors.textSecondary,
    fontSize: "14px",
  },
  error: {
    margin: 0,
    color: theme.colors.danger,
    fontSize: "14px",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },
  middle: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.6fr) minmax(320px, 0.9fr)",
    gap: "20px",
  },
  chartCard: {
    padding: theme.padding,
    minHeight: 320,
  },
  alertCard: {
    padding: theme.padding,
    minHeight: 320,
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  summaryCard: {
    padding: theme.padding,
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "20px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
    color: theme.colors.textPrimary,
  },
  sectionSubtitle: {
    margin: "6px 0 0",
    color: theme.colors.textSecondary,
    fontSize: "13px",
    lineHeight: 1.5,
  },
  chartPlaceholder: {
    minHeight: 220,
    borderRadius: "12px",
    background:
      "linear-gradient(180deg, rgba(224,242,254,0.5) 0%, rgba(248,250,252,1) 100%)",
    border: `1px dashed ${theme.colors.border}`,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "10px",
  },
  chartEmptyTitle: {
    fontSize: "16px",
    fontWeight: 700,
    color: theme.colors.textPrimary,
  },
  chartEmptyText: {
    fontSize: "14px",
    color: theme.colors.textSecondary,
    maxWidth: "480px",
    lineHeight: 1.6,
  },
  alertList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  alertItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "14px",
    borderRadius: "12px",
    backgroundColor: "#f8fafc",
    border: `1px solid ${theme.colors.border}`,
  },
  alertIconWrap: {
    width: "32px",
    height: "32px",
    borderRadius: "10px",
    backgroundColor: theme.colors.primarySoft,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  alertText: {
    fontSize: "14px",
    fontWeight: 600,
    color: theme.colors.textPrimary,
  },
  alertMeta: {
    marginTop: "4px",
    fontSize: "12px",
    color: theme.colors.textSecondary,
  },
  emptyBox: {
    padding: "18px",
    borderRadius: "12px",
    backgroundColor: "#f8fafc",
    border: `1px dashed ${theme.colors.border}`,
    color: theme.colors.textSecondary,
    fontSize: "14px",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
  },
  summaryItem: {
    padding: "18px",
    borderRadius: "12px",
    backgroundColor: "#f8fafc",
    border: `1px solid ${theme.colors.border}`,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  summaryLabel: {
    fontSize: "13px",
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    fontSize: "28px",
    color: theme.colors.textPrimary,
    fontWeight: 700,
  },
};
