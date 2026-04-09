#!/bin/bash
echo ""
echo "  ██████╗  ██████╗  ██████╗ ███╗   ███╗    ███╗   ██╗███████╗██╗    ██╗███████╗"
echo "  ██╔══██╗██╔═══██╗██╔═══██╗████╗ ████║    ████╗  ██║██╔════╝██║    ██║██╔════╝"
echo "  ██║  ██║██║   ██║██║   ██║██╔████╔██║    ██╔██╗ ██║█████╗  ██║ █╗ ██║███████╗"
echo "  ██║  ██║██║   ██║██║   ██║██║╚██╔╝██║    ██║╚██╗██║██╔══╝  ██║███╗██║╚════██║"
echo "  ██████╔╝╚██████╔╝╚██████╔╝██║ ╚═╝ ██║    ██║ ╚████║███████╗╚███╔███╔╝███████║"
echo "  ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝     ╚═╝    ╚═╝  ╚═══╝╚══════╝ ╚══╝╚══╝ ╚══════╝"
echo ""
echo "  GLOBAL THREAT INTELLIGENCE — BUILD TOOL"
echo ""

# Check node
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js not found. Install from https://nodejs.org"
    exit 1
fi
echo "[OK] Node.js $(node --version)"

# Install
echo ""
echo "[1/3] Installing dependencies..."
npm install || { echo "[ERROR] npm install failed"; exit 1; }

# Detect OS and build
echo "[2/3] Building..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    npm run build:mac
    echo ""
    echo "Output: dist/DOOM-*.dmg"
else
    npm run build:linux
    echo ""
    echo "Output: dist/DOOM-*.AppImage"
fi

echo ""
echo "[3/3] Done! Check the 'dist' folder."
