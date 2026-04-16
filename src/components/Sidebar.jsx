import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  function logout() {
    localStorage.removeItem("admin");
    navigate("/");
  }

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <div style={styles.sidebar}>
      <div style={styles.brand}>
        <div style={styles.logoCircle}>TB</div>
        <span style={styles.brandText}>Tech Blue</span>
      </div>

      <input placeholder="Procurar..." style={styles.search} />

      <button
        style={{ ...styles.item, ...(isActive("/dashboard") && styles.active) }}
        onClick={() => navigate("/dashboard")}
      >
        Dashboard
      </button>

      <button
        style={{ ...styles.item, ...(isActive("/funcionarios") && styles.active) }}
        onClick={() => navigate("/funcionarios")}
      >
        Funcionarios
      </button>

      <button
        style={{ ...styles.item, ...(isActive("/presenca") && styles.active) }}
        onClick={() => navigate("/presenca")}
      >
        Presenca
      </button>

      <button
        style={{ ...styles.item, ...(isActive("/alertas") && styles.active) }}
        onClick={() => navigate("/alertas")}
      >
        Alertas
      </button>

      <button
        style={{ ...styles.item, ...(isActive("/app") && styles.active) }}
        onClick={() => navigate("/app")}
      >
        App
      </button>

      <button style={styles.logout} onClick={logout}>
        Sair
      </button>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "260px",
    backgroundColor: "#e0ecff",
    color: "#1e293b",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    gap: "10px",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },

  logoCircle: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#2563eb",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  brandText: {
    fontSize: "18px",
    fontWeight: "600",
  },

  search: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    marginBottom: "10px",
    backgroundColor: "#f8fafc",
    fontSize: "14px",
  },

  item: {
    background: "transparent",
    border: "none",
    color: "#334155",
    textAlign: "left",
    padding: "12px",
    cursor: "pointer",
    borderRadius: "8px",
    fontSize: "14px",
    transition: "0.2s",
  },

  active: {
    backgroundColor: "#2563eb",
    color: "#fff",
  },

  logout: {
    marginTop: "auto",
    backgroundColor: "#2563eb",
    border: "none",
    color: "#fff",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
