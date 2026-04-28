import { theme } from "../styles/theme";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  style,
  ...props
}) {
  return (
    <button
      type={type}
      style={{
        ...styles.base,
        ...(variantStyles[variant] || variantStyles.primary),
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

const styles = {
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    border: "none",
    padding: "12px 16px",
    borderRadius: "12px",
    fontWeight: 600,
    transition: "filter 0.2s ease, background-color 0.2s ease, color 0.2s ease",
  },
};

const variantStyles = {
  primary: {
    backgroundColor: theme.colors.primary,
    color: "#fff",
  },
  secondary: {
    backgroundColor: "#e2e8f0",
    color: theme.colors.textPrimary,
  },
  soft: {
    backgroundColor: theme.colors.primarySoft,
    color: theme.colors.primary,
    border: `1px solid ${theme.colors.border}`,
  },
};
