// Phone preview: shows the app at iPhone width (375 px) so it can be checked on a big screen.
const screens = [
  ["today", "Today"], ["jobs", "Jobs"], ["inbox", "Messages"], ["yard", "Yard"],
  ["store", "Store"], ["crew", "Crew app"], ["quickbooks", "QuickBooks"], ["companies", "Other tree services"],
  ["numbers", "Weekly numbers"], ["line", "Line of sight"], ["files", "Files"],
];

export default function Frame() {
  return (
    <main style={{ padding: 16, display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center", background: "#d9d5c9", minHeight: "100vh" }}>
      {screens.map(([id, name]) => (
        <figure key={id} style={{ margin: 0 }}>
          <figcaption style={{ font: "600 13px system-ui", marginBottom: 6, color: "#333" }}>{name} · 375 px</figcaption>
          <iframe title={name} src={`/#${id}`} width={375} height={760} style={{ border: "1px solid #999", borderRadius: 24, background: "#fff" }} />
        </figure>
      ))}
    </main>
  );
}
