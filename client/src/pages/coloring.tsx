import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import "./coloring.css";

const COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A",
  "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2",
  "#F8B739", "#52B788", "#E63946", "#457B9D",
  "#F4A261", "#2A9D8F", "#E76F51", "#264653",
  "#000000", "#FFFFFF", "#8B4513", "#FFB6C1"
];

interface Character {
  name: string;
  imagePath: string;
}

const CHARACTERS: Character[] = [
  { name: "King", imagePath: "/characters/992_1765215703888.png" },
  { name: "Construction", imagePath: "/characters/993_1765215703889.png" },
  { name: "Red Hair", imagePath: "/characters/994_1765215703890.png" },
  { name: "Basketball", imagePath: "/characters/990_1765215703891.png" },
  { name: "Baseball", imagePath: "/characters/991_1765215703892.png" },
  { name: "Crown Green", imagePath: "/characters/913_1765215715464.png" },
  { name: "Safari", imagePath: "/characters/914_1765215715466.png" },
  { name: "Red Hat", imagePath: "/characters/915_1765215715467.png" },
  { name: "LA Cap", imagePath: "/characters/916_1765215715468.png" },
  { name: "Tongue Out", imagePath: "/characters/97_1765215715469.png" },
  { name: "Sticky", imagePath: "/characters/880_1765215754474.png" },
  { name: "Gator Hat", imagePath: "/characters/881_1765215754476.png" },
  { name: "LA cap 2", imagePath: "/characters/882_1765215754478.png" },
  { name: "Green Shirt", imagePath: "/characters/878_1765215754479.png" },
  { name: "Blonde Hair", imagePath: "/characters/879_1765215754481.png" },
  { name: "Navy Captain", imagePath: "/characters/896_1765215764566.png" },
  { name: "VR Goggles", imagePath: "/characters/899_1765215771574.png" },
  { name: "Spiky Hair", imagePath: "/characters/817_1765215786885.png" },
  { name: "Lightning Power", imagePath: "/characters/845_1765215794486.png" },
  { name: "Scream Mask", imagePath: "/characters/728_1765215801848.png" }
];

export default function ColoringPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTool, setCurrentTool] = useState("fill");
  const [currentColor, setCurrentColor] = useState("#FF6B6B");
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [brushSize, setBrushSize] = useState(20);
  const [activeCharacterIndex, setActiveCharacterIndex] = useState(0);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    
    ctxRef.current = ctx;
    loadCharacter(0);
  }, []);

  const saveHistory = () => {
    if (!ctxRef.current || !canvasRef.current) return;
    
    const newHistoryStep = historyStep + 1;
    let newHistory = history.slice(0, newHistoryStep);
    const imageData = ctxRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    newHistory.push(imageData);
    
    setHistory(newHistory);
    setHistoryStep(newHistoryStep);
  };

  const loadCharacter = (index: number) => {
    if (!ctxRef.current || !canvasRef.current) return;
    
    setActiveCharacterIndex(index);
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const character = CHARACTERS[index];
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      saveHistory();
    };
    img.src = character.imagePath;
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const floodFill = (startX: number, startY: number, fillColor: string) => {
    if (!ctxRef.current || !canvasRef.current) return;
    
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const startPos = (startY * canvas.width + startX) * 4;
    const startR = pixels[startPos];
    const startG = pixels[startPos + 1];
    const startB = pixels[startPos + 2];

    const fillRGB = hexToRgb(fillColor);
    if (!fillRGB) return;
    
    if (startR === fillRGB.r && startG === fillRGB.g && startB === fillRGB.b) return;

    const stack: [number, number][] = [[startX, startY]];
    const visited = new Set<string>();

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const key = `${x},${y}`;
      
      if (visited.has(key)) continue;
      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
      
      visited.add(key);
      const pos = (y * canvas.width + x) * 4;
      
      if (pixels[pos] !== startR || pixels[pos + 1] !== startG || pixels[pos + 2] !== startB) continue;
      
      pixels[pos] = fillRGB.r;
      pixels[pos + 1] = fillRGB.g;
      pixels[pos + 2] = fillRGB.b;
      pixels[pos + 3] = 255;

      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const draw = (x: number, y: number) => {
    if (!ctxRef.current) return;
    
    const ctx = ctxRef.current;
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    
    if (currentTool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    } else {
      ctx.fillStyle = currentColor;
      ctx.fill();
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));

    if (currentTool === "fill") {
      floodFill(x, y, currentColor);
      saveHistory();
    } else {
      setIsDrawing(true);
      draw(x, y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));
    draw(x, y);
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveHistory();
    }
  };

  const handleUndo = () => {
    if (historyStep > 0 && ctxRef.current) {
      const newStep = historyStep - 1;
      setHistoryStep(newStep);
      ctxRef.current.putImageData(history[newStep], 0, 0);
    }
  };

  const handleClear = () => {
    if (confirm("Clear all colors? This cannot be undone!")) {
      loadCharacter(activeCharacterIndex);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement("a");
    link.download = "dashkids-coloring.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL();
    const windowContent = `<!DOCTYPE html><html><head><title>Print</title></head><body><img src="${dataUrl}" style="max-width:100%; height:auto;" onload="window.print();window.close()"></body></html>`;
    const printWin = window.open("", "", "width=800,height=600");
    if (printWin) {
      printWin.document.open();
      printWin.document.write(windowContent);
      printWin.document.close();
    }
  };

  return (
    <div className="coloring-container">
      <div className="coloring-header">
        <Link href="/">
          <button className="back-button" data-testid="button-back-home">
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </Link>
        <h1>🎨 DashKids Coloring Studio 🎨</h1>
        <p className="coloring-subtitle">Choose a character and bring them to life with colors!</p>
      </div>

      <div className="coloring-main-content">
        <div className="coloring-sidebar">
          <div className="coloring-section">
            <h2>📚 Choose Character</h2>
            <div className="character-grid" data-testid="grid-characters">
              {CHARACTERS.map((char, i) => (
                <div
                  key={i}
                  className={`character-thumb ${i === activeCharacterIndex ? "active" : ""}`}
                  onClick={() => loadCharacter(i)}
                  data-testid={`button-character-${i}`}
                >
                  <div className="character-name">{char.name}</div>
                </div>
              ))}
            </div>
            <select 
              className="character-select mobile-only"
              value={activeCharacterIndex}
              onChange={(e) => loadCharacter(parseInt(e.target.value))}
              data-testid="select-character-mobile"
            >
              {CHARACTERS.map((char, i) => (
                <option key={i} value={i}>{char.name}</option>
              ))}
            </select>
          </div>

          <div className="coloring-section">
            <h2>🎨 Color Palette</h2>
            <div className="color-palette" data-testid="grid-colors">
              {COLORS.map((color, i) => (
                <div
                  key={color}
                  className={`color-btn ${color === currentColor ? "active" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setCurrentColor(color)}
                  data-testid={`button-color-${i}`}
                />
              ))}
            </div>
            <select 
              className="color-select mobile-only"
              value={currentColor}
              onChange={(e) => setCurrentColor(e.target.value)}
              data-testid="select-color-mobile"
            >
              {COLORS.map((color, i) => (
                <option key={color} value={color}>
                  Color {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="coloring-section">
            <h2>🛠️ Tools</h2>
            <div className="tool-buttons">
              <button
                className={`tool-btn ${currentTool === "fill" ? "active" : ""}`}
                onClick={() => setCurrentTool("fill")}
                data-testid="button-fill-tool"
              >
                🪣 Fill Tool
              </button>
              <button
                className={`tool-btn ${currentTool === "brush" ? "active" : ""}`}
                onClick={() => setCurrentTool("brush")}
                data-testid="button-brush-tool"
              >
                🖌️ Brush
              </button>
              <button
                className={`tool-btn ${currentTool === "eraser" ? "active" : ""}`}
                onClick={() => setCurrentTool("eraser")}
                data-testid="button-eraser-tool"
              >
                🧹 Eraser
              </button>
              {(currentTool === "brush" || currentTool === "eraser") && (
                <div className="brush-size" data-testid="control-brush-size">
                  <span>Size:</span>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    data-testid="input-brush-size"
                  />
                  <span>{brushSize}</span>
                </div>
              )}
            </div>
          </div>

          <div className="coloring-section">
            <h2>⚡ Actions</h2>
            <div className="tool-buttons">
              <button
                className="tool-btn"
                onClick={handleUndo}
                data-testid="button-undo"
              >
                ↶ Undo
              </button>
              <button
                className="tool-btn"
                onClick={handleClear}
                data-testid="button-clear"
              >
                🗑️ Clear All
              </button>
              <button
                className="action-btn download"
                onClick={handleDownload}
                data-testid="button-download"
              >
                💾 Download
              </button>
              <button
                className="action-btn print"
                onClick={handlePrint}
                data-testid="button-print"
              >
                🖨️ Print
              </button>
            </div>
          </div>
        </div>

        <div className="canvas-area">
          <div className="instructions">
            <p><strong>How to use:</strong> Pick a character below, choose a color, then click areas to fill or use the brush to draw!</p>
          </div>
          <canvas
            ref={canvasRef}
            width={700}
            height={700}
            className="coloring-canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            data-testid="canvas-coloring"
          />
        </div>
      </div>
    </div>
  );
}
