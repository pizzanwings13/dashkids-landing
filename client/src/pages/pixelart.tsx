import { useState, useRef, useCallback, useEffect } from "react";
import { ArrowLeft, Download, Upload, RotateCcw, Zap } from "lucide-react";
import { Link } from "wouter";
import logoPath from "@assets/dashkids logo_1763859062109.png";

const PIXEL_SIZES = [
  { label: "SMALL", value: 4, color: "bg-[#32CD32]" },
  { label: "MEDIUM", value: 8, color: "bg-[#00BFFF]" },
  { label: "LARGE", value: 16, color: "bg-[#FF69B4]" },
  { label: "CHUNKY", value: 24, color: "bg-[#FF8C00]" },
];

const STATUS_MESSAGES = [
  "SCANNING PIXELS...",
  "CRUNCHING COLORS...",
  "BUILDING BLOCKS...",
  "STACKING CUBES...",
  "ALMOST THERE...",
  "FINALIZING...",
];

function pixelateCanvas(
  sourceCanvas: HTMLCanvasElement,
  outputCanvas: HTMLCanvasElement,
  pixelSize: number
) {
  const ctx = outputCanvas.getContext("2d");
  if (!ctx) return;

  const w = sourceCanvas.width;
  const h = sourceCanvas.height;
  outputCanvas.width = w;
  outputCanvas.height = h;

  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) return;

  const smallW = Math.ceil(w / pixelSize);
  const smallH = Math.ceil(h / pixelSize);
  tempCanvas.width = smallW;
  tempCanvas.height = smallH;

  tempCtx.imageSmoothingEnabled = false;
  tempCtx.drawImage(sourceCanvas, 0, 0, smallW, smallH);

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tempCanvas, 0, 0, smallW, smallH, 0, 0, w, h);
}

export default function PixelArtPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [pixelSize, setPixelSize] = useState(8);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [glitchFlash, setGlitchFlash] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const sourceCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  const animatePixelation = useCallback(
    (sourceCanvas: HTMLCanvasElement, outputCanvas: HTMLCanvasElement, targetSize: number) => {
      const steps = [128, 96, 64, 48, 32, 24, 16, 12, 8, 6, 4, 2].filter(s => s >= targetSize);
      if (!steps.includes(targetSize)) steps.push(targetSize);

      let stepIndex = 0;
      const totalSteps = steps.length;

      setIsProcessing(true);
      setProgress(0);
      setHasResult(false);

      const runStep = () => {
        if (stepIndex >= totalSteps) {
          setIsProcessing(false);
          setHasResult(true);
          setProgress(100);
          setGlitchFlash(true);
          setTimeout(() => setGlitchFlash(false), 300);
          return;
        }

        const currentPixelSize = steps[stepIndex];
        pixelateCanvas(sourceCanvas, outputCanvas, currentPixelSize);

        const pct = Math.round(((stepIndex + 1) / totalSteps) * 100);
        setProgress(pct);

        const msgIndex = Math.min(
          Math.floor((stepIndex / totalSteps) * STATUS_MESSAGES.length),
          STATUS_MESSAGES.length - 1
        );
        setStatusMsg(STATUS_MESSAGES[msgIndex]);

        stepIndex++;
        animFrameRef.current = window.setTimeout(runStep, 120);
      };

      runStep();
    },
    []
  );

  const processImage = useCallback(
    (imgSrc: string, size: number) => {
      if (animFrameRef.current) {
        clearTimeout(animFrameRef.current);
      }

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const sourceCanvas = sourceCanvasRef.current;
        const outputCanvas = outputCanvasRef.current;
        if (!sourceCanvas || !outputCanvas) return;

        const maxDim = 800;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          const ratio = Math.min(maxDim / w, maxDim / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }

        sourceCanvas.width = w;
        sourceCanvas.height = h;
        const ctx = sourceCanvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, w, h);

        animatePixelation(sourceCanvas, outputCanvas, size);
      };
      img.onerror = () => {
        setIsProcessing(false);
      };
      img.src = imgSrc;
    },
    [animatePixelation]
  );

  useEffect(() => {
    if (originalImage) {
      processImage(originalImage, pixelSize);
    }
    return () => {
      if (animFrameRef.current) clearTimeout(animFrameRef.current);
    };
  }, [pixelSize, originalImage, processImage]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setOriginalImage(result);
      setHasResult(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    const canvas = outputCanvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "dashkids-pixel-art.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleReset = () => {
    if (animFrameRef.current) clearTimeout(animFrameRef.current);
    setOriginalImage(null);
    setHasResult(false);
    setIsProcessing(false);
    setPixelSize(8);
    setProgress(0);
    setStatusMsg("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen living-gradient-bg">
      <div className="gradient-blob blob-pink" aria-hidden="true" />
      <div className="gradient-blob blob-blue" aria-hidden="true" />
      <div className="gradient-blob blob-purple" aria-hidden="true" />
      <div className="grain-overlay" aria-hidden="true" />

      <div className="max-w-4xl mx-auto px-4 content-layer">
        <header className="pt-6 sm:pt-8 pb-4 flex items-center justify-between" data-testid="pixel-header">
          <Link href="/">
            <button
              className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-lg font-bold font-fredoka bg-[#FF69B4] text-black border-[3px] sm:border-[4px] border-black rounded-full neo-brutal-shadow uppercase tracking-[1px] cursor-pointer"
              data-testid="button-back-home"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} />
              BACK
            </button>
          </Link>
          <img
            src={logoPath}
            alt="DashKids Logo"
            className="w-24 sm:w-40"
            data-testid="pixel-logo"
          />
        </header>

        <div className="text-center py-6 sm:py-10">
          <h1
            className="text-3xl sm:text-5xl font-bold font-fredoka uppercase tracking-[2px] text-white mb-2 sm:mb-3"
            data-testid="text-pixel-title"
          >
            Pixel Art Generator
          </h1>
          <p
            className="text-base sm:text-xl font-fredoka text-gray-400 uppercase tracking-[1px]"
            data-testid="text-pixel-subtitle"
          >
            Turn your DashKid into pixel art
          </p>
        </div>

        {!originalImage ? (
          <div className="flex flex-col items-center py-8 sm:py-12">
            <label
              htmlFor="dashkid-upload"
              className="w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] border-[4px] sm:border-[5px] border-dashed border-gray-500 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer group"
              data-testid="upload-dropzone"
            >
              <Upload className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 group-hover:text-[#32CD32]" strokeWidth={2.5} />
              <span className="text-lg sm:text-2xl font-bold font-fredoka text-gray-500 group-hover:text-[#32CD32] uppercase tracking-[1px] text-center px-4">
                Upload Your DashKid
              </span>
              <span className="text-sm sm:text-base font-fredoka text-gray-600 uppercase tracking-[1px]">
                Tap to choose image
              </span>
            </label>
            <input
              ref={fileInputRef}
              id="dashkid-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              data-testid="input-file-upload"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 sm:gap-8 pb-12">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 w-full justify-center">
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm sm:text-base font-bold font-fredoka text-gray-400 uppercase tracking-[1px]">
                  Original
                </span>
                <div className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] border-[3px] sm:border-[4px] border-black rounded-xl overflow-hidden neo-brutal-shadow bg-black" data-testid="original-preview">
                  <img
                    src={originalImage}
                    alt="Original DashKid"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className="text-sm sm:text-base font-bold font-fredoka text-[#32CD32] uppercase tracking-[1px] flex items-center gap-2">
                  {isProcessing && <Zap className="w-4 h-4 animate-spin" />}
                  Pixel Art
                  {isProcessing && <Zap className="w-4 h-4 animate-spin" />}
                </span>
                <div
                  className={`w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] border-[3px] sm:border-[4px] border-black rounded-xl overflow-hidden neo-brutal-shadow bg-black relative ${
                    glitchFlash ? "pixel-complete-flash" : ""
                  }`}
                  data-testid="pixel-preview"
                >
                  <canvas
                    ref={outputCanvasRef}
                    className="w-full h-full object-contain"
                    style={{ imageRendering: "pixelated" }}
                    data-testid="pixel-canvas"
                  />
                </div>
              </div>
            </div>

            <canvas ref={sourceCanvasRef} className="hidden" />

            {isProcessing && (
              <div className="w-[280px] sm:w-[400px] flex flex-col items-center gap-2" data-testid="progress-container">
                <div className="w-full h-5 sm:h-6 border-[3px] border-black rounded-full overflow-hidden bg-black/50">
                  <div
                    className="h-full rounded-full transition-all duration-100 ease-out"
                    style={{
                      width: `${progress}%`,
                      background: `linear-gradient(90deg, #32CD32, #00BFFF, #FF69B4, #FF8C00)`,
                      backgroundSize: "200% 100%",
                      animation: "shimmer-bar 1s linear infinite",
                    }}
                    data-testid="progress-bar"
                  />
                </div>
                <span className="text-sm sm:text-base font-bold font-fredoka text-[#00BFFF] uppercase tracking-[2px] animate-pulse" data-testid="text-status">
                  {statusMsg}
                </span>
              </div>
            )}

            {hasResult && (
              <div className="flex items-center gap-2 animate-bounce-in" data-testid="complete-badge">
                <span className="text-lg sm:text-xl font-bold font-fredoka text-[#32CD32] uppercase tracking-[2px]">
                  COMPLETE
                </span>
              </div>
            )}

            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <span className="text-sm sm:text-base font-bold font-fredoka text-gray-400 uppercase tracking-[1px]">
                Pixel Size
              </span>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {PIXEL_SIZES.map((size) => (
                  <button
                    key={size.label}
                    onClick={() => setPixelSize(size.value)}
                    disabled={isProcessing}
                    className={`px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-lg font-bold font-fredoka border-[3px] sm:border-[4px] border-black rounded-full cursor-pointer uppercase tracking-[1px] text-black ${
                      size.color
                    } ${
                      pixelSize === size.value
                        ? "neo-brutal-shadow"
                        : "opacity-50"
                    } ${isProcessing ? "cursor-not-allowed" : ""}`}
                    data-testid={`button-pixel-${size.label.toLowerCase()}`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 sm:gap-4">
              {hasResult && (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-xl font-bold font-fredoka bg-[#32CD32] text-black border-[3px] sm:border-[5px] border-black rounded-full neo-brutal-shadow cursor-pointer uppercase tracking-[1px]"
                  data-testid="button-download"
                >
                  <Download className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                  SAVE
                </button>
              )}
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-xl font-bold font-fredoka bg-[#FF8C00] text-black border-[3px] sm:border-[5px] border-black rounded-full neo-brutal-shadow cursor-pointer uppercase tracking-[1px]"
                data-testid="button-reset"
              >
                <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                NEW
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="py-6 text-center text-sm text-muted-foreground content-layer" data-testid="pixel-footer">
        &copy; 2025 DashKids. All rights reserved.
      </footer>
    </div>
  );
}
