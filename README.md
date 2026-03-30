QRcraft
A minimal, free QR code generator built with React. No signup, no tracking, no fluff.

Features

Generate QR codes from any URL, text, phone number, or email
Customize foreground and background colors
Adjust output size (160px – 320px)
Choose error correction level (L / M / Q / H)
Download as high-res PNG (3× scale)
Copy directly to clipboard

Tech Stack

React — UI framework
qrcode.react — QR code rendering
html2canvas — PNG export
Playfair Display + Outfit — Typography (Google Fonts)

Getting Started
bash# Install dependencies
npm install

# Start dev server
npm run dev
Error Correction Levels
LevelRecoveryBest ForL~7%Clean environments, max data densityM~15%General useQ~25%Slightly damaged or printed codesH~30%Logos embedded, harsh conditions
Project Structure
src/
├── App.jsx          # Main app + QR logic
├── App.css          # All styles & design tokens
└── components/
    └── Footer.jsx   # Footer component
