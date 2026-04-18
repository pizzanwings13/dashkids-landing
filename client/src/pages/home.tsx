import { useState, useRef, useEffect } from "react";
import { Rocket, Trophy, ArrowUpRight, Zap } from "lucide-react";
import logoPath from "@assets/dashkids logo_1763859062109.png";
import dashingImg from "@assets/184_1768929510302.png";
import chillinImg from "@assets/184_(1)_1768929539935.png";
import portraitImg from "@assets/184_(2)_1768929554699.png";
import animatedGif from "@assets/184_1768929567793.gif";

const styleImages = {
  DASHING: dashingImg,
  CHILLIN: chillinImg,
  PORTRAIT: portraitImg,
  ANIMATED: animatedGif,
};

const navCards = [
  {
    title: "DASHHUB",
    description: "Your DashKids command center",
    href: "https://dashkidsmp.xyz",
    accent: "#32CD32",
    icon: Rocket,
    external: true,
  },
  {
    title: "STAKING",
    description: "Earn rewards with your DashKids",
    href: "https://dashkids.vercel.app/",
    accent: "#FF69B4",
    icon: Trophy,
    external: true,
  },
];

const socialLinks = [
  {
    href: "https://x.com/dashkidsnft?s=21",
    label: "X / Twitter",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: "https://discord.gg/Y4gP9mFYns",
    label: "Discord",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.87-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    href: "https://opensea.io/collection/dashkids",
    label: "OpenSea",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zM5.92 12.403l.051-.081 3.123-4.884a.107.107 0 0 1 .187.014c.52 1.169.972 2.623.76 3.528-.088.372-.335.876-.614 1.342a2.405 2.405 0 0 1-.117.199.106.106 0 0 1-.09.045H6.013a.106.106 0 0 1-.093-.163zm13.914 1.68a.109.109 0 0 1-.065.101c-.243.103-1.07.485-1.414.962-.878 1.222-1.548 2.97-3.048 2.97H9.053a4.019 4.019 0 0 1-4.013-4.028v-.072c0-.058.048-.106.108-.106h3.485c.07 0 .12.063.115.132-.026.226.017.459.125.67.206.42.636.682 1.099.682h1.726v-1.347H9.99a.11.11 0 0 1-.089-.173l.063-.09c.16-.231.391-.586.621-.992.156-.274.308-.566.43-.858.024-.052.043-.107.065-.16.034-.089.067-.174.093-.259a6.42 6.42 0 0 0 .117-.566c.016-.102.023-.204.023-.304 0-.129-.007-.258-.016-.381a5.39 5.39 0 0 0-.034-.376 3.35 3.35 0 0 0-.063-.36l-.013-.065c-.016-.086-.031-.168-.05-.253a13.22 13.22 0 0 0-.174-.695l-.076-.27c-.074-.241-.157-.48-.251-.715a9.104 9.104 0 0 0-.212-.509c-.028-.065-.06-.129-.089-.193-.04-.086-.082-.165-.118-.241l-.097-.193-.088-.177a1.04 1.04 0 0 1-.057-.118l-.172-.315a.078.078 0 0 1 .089-.111l1.319.358h.01l.174.048.192.054.071.02v-1.14c0-.477.387-.865.866-.865.24 0 .456.097.612.253a.862.862 0 0 1 .253.612v1.69l.141.04c.01.005.023.011.034.02.04.027.098.065.172.117.058.043.12.094.193.15.147.117.322.272.513.449.05.048.098.094.143.141.239.228.509.499.779.804.074.086.147.174.218.262.074.091.152.18.222.274.091.117.188.241.277.372.043.063.089.129.131.193.117.177.222.36.318.545.04.079.078.163.113.245.108.238.192.481.25.724.02.063.032.129.043.193v.02c.016.074.023.153.029.23a1.89 1.89 0 0 1-.063.63 2.27 2.27 0 0 1-.078.258 2.18 2.18 0 0 1-.117.289c-.043.091-.091.188-.145.28a4.04 4.04 0 0 1-.539.73c-.046.06-.098.117-.15.18-.057.063-.117.122-.174.18-.079.082-.165.16-.251.235-.046.045-.098.091-.147.131-.046.043-.098.086-.147.125a4.2 4.2 0 0 1-.229.16l-.15.102a.084.084 0 0 1-.048.014h-1.06v1.347h1.332c.288 0 .563-.11.772-.306.065-.063.498-.45.912-.971a.11.11 0 0 1 .057-.035l4.185-1.21a.108.108 0 0 1 .134.103v.792z" />
      </svg>
    ),
  },
];

const characterImages = [
  "/characters/728_1765215801848.png",
  "/characters/817_1765215786885.png",
  "/characters/845_1765215794486.png",
  "/characters/878_1765215754479.png",
  "/characters/879_1765215754481.png",
  "/characters/880_1765215754474.png",
  "/characters/881_1765215754476.png",
  "/characters/882_1765215754478.png",
  "/characters/896_1765215764566.png",
  "/characters/899_1765215771574.png",
];

const stats = [
  { label: "Supply", value: "1,555" },
  { label: "Chain", value: "ApeChain" },
  { label: "Type", value: "Generative" },
];

function LoadingPortal({ onEnter }: { onEnter: () => void }) {
  const [isFlashing, setIsFlashing] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleEnter = () => {
    setIsFlashing(true);
    setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onEnter();
      }, 100);
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center portal-bg transition-opacity duration-300 ${
        isExiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      data-testid="loading-portal"
    >
      {isFlashing && (
        <div className="fixed inset-0 bg-white flash-overlay z-[60]" data-testid="flash-overlay" />
      )}
      
      <img
        src={logoPath}
        alt="DashKids Logo"
        className="w-64 sm:w-80 mb-8 logo-glow"
        data-testid="portal-logo"
      />
      
      <button
        onClick={handleEnter}
        className="px-8 py-4 sm:px-12 sm:py-5 text-xl sm:text-3xl font-bold font-fredoka bg-[#00FF7F] text-black border-[4px] sm:border-[5px] border-black rounded-full animate-pulse-glow cursor-pointer uppercase tracking-[2px] mb-4"
        data-testid="button-enter"
      >
        ENTER
      </button>
      
      <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-[3px] font-fredoka" data-testid="text-beats-hint">
        SICK BEATS INSIDE
      </p>
    </div>
  );
}

function StyleSwapper() {
  const [currentStyle, setCurrentStyle] = useState<keyof typeof styleImages>("DASHING");
  const [isAnimating, setIsAnimating] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const styles: (keyof typeof styleImages)[] = ["DASHING", "CHILLIN", "PORTRAIT", "ANIMATED"];

  const styleAccents: Record<keyof typeof styleImages, string> = {
    DASHING: "#32CD32",
    CHILLIN: "#00BFFF",
    PORTRAIT: "#FF69B4",
    ANIMATED: "#FF8C00",
  };

  const handleStyleChange = (style: keyof typeof styleImages) => {
    if (style === currentStyle || isAnimating) return;
    setIsAnimating(true);
    if (imageRef.current) imageRef.current.classList.add("animate-squish");
    setTimeout(() => {
      setCurrentStyle(style);
      setIsAnimating(false);
      if (imageRef.current) imageRef.current.classList.remove("animate-squish");
    }, 150);
  };

  return (
    <section className="py-16 sm:py-20 px-4" data-testid="style-swapper-section">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs uppercase tracking-[4px] text-center mb-3 font-fredoka" style={{ color: styleAccents[currentStyle] }}>
          Collection Styles
        </p>
        <h2 className="text-3xl sm:text-5xl font-bold font-fredoka mb-12 text-center uppercase tracking-[2px] text-white">
          Choose Your Style
        </h2>

        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div
            className="relative flex-shrink-0"
            data-testid="style-swapper-container"
          >
            <div
              className="absolute inset-0 rounded-3xl blur-2xl opacity-40 transition-all duration-500"
              style={{ background: styleAccents[currentStyle] }}
            />
            <div className="relative w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] rounded-3xl overflow-hidden border border-white/10">
              <img
                ref={imageRef}
                src={styleImages[currentStyle]}
                alt={`DashKids ${currentStyle} style`}
                className="w-full h-full object-cover"
                data-testid="style-swapper-image"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-xs lg:max-w-none">
            {styles.map((style) => {
              const isActive = currentStyle === style;
              return (
                <button
                  key={style}
                  onClick={() => handleStyleChange(style)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border cursor-pointer transition-all duration-200 text-left ${
                    isActive
                      ? "border-white/20 bg-white/10"
                      : "border-white/5 bg-white/[0.03] hover:bg-white/[0.06]"
                  }`}
                  data-testid={`button-style-${style.toLowerCase()}`}
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0 transition-all duration-200"
                    style={{ background: isActive ? styleAccents[style] : "rgba(255,255,255,0.2)" }}
                  />
                  <span
                    className={`text-lg sm:text-xl font-bold font-fredoka uppercase tracking-[2px] transition-colors duration-200`}
                    style={{ color: isActive ? styleAccents[style] : "rgba(255,255,255,0.5)" }}
                  >
                    {style}
                  </span>
                  {isActive && (
                    <span className="ml-auto text-xs font-fredoka uppercase tracking-[2px] opacity-60 text-white">
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function NavigationHub() {
  return (
    <section className="py-16 sm:py-20 px-4" data-testid="navigation-hub-section">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs uppercase tracking-[4px] text-center mb-3 font-fredoka text-[#32CD32]">
          Ecosystem
        </p>
        <h2 className="text-3xl sm:text-5xl font-bold font-fredoka mb-12 text-center uppercase tracking-[2px] text-white">
          Explore DashKids
        </h2>

        <div className="flex flex-col gap-3">
          {navCards.map((card) => {
            const IconComponent = card.icon;

            const inner = (
              <div
                className="group flex items-center gap-5 px-6 py-5 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200 cursor-pointer"
                data-testid={`card-${card.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${card.accent}22`, border: `1px solid ${card.accent}44` }}
                >
                  <IconComponent className="w-6 h-6" style={{ color: card.accent }} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base sm:text-lg font-bold font-fredoka uppercase tracking-[1px] text-white">
                    {card.title}
                  </p>
                  <p className="text-sm font-fredoka text-white/40 mt-0.5">
                    {card.description}
                  </p>
                </div>
                <ArrowUpRight
                  className="w-5 h-5 text-white/30 group-hover:text-white/70 transition-colors duration-200 flex-shrink-0"
                  strokeWidth={2}
                />
              </div>
            );

            return (
              <a
                key={card.title}
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {inner}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CharacterMarquee() {
  return (
    <div className="py-6 overflow-hidden" data-testid="character-runner-section">
      <div className="flex animate-marquee">
        {[...characterImages, ...characterImages].map((src, index) => (
          <div key={index} className="flex-shrink-0 mx-3">
            <img
              src={src}
              alt={`DashKids character ${index + 1}`}
              className="w-24 h-24 sm:w-28 sm:h-28 object-contain opacity-80"
              data-testid={`runner-character-${index}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && !audioStarted) {
      audioRef.current.play()
        .then(() => setAudioStarted(true))
        .catch(() => {});
    }
  }, [audioStarted]);

  const handleEnter = () => {
    if (audioRef.current && !audioStarted) {
      audioRef.current.play()
        .then(() => setAudioStarted(true))
        .catch(() => {});
    }
    setHasEntered(true);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && audioRef.current) {
        audioRef.current.pause();
      } else if (!document.hidden && audioRef.current && audioStarted) {
        audioRef.current.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [audioStarted]);

  return (
    <div className="min-h-screen living-gradient-bg">
      <div className="gradient-blob blob-pink" aria-hidden="true" />
      <div className="gradient-blob blob-blue" aria-hidden="true" />
      <div className="gradient-blob blob-purple" aria-hidden="true" />
      <div className="grain-overlay" aria-hidden="true" />

      <audio ref={audioRef} src="/song.mp3" loop preload="auto" />

      {!hasEntered && <LoadingPortal onEnter={handleEnter} />}

      <div className="content-layer">
        {/* Hero */}
        <header className="pt-12 sm:pt-20 pb-8 text-center px-4" data-testid="header-section">
          <img
            src={logoPath}
            alt="DashKids Logo"
            className="w-40 sm:w-56 mx-auto mb-6"
            data-testid="main-logo"
          />
          <h1 className="text-3xl sm:text-5xl font-bold font-fredoka text-white uppercase tracking-[2px] mb-3" data-testid="text-tagline">
            1,555 Unique Characters
          </h1>
          <p className="text-base sm:text-lg font-fredoka text-white/50 uppercase tracking-[3px] mb-8">
            Running Wild on ApeChain
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 mb-10 flex-wrap">
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-4 sm:gap-8">
                <div className="text-center">
                  <p className="text-lg sm:text-2xl font-bold font-fredoka text-white">{stat.value}</p>
                  <p className="text-xs font-fredoka text-white/40 uppercase tracking-[2px]">{stat.label}</p>
                </div>
                {i < stats.length - 1 && (
                  <div className="w-px h-8 bg-white/10" />
                )}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href="https://opensea.io/collection/dashkids"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 text-sm sm:text-base font-bold font-fredoka bg-[#32CD32] text-black border-[3px] border-black rounded-full neo-brutal-shadow uppercase tracking-[1px]"
              data-testid="link-opensea-hero"
            >
              <Zap className="w-4 h-4" strokeWidth={2.5} />
              Buy on OpenSea
            </a>
          </div>
        </header>

        {/* Character marquee */}
        <CharacterMarquee />

        {/* Divider */}
        <div className="max-w-2xl mx-auto px-4">
          <div className="h-px bg-white/5" />
        </div>

        {/* Style swapper */}
        <StyleSwapper />

        {/* Divider */}
        <div className="max-w-2xl mx-auto px-4">
          <div className="h-px bg-white/5" />
        </div>

        {/* Navigation hub */}
        <NavigationHub />

        {/* Divider */}
        <div className="max-w-2xl mx-auto px-4">
          <div className="h-px bg-white/5" />
        </div>

        {/* Social + Footer */}
        <footer className="py-12 px-4 text-center" data-testid="footer">
          <p className="text-xs uppercase tracking-[4px] font-fredoka text-white/40 mb-6">
            Connect With Us
          </p>
          <div className="flex justify-center gap-3 flex-wrap mb-8" data-testid="social-dock-section">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200 text-white/60 hover:text-white"
                aria-label={link.label}
                data-testid={`social-${link.label.toLowerCase().replace(/[\s/]+/g, "-")}`}
              >
                {link.icon}
                <span className="text-sm font-fredoka font-bold uppercase tracking-[1px]">
                  {link.label}
                </span>
              </a>
            ))}
          </div>
          <p className="text-xs text-white/20 font-fredoka uppercase tracking-[2px]">
            © 2025 DashKids. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
