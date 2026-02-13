import { useState, useRef, useCallback, useEffect } from "react";
import { ArrowLeft, Download, Upload, RotateCcw, Zap, Wallet, ShieldAlert, Loader2, LogOut } from "lucide-react";
import { Link } from "wouter";
import { ethers } from "ethers";
import logoPath from "@assets/dashkids logo_1763859062109.png";

const TARGET_SIZE = 32;

const DASHKIDS_CONTRACT = "0x7256de5b154e4242c989fa089c66f153f758335c";
const APECHAIN_ID = 33139;
const APECHAIN_HEX = "0x8173";
const APECHAIN_RPC = "https://apechain.calderachain.xyz/http";

const ERC721_ABI = ["function balanceOf(address owner) view returns (uint256)"];

const STATUS_MESSAGES = [
  "SCANNING PIXELS...",
  "CRUNCHING COLORS...",
  "BUILDING BLOCKS...",
  "STACKING CUBES...",
  "ALMOST THERE...",
  "FINALIZING...",
];

function pixelateTo(
  sourceCanvas: HTMLCanvasElement,
  outputCanvas: HTMLCanvasElement,
  gridSize: number
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

  tempCanvas.width = gridSize;
  tempCanvas.height = gridSize;

  tempCtx.imageSmoothingEnabled = false;
  tempCtx.drawImage(sourceCanvas, 0, 0, gridSize, gridSize);

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tempCanvas, 0, 0, gridSize, gridSize, 0, 0, w, h);
}

type WalletState = "disconnected" | "connecting" | "switching" | "checking" | "verified" | "no_nft" | "error";

export default function PixelArtPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [glitchFlash, setGlitchFlash] = useState(false);

  const [walletState, setWalletState] = useState<WalletState>("disconnected");
  const [walletAddress, setWalletAddress] = useState("");
  const [nftCount, setNftCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const sourceCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setWalletState("disconnected");
        setWalletAddress("");
        setNftCount(0);
      } else {
        checkNftBalance(accounts[0]);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on?.("accountsChanged", handleAccountsChanged);
      window.ethereum.on?.("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener?.("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const switchToApeChain = async () => {
    if (!window.ethereum) return false;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: APECHAIN_HEX }],
      });
      return true;
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: APECHAIN_HEX,
                chainName: "ApeChain",
                nativeCurrency: { name: "ApeCoin", symbol: "APE", decimals: 18 },
                rpcUrls: [APECHAIN_RPC],
                blockExplorerUrls: ["https://apescan.io"],
              },
            ],
          });
          return true;
        } catch {
          return false;
        }
      }
      return false;
    }
  };

  const checkNftBalance = async (address: string) => {
    setWalletState("checking");
    setWalletAddress(address);
    try {
      const provider = new ethers.JsonRpcProvider(APECHAIN_RPC);
      const contract = new ethers.Contract(DASHKIDS_CONTRACT, ERC721_ABI, provider);
      const balance: bigint = await contract.balanceOf(address);
      const count = Number(balance);
      setNftCount(count);
      if (count > 0) {
        setWalletState("verified");
      } else {
        setWalletState("no_nft");
      }
    } catch (err: any) {
      setWalletState("error");
      setErrorMsg("Could not verify NFT ownership. Please try again.");
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setWalletState("error");
      setErrorMsg("No wallet detected. Please install MetaMask or another Web3 wallet.");
      return;
    }

    setWalletState("connecting");
    setErrorMsg("");

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        setWalletState("disconnected");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      if (Number(network.chainId) !== APECHAIN_ID) {
        setWalletState("switching");
        const switched = await switchToApeChain();
        if (!switched) {
          setWalletState("error");
          setErrorMsg("Please switch to ApeChain in your wallet to continue.");
          return;
        }
      }

      await checkNftBalance(accounts[0]);
    } catch (err: any) {
      if (err.code === 4001) {
        setWalletState("disconnected");
      } else {
        setWalletState("error");
        setErrorMsg("Connection failed. Please try again.");
      }
    }
  };

  const disconnectWallet = () => {
    setWalletState("disconnected");
    setWalletAddress("");
    setNftCount(0);
    setOriginalImage(null);
    setHasResult(false);
    setIsProcessing(false);
  };

  const shortenAddress = (addr: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  const animatePixelation = useCallback(
    (sourceCanvas: HTMLCanvasElement, outputCanvas: HTMLCanvasElement) => {
      const steps = [4, 6, 8, 10, 12, 16, 20, 24, 28, TARGET_SIZE];
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

        const currentGrid = steps[stepIndex];
        pixelateTo(sourceCanvas, outputCanvas, currentGrid);

        const pct = Math.round(((stepIndex + 1) / totalSteps) * 100);
        setProgress(pct);

        const msgIndex = Math.min(
          Math.floor((stepIndex / totalSteps) * STATUS_MESSAGES.length),
          STATUS_MESSAGES.length - 1
        );
        setStatusMsg(STATUS_MESSAGES[msgIndex]);

        stepIndex++;
        animFrameRef.current = window.setTimeout(runStep, 150);
      };

      runStep();
    },
    []
  );

  const processImage = useCallback(
    (imgSrc: string) => {
      if (animFrameRef.current) {
        clearTimeout(animFrameRef.current);
      }

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const sourceCanvas = sourceCanvasRef.current;
        const outputCanvas = outputCanvasRef.current;
        if (!sourceCanvas || !outputCanvas) return;

        const dim = 512;
        sourceCanvas.width = dim;
        sourceCanvas.height = dim;
        const ctx = sourceCanvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, dim, dim);

        animatePixelation(sourceCanvas, outputCanvas);
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
      processImage(originalImage);
    }
    return () => {
      if (animFrameRef.current) clearTimeout(animFrameRef.current);
    };
  }, [originalImage, processImage]);

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
    setProgress(0);
    setStatusMsg("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isGated = walletState !== "verified";

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

          {walletState === "verified" && (
            <button
              onClick={disconnectWallet}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold font-fredoka bg-[#1a1a2e] text-[#32CD32] border-[3px] border-[#32CD32] rounded-full uppercase tracking-[1px] cursor-pointer"
              data-testid="button-disconnect-wallet"
            >
              <Wallet className="w-4 h-4" />
              {shortenAddress(walletAddress)}
              <LogOut className="w-3 h-3" />
            </button>
          )}

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
        </div>

        {isGated ? (
          <div className="flex flex-col items-center py-8 sm:py-12 gap-6">
            <div className="w-[300px] sm:w-[480px] border-[4px] sm:border-[5px] border-black rounded-2xl bg-[#1a1a2e]/90 p-6 sm:p-10 flex flex-col items-center gap-5 neo-brutal-shadow" data-testid="wallet-gate">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-[4px] border-[#FF69B4] flex items-center justify-center bg-black/50">
                <ShieldAlert className="w-8 h-8 sm:w-10 sm:h-10 text-[#FF69B4]" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold font-fredoka text-white uppercase tracking-[2px] text-center">
                Holders Only
              </h2>

              <p className="text-sm sm:text-base font-fredoka text-gray-400 text-center leading-relaxed uppercase tracking-[1px]">
                Connect your wallet and verify you own a DashKids NFT to unlock this feature
              </p>

              {walletState === "disconnected" && (
                <button
                  onClick={connectWallet}
                  className="flex items-center gap-3 px-8 py-4 text-lg sm:text-xl font-bold font-fredoka bg-[#32CD32] text-black border-[4px] sm:border-[5px] border-black rounded-full neo-brutal-shadow cursor-pointer uppercase tracking-[1px] mt-2"
                  data-testid="button-connect-wallet"
                >
                  <Wallet className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                  Connect Wallet
                </button>
              )}

              {(walletState === "connecting" || walletState === "switching" || walletState === "checking") && (
                <div className="flex flex-col items-center gap-3 mt-2" data-testid="wallet-loading">
                  <Loader2 className="w-8 h-8 text-[#00BFFF] animate-spin" />
                  <span className="text-sm sm:text-base font-bold font-fredoka text-[#00BFFF] uppercase tracking-[2px] animate-pulse">
                    {walletState === "connecting" && "CONNECTING..."}
                    {walletState === "switching" && "SWITCHING TO APECHAIN..."}
                    {walletState === "checking" && "VERIFYING NFT..."}
                  </span>
                </div>
              )}

              {walletState === "no_nft" && (
                <div className="flex flex-col items-center gap-4 mt-2" data-testid="no-nft-message">
                  <div className="px-5 py-3 bg-[#FF8C00]/20 border-[3px] border-[#FF8C00] rounded-xl">
                    <span className="text-sm sm:text-base font-bold font-fredoka text-[#FF8C00] uppercase tracking-[1px]">
                      No DashKids NFT Found
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-fredoka text-gray-500 text-center uppercase tracking-[1px]">
                    Wallet: {shortenAddress(walletAddress)}
                  </p>
                  <div className="flex gap-3">
                    <a
                      href="https://magiceden.us/collections/apechain/0x7256de5b154e4242c989fa089c66f153f758335c"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 text-sm sm:text-base font-bold font-fredoka bg-[#FF69B4] text-black border-[3px] border-black rounded-full neo-brutal-shadow uppercase tracking-[1px]"
                      data-testid="link-buy-nft"
                    >
                      Get a DashKid
                    </a>
                    <button
                      onClick={connectWallet}
                      className="px-6 py-3 text-sm sm:text-base font-bold font-fredoka bg-[#00BFFF] text-black border-[3px] border-black rounded-full neo-brutal-shadow cursor-pointer uppercase tracking-[1px]"
                      data-testid="button-retry-wallet"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {walletState === "error" && (
                <div className="flex flex-col items-center gap-4 mt-2" data-testid="wallet-error">
                  <div className="px-5 py-3 bg-red-500/20 border-[3px] border-red-500 rounded-xl">
                    <span className="text-sm sm:text-base font-bold font-fredoka text-red-400 uppercase tracking-[1px]">
                      {errorMsg}
                    </span>
                  </div>
                  <button
                    onClick={connectWallet}
                    className="px-6 py-3 text-sm sm:text-base font-bold font-fredoka bg-[#32CD32] text-black border-[3px] border-black rounded-full neo-brutal-shadow cursor-pointer uppercase tracking-[1px]"
                    data-testid="button-retry-connect"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {!originalImage ? (
              <div className="flex flex-col items-center py-8 sm:py-12">
                <div className="mb-6 px-5 py-2 bg-[#32CD32]/20 border-[3px] border-[#32CD32] rounded-full" data-testid="verified-badge">
                  <span className="text-sm sm:text-base font-bold font-fredoka text-[#32CD32] uppercase tracking-[2px]">
                    {nftCount} DashKid{nftCount !== 1 ? "s" : ""} Verified
                  </span>
                </div>
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
                      32x32 Pixel Art
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
                          background: "linear-gradient(90deg, #32CD32, #00BFFF, #FF69B4, #FF8C00)",
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
          </>
        )}
      </div>

      <footer className="py-6 text-center text-sm text-muted-foreground content-layer" data-testid="pixel-footer">
        &copy; 2025 DashKids. All rights reserved.
      </footer>
    </div>
  );
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
