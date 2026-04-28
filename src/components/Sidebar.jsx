import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppWindow,
  Bell,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Search,
  Users,
} from "lucide-react";
import logo from "../assets/logo.jpg";
import { theme } from "../styles/theme";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const admin = JSON.parse(localStorage.getItem("admin") || "null");

  const items = useMemo(
    () => [
      { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { label: "Funcionários", path: "/funcionarios", icon: Users },
      { label: "Presença", path: "/presenca", icon: MapPinned },
      { label: "Alertas", path: "/alertas", icon: Bell },
      { label: "App", path: "/app", icon: AppWindow },
    ],
    []
  );

  const visibleItems = items.filter((item) =>
    item.label.toLowerCase().includes(query.trim().toLowerCase())
  );

  function logout() {
    localStorage.removeItem("admin");
    navigate("/");
  }

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <aside style={styles.sidebar}>
      <div style={styles.topBlock}>
        <div style={styles.brand}>
          <img src={logo} alt="Tech Blue" style={styles.logoImage} />
          <div>
            <span style={styles.brandText}>Tech Blue</span>
            <p style={styles.brandSubtext}>Gestão de presença</p>
          </div>
        </div>

        <div style={styles.searchWrap}>
          <Search size={16} color="#94a3b8" />
          <input
            placeholder="Buscar seção"
            style={styles.search}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <nav style={styles.nav}>
        {visibleItems.length === 0 ? (
          <div style={styles.emptyState}>Nenhuma seção encontrada</div>
        ) : (
          visibleItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                style={{ ...styles.item, ...(isActive(item.path) ? styles.active : null) }}
                onClick={() => navigate(item.path)}
              >
                <span style={styles.itemIcon}>
                  <Icon size={18} />
                </span>
                {item.label}
              </button>
            );
          })
        )}
      </nav>

      <div style={styles.footer}>
        <div style={styles.userCard}>
          <div style={styles.avatar}>
            {(admin?.nome || "A").charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={styles.userLabel}>Usuário logado</div>
            <div style={styles.userName}>{admin?.nome || "Administrador"}</div>
          </div>
        </div>

        <button style={styles.logout} onClick={logout}>
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "260px",
    backgroundColor: theme.colors.sidebar,
    color: "#e2e8f0",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    gap: "18px",
    borderRight: "1px solid rgba(148,163,184,0.16)",
  },
  topBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoImage: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    objectFit: "cover",
  },
  brandText: {
    display: "block",
    fontSize: "18px",
    fontWeight: "700",
    color: "#ffffff",
  },
  brandSubtext: {
    margin: "2px 0 0",
    fontSize: "12px",
    color: "#94a3b8",
  },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(148,163,184,0.18)",
    borderRadius: "12px",
    padding: "10px 12px",
  },
  search: {
    flex: 1,
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    fontSize: "14px",
    color: "#e2e8f0",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "transparent",
    border: "none",
    color: "#cbd5e1",
    textAlign: "left",
    padding: "12px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s ease, color 0.2s ease",
  },
  itemIcon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  active: {
    backgroundColor: theme.colors.primarySoft,
    color: theme.colors.primary,
  },
  emptyState: {
    padding: "12px",
    borderRadius: "12px",
    backgroundColor: "rgba(255,255,255,0.04)",
    color: "#94a3b8",
    fontSize: "13px",
  },
  footer: {
    marginTop: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  userCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px",
    borderRadius: "12px",
    backgroundColor: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(148,163,184,0.18)",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: theme.colors.primary,
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
  },
  userLabel: {
    fontSize: "11px",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  userName: {
    fontSize: "14px",
    color: "#ffffff",
    fontWeight: "600",
  },
  logout: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    backgroundColor: theme.colors.primary,
    border: "none",
    color: "#fff",
    padding: "12px",
    borderRadius: "12px",
    fontWeight: "600",
  },
};
