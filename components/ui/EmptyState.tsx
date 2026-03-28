interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
}
export default function EmptyState({
  icon = "📭",
  title,
  description,
}: EmptyStateProps) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "64px 24px",
        color: "var(--color-text-muted)",
      }}
    >
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>{icon}</div>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "18px",
          fontWeight: 700,
          color: "var(--color-text)",
          marginBottom: "8px",
        }}
      >
        {title}
      </h3>
      {description && (
        <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>
          {description}
        </p>
      )}
    </div>
  );
}
