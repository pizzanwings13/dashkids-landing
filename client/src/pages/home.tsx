import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Rocket, Gamepad2, Trophy, Puzzle, Sparkles } from "lucide-react";
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
    href: "https://dashkidsmp.xyz",
    color: "bg-[#32CD32]",
    icon: Rocket,
    external: true,
  },
  {
    title: "GAMES",
    href: "https://tokenrush.live",
    color: "bg-[#00BFFF]",
    icon: Gamepad2,
    external: true,
  },
  {
    title: "STAKING",
    href: "https://dashkids.vercel.app/",
    color: "bg-[#FF69B4]",
    icon: Trophy,
    external: true,
  },
  {
    title: "PLAYGROUND",
    href: "https://playground.w3lp.io/collection/dashkids",
    color: "bg-[#FF8C00]",
    icon: Puzzle,
    external: true,
  },
  {
    title: "PIXEL ART",
    href: "/pixelart",
    color: "bg-[#9B30FF]",
    icon: Sparkles,
    external: false,
  },
];

const styleButtonColors = {
  DASHING: "bg-[#32CD32]",
  CHILLIN: "bg-[#00BFFF]",
  PORTRAIT: "bg-[#FF69B4]",
  ANIMATED: "bg-[#FF8C00]",
};

const socialLinks = [
  {
    href: "https://x.com/dashkidsnft?s=21",
    label: "X",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: "https://discord.gg/Y4gP9mFYns",
    label: "Discord",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.87-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    href: "https://opensea.io/collection/dashkids",
    label: "OpenSea",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zM5.92 12.403l.051-.081 3.123-4.884a.107.107 0 0 1 .187.014c.52 1.169.972 2.623.76 3.528-.088.372-.335.876-.614 1.342a2.405 2.405 0 0 1-.117.199.106.106 0 0 1-.09.045H6.013a.106.106 0 0 1-.093-.163zm13.914 1.68a.109.109 0 0 1-.065.101c-.243.103-1.07.485-1.414.962-.878 1.222-1.548 2.97-3.048 2.97H9.053a4.019 4.019 0 0 1-4.013-4.028v-.072c0-.058.048-.106.108-.106h3.485c.07 0 .12.063.115.132-.026.226.017.459.125.67.206.42.636.682 1.099.682h1.726v-1.347H9.99a.11.11 0 0 1-.089-.173l.063-.09c.16-.231.391-.586.621-.992.156-.274.308-.566.43-.858.024-.052.043-.107.065-.16.034-.089.067-.174.093-.259a6.42 6.42 0 0 0 .117-.566c.016-.102.023-.204.023-.304 0-.129-.007-.258-.016-.381a5.39 5.39 0 0 0-.034-.376 3.35 3.35 0 0 0-.063-.36l-.013-.065c-.016-.086-.031-.168-.05-.253a13.22 13.22 0 0 0-.174-.695l-.076-.27c-.074-.241-.157-.48-.251-.715a9.104 9.104 0 0 0-.212-.509c-.028-.065-.06-.129-.089-.193-.04-.086-.082-.165-.118-.241l-.097-.193-.088-.177a1.04 1.04 0 0 1-.057-.118l-.172-.315a.078.078 0 0 1 .089-.111l1.319.358h.01l.174.048.192.054.071.02v-1.14c0-.477.387-.865.866-.865.24 0 .456.097.612.253a.862.862 0 0 1 .253.612v1.69l.141.04c.01.005.023.011.034.02.04.027.098.065.172.117.058.043.12.094.193.15.147.117.322.272.513.449.05.048.098.094.143.141.239.228.509.499.779.804.074.086.147.174.218.262.074.091.152.18.222.274.091.117.188.241.277.372.043.063.089.129.131.193.117.177.222.36.318.545.04.079.078.163.113.245.108.238.192.481.25.724.02.063.032.129.043.193v.02c.016.074.023.153.029.23a1.89 1.89 0 0 1-.063.63 2.27 2.27 0 0 1-.078.258 2.18 2.18 0 0 1-.117.289c-.043.091-.091.188-.145.28a4.04 4.04 0 0 1-.539.73c-.046.06-.098.117-.15.18-.057.063-.117.122-.174.18-.079.082-.165.16-.251.235-.046.045-.098.091-.147.131-.046.043-.098.086-.147.125a4.2 4.2 0 0 1-.229.16l-.15.102a.084.084 0 0 1-.048.014h-1.06v1.347h1.332c.288 0 .563-.11.772-.306.065-.063.498-.45.912-.971a.11.11 0 0 1 .057-.035l4.185-1.21a.108.108 0 0 1 .134.103v.792z" />
      </svg>
    ),
  },
  {
    href: "https://magiceden.us/collections/apechain/0x7256de5b154e4242c989fa089c66f153f758335c",
    label: "Magic Eden",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
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

  const handleStyleChange = (style: keyof typeof styleImages) => {
    if (style === currentStyle || isAnimating) return;
    
    setIsAnimating(true);
    if (imageRef.current) {
      imageRef.current.classList.add("animate-squish");
    }
    
    setTimeout(() => {
      setCurrentStyle(style);
      setIsAnimating(false);
      if (imageRef.current) {
        imageRef.current.classList.remove("animate-squish");
      }
    }, 150);
  };

  const styles: (keyof typeof styleImages)[] = ["DASHING", "CHILLIN", "PORTRAIT", "ANIMATED"];

  return (
    <section className="flex flex-col items-center py-8 sm:py-12" data-testid="style-swapper-section">
      <h2 className="text-2xl sm:text-4xl font-bold font-fredoka mb-6 sm:mb-8 text-center uppercase tracking-[2px] px-4">
        Choose Your Style
      </h2>
      
      <div className="w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] border-[4px] sm:border-[5px] border-black rounded-2xl overflow-hidden neo-brutal-shadow bg-card mb-6 sm:mb-8" data-testid="style-swapper-container">
        <img
          ref={imageRef}
          src={styleImages[currentStyle]}
          alt={`DashKids ${currentStyle} style`}
          className="w-full h-full object-cover"
          data-testid="style-swapper-image"
        />
      </div>
      
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-2">
        {styles.map((style) => (
          <button
            key={style}
            onClick={() => handleStyleChange(style)}
            className={`px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-lg font-bold font-fredoka border-[3px] sm:border-[5px] border-black rounded-full cursor-pointer neo-brutal-shadow uppercase tracking-[1px] ${
              styleButtonColors[style]
            } ${currentStyle === style ? "text-black" : "text-black"}`}
            data-testid={`button-style-${style.toLowerCase()}`}
          >
            {style}
          </button>
        ))}
      </div>
    </section>
  );
}

function NavigationHub() {
  const cardClass = (color: string) =>
    `${color} aspect-square flex flex-col items-center justify-center gap-2 sm:gap-3 border-[3px] sm:border-[5px] border-black rounded-xl sm:rounded-2xl neo-brutal-shadow cursor-pointer p-3 sm:p-4`;

  return (
    <section className="py-8 sm:py-12 px-4" data-testid="navigation-hub-section">
      <h2 className="text-2xl sm:text-4xl font-bold font-fredoka mb-6 sm:mb-8 text-center uppercase tracking-[2px]">
        Explore DashKids
      </h2>
      
      <div className="grid grid-cols-2 gap-3 sm:gap-8 max-w-2xl mx-auto">
        {navCards.map((card) => {
          const IconComponent = card.icon;
          const content = (
            <>
              <IconComponent className="w-10 h-10 sm:w-16 sm:h-16 text-black" strokeWidth={2.5} />
              <span className="text-sm sm:text-xl font-bold font-fredoka text-black text-center uppercase tracking-[1px]">
                {card.title}
              </span>
            </>
          );

          if (card.external) {
            return (
              <a
                key={card.title}
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClass(card.color)}
                data-testid={`card-${card.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {content}
              </a>
            );
          }

          return (
            <Link key={card.title} href={card.href}>
              <div
                className={cardClass(card.color)}
                data-testid={`card-${card.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {content}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function SocialDock() {
  return (
    <section className="py-8 sm:py-12" data-testid="social-dock-section">
      <h2 className="text-2xl sm:text-4xl font-bold font-fredoka mb-6 sm:mb-8 text-center uppercase tracking-[2px] px-4">
        Connect With Us
      </h2>
      
      <div className="flex justify-center gap-3 sm:gap-6 flex-wrap px-4">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-white border-[3px] sm:border-[5px] border-black rounded-full neo-brutal-shadow cursor-pointer text-black"
            aria-label={link.label}
            data-testid={`social-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {link.icon}
          </a>
        ))}
      </div>
    </section>
  );
}

function CharacterRunner() {
  return (
    <section className="py-8 overflow-hidden" data-testid="character-runner-section">
      <div className="flex animate-marquee">
        {[...characterImages, ...characterImages].map((src, index) => (
          <div key={index} className="flex-shrink-0 mx-2">
            <img
              src={src}
              alt={`DashKids character ${index + 1}`}
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
              data-testid={`runner-character-${index}`}
            />
          </div>
        ))}
      </div>
    </section>
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
      {/* Animated gradient blobs */}
      <div className="gradient-blob blob-pink" aria-hidden="true" />
      <div className="gradient-blob blob-blue" aria-hidden="true" />
      <div className="gradient-blob blob-purple" aria-hidden="true" />
      
      {/* Film grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />
      
      <audio ref={audioRef} src="/song.mp3" loop preload="auto" />
      
      {!hasEntered && <LoadingPortal onEnter={handleEnter} />}
      
      <div className="max-w-4xl mx-auto px-4 content-layer">
        <header className="pt-6 sm:pt-8 pb-4 text-center" data-testid="header-section">
          <img
            src={logoPath}
            alt="DashKids Logo"
            className="w-40 sm:w-64 mx-auto mb-3 sm:mb-4"
            data-testid="main-logo"
          />
          <p className="text-base sm:text-2xl font-bold font-fredoka text-muted-foreground uppercase tracking-[1px] sm:tracking-[2px] px-4" data-testid="text-tagline">
            1,555 Unique Characters Running Wild
          </p>
        </header>

        <StyleSwapper />
        <NavigationHub />
        <SocialDock />
      </div>

      <div className="content-layer">
        <CharacterRunner />
      </div>

      <footer className="py-6 text-center text-sm text-muted-foreground content-layer" data-testid="footer">
        © 2025 DashKids. All rights reserved.
      </footer>
    </div>
  );
}
