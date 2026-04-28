import { Bell } from "lucide-react";
import { theme } from "../styles/theme";

export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.spacer} />
      <h1 style={styles.title}>Controle de Ponto</h1>
      <div style={styles.right}>
        <button type="button" style={styles.notification} aria-label="Notificações">
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: "70px",
    backgroundColor: "#ffffff",
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    padding: "0 24px",
    borderBottom: `1px solid ${theme.colors.border}`,
  },
  spacer: {
    minWidth: 0,
  },
  title: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "700",
    color: theme.colors.textPrimary,
    justifySelf: "center",
  },
  right: {
    display: "flex",
    alignItems: "center",
    justifySelf: "end",
  },
  notification: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: "#ffffff",
    color: theme.colors.textPrimary,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
