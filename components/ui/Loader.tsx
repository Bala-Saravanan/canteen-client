export default function Loader({
  fullscreen = false,
}: {
  fullscreen?: boolean;
}) {
  if (fullscreen) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--color-ink)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            className="spinner"
            style={{
              margin: "0 auto 16px",
              width: "32px",
              height: "32px",
              borderWidth: "3px",
            }}
          />
          <p
            style={{
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-display)",
              fontSize: "14px",
            }}
          >
            Loading…
          </p>
        </div>
      </div>
    );
  }
  return <div className="spinner" />;
}
