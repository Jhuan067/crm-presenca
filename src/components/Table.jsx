import { theme } from "../styles/theme";

export default function Table({
  columns,
  data,
  emptyMessage = "Nenhum registro encontrado",
  rowKey = "id",
  getRowStyle,
}) {
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div className="app-card app-table-wrapper">
      <table className="app-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} style={column.headerStyle}>
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!hasData ? (
            <tr>
              <td colSpan={columns.length} style={styles.emptyCell}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={row[rowKey] ?? `${index}-${row.nome ?? "row"}`}
                style={getRowStyle ? getRowStyle(row, index) : undefined}
              >
                {columns.map((column) => (
                  <td key={column.key} style={column.cellStyle}>
                    {column.render ? column.render(row, index) : row[column.key] ?? "-"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  emptyCell: {
    padding: 32,
    textAlign: "center",
    color: theme.colors.textSecondary,
  },
};
