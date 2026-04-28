import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import Badge from "../components/Badge";
import Button from "../components/Button";
import { theme } from "../styles/theme";
import { getErrorMessage } from "../services/api";
import { loginAdmin } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");

    try {
      const response = await loginAdmin({
        email: email.trim(),
        senha,
      });

      if (response?.admin) {
        localStorage.setItem("admin", JSON.stringify(response.admin));
      }

      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      setErro(getErrorMessage(err, "Não foi possível realizar o login."));
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.panel}>
        <div style={styles.hero}>
          <Badge backgroundColor="rgba(255,255,255,0.12)" color="#ffffff" style={styles.badge}>
            Tech Blue
          </Badge>
          <h1 style={styles.heroTitle}>Controle de ponto com visual SaaS e base pronta para escalar.</h1>
          <p style={styles.heroText}>
            Acesse o CRM para acompanhar presença, alertas e operação dos colaboradores em um só lugar.
          </p>
        </div>

        <div className="app-card" style={styles.card}>
          <div style={styles.logoWrap}>
            <img src={logo} alt="Tech Blue" style={styles.logo} />
          </div>

          <div>
            <h2 style={styles.title}>Entrar no CRM</h2>
            <p style={styles.subtitle}>Use suas credenciais para acessar o painel.</p>
          </div>

          {erro ? <p style={styles.error}>{erro}</p> : null}

          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />

            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={styles.input}
              required
            />

            <Button type="submit" style={styles.button}>
              Entrar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    background:
      "radial-gradient(circle at top left, rgba(224,242,254,0.95) 0%, rgba(248,250,252,1) 45%, rgba(241,245,249,1) 100%)",
  },
  panel: {
    width: "100%",
    maxWidth: "1040px",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.1fr) minmax(360px, 420px)",
    gap: "24px",
    alignItems: "stretch",
  },
  hero: {
    padding: "40px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: "520px",
  },
  badge: {
    width: "fit-content",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  heroTitle: {
    margin: "24px 0 0",
    fontSize: "42px",
    lineHeight: 1.1,
  },
  heroText: {
    margin: "18px 0 0",
    maxWidth: "460px",
    color: "#cbd5e1",
    fontSize: "16px",
    lineHeight: 1.7,
  },
  card: {
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "20px",
  },
  logoWrap: {
    display: "flex",
    justifyContent: "center",
  },
  logo: {
    width: "180px",
    objectFit: "contain",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    color: theme.colors.textPrimary,
  },
  subtitle: {
    margin: "8px 0 0",
    color: theme.colors.textSecondary,
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  input: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: "#f8fafc",
    outline: "none",
    fontSize: "14px",
  },
  button: {
    padding: "14px 16px",
  },
  error: {
    margin: 0,
    padding: "12px 14px",
    borderRadius: "12px",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    fontSize: "14px",
  },
};
