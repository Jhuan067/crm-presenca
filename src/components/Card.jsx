import { theme } from "../styles/theme";

export default function Card({
  title,
  value,
  accent = theme.colors.primary,
  subtitle,
}) {
  return (
    <div className="app-card" style={{ ...styles.card, borderLeft: `4px solid ${accent}` }}>
      <span style={styles.title}>{title}</span>
      <strong style={styles.value}>{value}</strong>
      {subtitle ? <span style={styles.subtitle}>{subtitle}</span> : null}
    </div>
  );
}

const styles = {
  card: {
    minHeight: 132,
    padding: theme.padding,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: 600,
  },
  value: {
    fontSize: 34,
    lineHeight: 1,
    color: theme.colors.textPrimary,
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
};
