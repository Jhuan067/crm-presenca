export default function Badge({ children, color, backgroundColor, style }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 600,
        color,
        backgroundColor,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
