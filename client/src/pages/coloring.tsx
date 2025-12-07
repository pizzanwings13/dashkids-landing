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
  lines: (ctx: CanvasRenderingContext2D) => void;
}

export default function ColoringPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTool, setCurrentTool] = useState("fill");
  const [currentColor, setCurrentColor] = useState("#FF6B6B");
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [brushSize, setBrushSize] = useState(20);
  const [activeCharacterIndex, setActiveCharacterIndex] = useState(0);
  const [customCharacters, setCustomCharacters] = useState<Character[]>([]);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultCharacters: Character[] = [
    { name: "Pose 1", lines: drawCharacter1 },
    { name: "Pose 2", lines: drawCharacter2 },
    { name: "Pose 3", lines: drawCharacter3 },
    { name: "Pose 4", lines: drawCharacter4 },
    { name: "Pose 5", lines: drawCharacter5 },
    { name: "Pose 6", lines: drawCharacter6 },
    { name: "Pose 7", lines: drawCharacter7 },
    { name: "Pose 8", lines: drawCharacter8 },
    { name: "Pose 9", lines: drawCharacter9 },
    { name: "Pose 10", lines: drawCharacter10 },
    { name: "Pose 11", lines: drawCharacter11 },
    { name: "Pose 12", lines: drawCharacter12 },
    { name: "Pose 13", lines: drawCharacter13 },
    { name: "Pose 14", lines: drawCharacter14 }
  ];

  const allCharacters = [...defaultCharacters, ...customCharacters];

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
    allCharacters[index].lines(ctx);
    saveHistory();
  };

  const handleSVGUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const svgContent = event.target?.result as string;
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      
      const drawSVG = (ctx: CanvasRenderingContext2D) => {
        const canvas = document.createElement("canvas");
        canvas.width = 700;
        canvas.height = 700;
        const tempCtx = canvas.getContext("2d")!;
        
        const img = new Image();
        img.onload = () => {
          tempCtx.drawImage(img, 0, 0, 700, 700);
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgContent);
        
        setTimeout(() => {
          ctx.drawImage(canvas, 0, 0);
        }, 100);
      };

      const newCharacter: Character = {
        name: fileName || "Custom",
        lines: drawSVG
      };

      const updated = [...customCharacters, newCharacter];
      setCustomCharacters(updated);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    
    reader.readAsText(file);
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
    ctx.fillStyle = currentTool === "eraser" ? "white" : currentColor;
    ctx.fill();
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
              {allCharacters.map((char, i) => (
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
            <button
              className="tool-btn"
              onClick={() => fileInputRef.current?.click()}
              data-testid="button-upload-svg"
              style={{ marginTop: "10px", width: "100%" }}
            >
              ➕ Add SVG
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg"
              onChange={handleSVGUpload}
              style={{ display: "none" }}
              data-testid="input-svg-upload"
            />
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
            data-testid="canvas-coloring"
          />
        </div>
      </div>
    </div>
  );
}

// Character drawing functions
function drawCharacter1(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;
  ctx.fillStyle = "white";
  
  ctx.beginPath();
  ctx.arc(350, 200, 80, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(350, 150, 60, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(330, 190, 10, 0, Math.PI * 2);
  ctx.arc(370, 190, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(332, 190, 5, 0, Math.PI * 2);
  ctx.arc(372, 190, 5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(350, 215, 20, 0, Math.PI, false);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(300, 280, 100, 120);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(260, 300, 35, 80);
  ctx.rect(405, 300, 35, 80);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(310, 400, 35, 100);
  ctx.rect(355, 400, 35, 100);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(327, 510, 30, 15, 0, 0, Math.PI * 2);
  ctx.ellipse(372, 510, 30, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawCharacter2(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;
  ctx.fillStyle = "white";
  
  ctx.beginPath();
  ctx.arc(350, 200, 80, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(350, 150, 60, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(330, 190, 10, 0, Math.PI * 2);
  ctx.arc(370, 190, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(332, 190, 5, 0, Math.PI * 2);
  ctx.arc(372, 190, 5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(350, 215, 20, 0, Math.PI, false);
  ctx.stroke();
  
  ctx.save();
  ctx.translate(350, 340);
  ctx.rotate(0.2);
  ctx.beginPath();
  ctx.rect(-50, -40, 100, 100);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  
  ctx.beginPath();
  ctx.moveTo(270, 310);
  ctx.lineTo(240, 280);
  ctx.lineTo(245, 360);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(430, 310);
  ctx.lineTo(450, 300);
  ctx.lineTo(445, 370);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(320, 410);
  ctx.lineTo(300, 480);
  ctx.lineTo(330, 500);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(370, 410);
  ctx.lineTo(400, 490);
  ctx.lineTo(420, 505);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(315, 510, 25, 12, -0.3, 0, Math.PI * 2);
  ctx.ellipse(410, 515, 25, 12, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawCharacter3(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;
  ctx.fillStyle = "white";
  
  ctx.beginPath();
  ctx.arc(350, 200, 80, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(310, 160);
  ctx.quadraticCurveTo(320, 130, 350, 125);
  ctx.quadraticCurveTo(380, 130, 390, 160);
  ctx.lineTo(380, 170);
  ctx.lineTo(320, 170);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(330, 190, 10, 0, Math.PI * 2);
  ctx.arc(370, 190, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(332, 190, 5, 0, Math.PI * 2);
  ctx.arc(372, 190, 5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(350, 215, 20, 0, Math.PI, false);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(300, 280, 100, 120);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(260, 300, 35, 80);
  ctx.rect(405, 300, 35, 80);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(310, 400, 35, 100);
  ctx.rect(355, 400, 35, 100);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(327, 510, 30, 15, 0, 0, Math.PI * 2);
  ctx.ellipse(372, 510, 30, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawCharacter4(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;
  ctx.fillStyle = "white";
  
  ctx.beginPath();
  ctx.arc(350, 200, 80, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(350, 150, 60, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(330, 190, 10, 0, Math.PI * 2);
  ctx.arc(370, 190, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(332, 190, 5, 0, Math.PI * 2);
  ctx.arc(372, 190, 5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(350, 215, 20, 0, Math.PI, false);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(300, 280, 100, 120);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(260, 300, 35, 80);
  ctx.rect(405, 300, 35, 80);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(310, 400, 35, 100);
  ctx.rect(355, 400, 35, 100);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(327, 510, 30, 15, 0, 0, Math.PI * 2);
  ctx.ellipse(372, 510, 30, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawCharacter5(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;
  ctx.fillStyle = "white";
  
  ctx.beginPath();
  ctx.arc(350, 200, 80, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(350, 150, 60, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(330, 190, 10, 0, Math.PI * 2);
  ctx.arc(370, 190, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(332, 190, 5, 0, Math.PI * 2);
  ctx.arc(372, 190, 5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(350, 215, 20, 0, Math.PI, false);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(300, 280, 100, 120);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(260, 300, 35, 80);
  ctx.rect(405, 300, 35, 80);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(310, 400, 35, 100);
  ctx.rect(355, 400, 35, 100);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(327, 510, 30, 15, 0, 0, Math.PI * 2);
  ctx.ellipse(372, 510, 30, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawCharacter6(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;
  ctx.fillStyle = "white";
  
  ctx.beginPath();
  ctx.arc(350, 200, 80, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(350, 150, 60, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(330, 190, 10, 0, Math.PI * 2);
  ctx.arc(370, 190, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(332, 190, 5, 0, Math.PI * 2);
  ctx.arc(372, 190, 5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(350, 215, 20, 0, Math.PI, false);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(300, 280, 100, 120);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(260, 300, 35, 80);
  ctx.rect(405, 300, 35, 80);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(310, 400, 35, 100);
  ctx.rect(355, 400, 35, 100);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(327, 510, 30, 15, 0, 0, Math.PI * 2);
  ctx.ellipse(372, 510, 30, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawCharacter7(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;
  ctx.fillStyle = "white";
  
  ctx.beginPath();
  ctx.arc(350, 200, 80, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(350, 150, 60, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(330, 190, 10, 0, Math.PI * 2);
  ctx.arc(370, 190, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(332, 190, 5, 0, Math.PI * 2);
  ctx.arc(372, 190, 5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(350, 215, 20, 0, Math.PI, false);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(300, 280, 100, 120);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(260, 300, 35, 80);
  ctx.rect(405, 300, 35, 80);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(310, 400, 35, 100);
  ctx.rect(355, 400, 35, 100);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(327, 510, 30, 15, 0, 0, Math.PI * 2);
  ctx.ellipse(372, 510, 30, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawCharacter8(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;
  ctx.fillStyle = "white";
  
  ctx.beginPath();
  ctx.arc(350, 200, 80, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(350, 150, 60, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(330, 190, 10, 0, Math.PI * 2);
  ctx.arc(370, 190, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(332, 190, 5, 0, Math.PI * 2);
  ctx.arc(372, 190, 5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(350, 215, 20, 0, Math.PI, false);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(300, 280, 100, 120);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(260, 300, 35, 80);
  ctx.rect(405, 300, 35, 80);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(310, 400, 35, 100);
  ctx.rect(355, 400, 35, 100);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(327, 510, 30, 15, 0, 0, Math.PI * 2);
  ctx.ellipse(372, 510, 30, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawCharacter9(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;
  ctx.fillStyle = "white";
  
  ctx.beginPath();
  ctx.arc(350, 200, 80, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(350, 150, 60, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(330, 190, 10, 0, Math.PI * 2);
  ctx.arc(370, 190, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(332, 190, 5, 0, Math.PI * 2);
  ctx.arc(372, 190, 5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(350, 215, 20, 0, Math.PI, false);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(300, 280, 100, 120);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(260, 300, 35, 80);
  ctx.rect(405, 300, 35, 80);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(310, 400, 35, 100);
  ctx.rect(355, 400, 35, 100);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(327, 510, 30, 15, 0, 0, Math.PI * 2);
  ctx.ellipse(372, 510, 30, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawCharacter10(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;
  ctx.fillStyle = "white";
  
  ctx.beginPath();
  ctx.arc(350, 200, 80, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(350, 150, 60, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(330, 190, 10, 0, Math.PI * 2);
  ctx.arc(370, 190, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(332, 190, 5, 0, Math.PI * 2);
  ctx.arc(372, 190, 5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(350, 215, 20, 0, Math.PI, false);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(300, 280, 100, 120);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(260, 300, 35, 80);
  ctx.rect(405, 300, 35, 80);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(310, 400, 35, 100);
  ctx.rect(355, 400, 35, 100);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(327, 510, 30, 15, 0, 0, Math.PI * 2);
  ctx.ellipse(372, 510, 30, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawCharacter11(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;
  ctx.fillStyle = "white";
  
  ctx.beginPath();
  ctx.arc(350, 200, 80, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(350, 150, 60, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(330, 190, 10, 0, Math.PI * 2);
  ctx.arc(370, 190, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(332, 190, 5, 0, Math.PI * 2);
  ctx.arc(372, 190, 5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(350, 215, 20, 0, Math.PI, false);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(300, 280, 100, 120);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(260, 300, 35, 80);
  ctx.rect(405, 300, 35, 80);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(310, 400, 35, 100);
  ctx.rect(355, 400, 35, 100);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(327, 510, 30, 15, 0, 0, Math.PI * 2);
  ctx.ellipse(372, 510, 30, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawCharacter12(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;
  ctx.fillStyle = "white";
  
  ctx.beginPath();
  ctx.arc(350, 200, 80, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(350, 150, 60, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(330, 190, 10, 0, Math.PI * 2);
  ctx.arc(370, 190, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(332, 190, 5, 0, Math.PI * 2);
  ctx.arc(372, 190, 5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(350, 215, 20, 0, Math.PI, false);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(300, 280, 100, 120);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(260, 300, 35, 80);
  ctx.rect(405, 300, 35, 80);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(310, 400, 35, 100);
  ctx.rect(355, 400, 35, 100);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(327, 510, 30, 15, 0, 0, Math.PI * 2);
  ctx.ellipse(372, 510, 30, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawCharacter13(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;
  ctx.fillStyle = "white";
  
  ctx.beginPath();
  ctx.arc(350, 200, 80, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(350, 150, 60, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(330, 190, 10, 0, Math.PI * 2);
  ctx.arc(370, 190, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(332, 190, 5, 0, Math.PI * 2);
  ctx.arc(372, 190, 5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(350, 215, 20, 0, Math.PI, false);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(300, 280, 100, 120);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(260, 300, 35, 80);
  ctx.rect(405, 300, 35, 80);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(310, 400, 35, 100);
  ctx.rect(355, 400, 35, 100);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(327, 510, 30, 15, 0, 0, Math.PI * 2);
  ctx.ellipse(372, 510, 30, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawCharacter14(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;
  ctx.fillStyle = "white";
  
  ctx.beginPath();
  ctx.arc(350, 200, 80, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(350, 150, 60, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(330, 190, 10, 0, Math.PI * 2);
  ctx.arc(370, 190, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(332, 190, 5, 0, Math.PI * 2);
  ctx.arc(372, 190, 5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(350, 215, 20, 0, Math.PI, false);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(300, 280, 100, 120);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(260, 300, 35, 80);
  ctx.rect(405, 300, 35, 80);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.rect(310, 400, 35, 100);
  ctx.rect(355, 400, 35, 100);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(327, 510, 30, 15, 0, 0, Math.PI * 2);
  ctx.ellipse(372, 510, 30, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}
