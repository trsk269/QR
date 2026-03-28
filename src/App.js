import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";
import React, { useState, useRef, useCallback } from "react";
import "./App.css";

/* ── Icons (inline SVG so no extra dep) ── */
const IconQR = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M14 14h3v3m0 4h4v-4m-4 0h4" />
  </svg>
);

const IconDownload = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3v13m0 0-4-4m4 4 4-4" />
    <path d="M5 20h14" />
  </svg>
);

const IconCopy = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const EC_LEVELS = [
  { key: "L", pct: "~7%", desc: "Max data" },
  { key: "M", pct: "~15%", desc: "Balanced" },
  { key: "Q", pct: "~25%", desc: "Reliable" },
  { key: "H", pct: "~30%", desc: "Robust" },
];

function App() {
  const [url, setUrl] = useState("");
  const [fgColor, setFgColor] = useState("#1A1917");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [size, setSize] = useState(240);
  const [ecLevel, setEcLevel] = useState("H");
  const [toast, setToast] = useState(false);
  const canvasRef = useRef(null);

  const qrValue = url.trim() || "https://github.com/trsk269";

  /* slider fill calc */
  const sliderPct = Math.round(((size - 160) / (320 - 160)) * 100);

  const showToast = useCallback(() => {
    setToast(true);
    setTimeout(() => setToast(false), 2200);
  }, []);

  const handleDownload = async () => {
    const el = document.getElementById("qr-canvas-wrap");
    if (!el) return;
    const canvas = await html2canvas(el, {
      backgroundColor: bgColor,
      scale: 3,
    });
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleCopy = async () => {
    const el = document.getElementById("qr-canvas-wrap");
    if (!el) return;
    try {
      const canvas = await html2canvas(el, {
        backgroundColor: bgColor,
        scale: 3,
      });
      canvas.toBlob(async (blob) => {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        showToast();
      });
    } catch {
      showToast();
    }
  };

  return (
    <>
      <div className="page-wrapper">
        {/* Header */}
        <header className="site-header">
          <div className="logo-mark">
            <div className="logo-icon">
              <IconQR />
            </div>
            QRcraft
          </div>
          <span className="header-badge">Free · No signup</span>
        </header>

        {/* Hero */}
        <section className="hero">
          <h1 className="hero-title">
            Generate QR codes
            <br />
            <span>instantly.</span>
          </h1>
          <p className="hero-sub">
            Paste any URL, text, or data — your QR code is ready in seconds.
          </p>
        </section>

        {/* Main */}
        <main className="app-grid">
          {/* ── Left: Controls ── */}
          <div className="card input-panel">
            {/* URL input */}
            <div className="input-group">
              <p className="panel-label">Content</p>
              <textarea
                className="input-field"
                rows={3}
                placeholder="Paste a URL, email, phone number, or any text…"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                spellCheck={false}
              />
            </div>

            {/* Colors */}
            <div className="color-row">
              <p className="panel-label">Colors</p>
              <div className="color-pickers">
                <div className="color-pick-item">
                  <label htmlFor="fg-color">Foreground</label>
                  <input
                    id="fg-color"
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                  />
                </div>
                <div className="color-pick-item">
                  <label htmlFor="bg-color">Background</label>
                  <input
                    id="bg-color"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Size */}
            <div className="slider-row">
              <div className="slider-meta">
                <p className="panel-label" style={{ marginBottom: 0 }}>
                  Size
                </p>
                <span className="slider-val">{size}px</span>
              </div>
              <input
                type="range"
                min="160"
                max="320"
                step="8"
                value={size}
                style={{ "--pct": `${sliderPct}%` }}
                onChange={(e) => setSize(Number(e.target.value))}
              />
            </div>

            {/* Error Correction */}
            <div className="ec-section">
              <p className="panel-label">Error correction</p>
              <div className="ec-grid">
                {EC_LEVELS.map(({ key, pct, desc }) => (
                  <div key={key} className="ec-btn-wrap">
                    <button
                      className={`ec-btn${ecLevel === key ? " active" : ""}`}
                      onClick={() => setEcLevel(key)}
                    >
                      {key}
                    </button>
                    <span className="ec-info">{pct}</span>
                    <span className="ec-info">{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="action-row">
              <button className="btn btn-primary" onClick={handleDownload}>
                <IconDownload /> Download PNG
              </button>
              <button className="btn btn-secondary" onClick={handleCopy}>
                <IconCopy /> Copy to clipboard
              </button>
            </div>
          </div>

          {/* ── Right: Preview ── */}
          <div className="card preview-panel">
            <div className="preview-top">
              <p className="preview-label">Preview</p>
              <div className="qr-wrap" id="qr-canvas-wrap" ref={canvasRef}>
                <QRCodeCanvas
                  value={qrValue}
                  size={size}
                  bgColor={bgColor}
                  fgColor={fgColor}
                  level={ecLevel}
                  includeMargin={false}
                />
              </div>
            </div>

            <div className="preview-bottom">
              <div className="qr-meta">
                <div className="meta-chip">
                  <p className="meta-chip-label">Size</p>
                  <p className="meta-chip-val">
                    {size} × {size}px
                  </p>
                </div>
                <div className="meta-chip">
                  <p className="meta-chip-label">Error correction</p>
                  <p className="meta-chip-val">
                    {ecLevel === "L"
                      ? "Low"
                      : ecLevel === "M"
                        ? "Medium"
                        : ecLevel === "Q"
                          ? "Quartile"
                          : "High"}
                  </p>
                </div>
                <div className="meta-chip" style={{ gridColumn: "1 / -1" }}>
                  <p className="meta-chip-label">Content</p>
                  <p className="meta-chip-val">{qrValue}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <p>QRcraft — Quick Response Code Generator</p>
        <div className="footer-dot" />
        <p>Free & open source</p>
      </footer>

      {/* Toast */}
      <div className={`toast${toast ? " show" : ""}`}>
        Copied to clipboard ✓
      </div>
    </>
  );
}

export default App;
