import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { theme } from "../styles/theme";

export default function MainLayout({ children }) {
  return (
    <div style={styles.shell}>
      <Sidebar />

      <div style={styles.contentArea}>
        <Header />
        <main style={styles.main}>{children}</main>
      </div>
    </div>
  );
}

const styles = {
  shell: {
    minHeight: "100vh",
    display: "flex",
    backgroundColor: theme.colors.background,
  },
  contentArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  main: {
    flex: 1,
    padding: "24px",
    minWidth: 0,
  },
};
