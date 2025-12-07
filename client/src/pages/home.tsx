import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap } from "lucide-react";
import logoPath from "@assets/dashkids logo_1763859062109.png";

const galleryImages = [
  {
    src: "https://dpw988cyzvmfj.cloudfront.net/images/682de984e849486088a93ea5/1140.png",
    alt: "DashKids Dashing Version - Original running character style",
    label: "Dashing",
  },
  {
    src: "https://dpw988cyzvmfj.cloudfront.net/images/682de984e849486088a93ea5/Chilling/1140.png",
    alt: "DashKids Chillin Version - Relaxed character style",
    label: "Chillin",
  },
  {
    src: "https://dpw988cyzvmfj.cloudfront.net/images/682de984e849486088a93ea5/Portrait/1140.png",
    alt: "DashKids Portrait Version - Clean headshot style",
    label: "Portrait",
  },
  {
    src: "https://dpw988cyzvmfj.cloudfront.net/images/682de984e849486088a93ea5/Animated/1140.gif",
    alt: "DashKids Animated Version - Moving character animation",
    label: "Animated",
  },
];

const socialLinks = [
  {
    href: "https://magiceden.us/collections/apechain/0x7256de5b154e4242c989fa089c66f153f758335c",
    label: "Magic Eden",
    className: "bg-primary text-primary-foreground",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    href: "https://opensea.io/collection/dashkids",
    label: "OpenSea",
    className: "bg-secondary text-secondary-foreground",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    ),
  },
  {
    href: "https://x.com/dashkidsnft?s=21",
    label: "X (Twitter)",
    className: "bg-foreground text-background",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: "https://dashkids.vercel.app/",
    label: "Staking",
    className: "bg-primary text-primary-foreground",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
      </svg>
    ),
  },
  {
    href: "https://playground.w3lp.io/collection/dashkids",
    label: "Playground",
    className: "bg-secondary text-secondary-foreground",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.5 16.5v-9l7 4.5-7 4.5z" />
      </svg>
    ),
  },
  {
    href: "https://discord.gg/Y4gP9mFYns",
    label: "Discord",
    className: "bg-accent text-accent-foreground",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.87-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
];

function SpeedLines() {
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
      <div className="absolute h-2 rounded opacity-25 bg-gradient-to-r from-transparent via-primary to-transparent animate-dash-1" style={{ top: "8%", width: "180px" }} />
      <div className="absolute h-2 rounded opacity-25 bg-gradient-to-r from-transparent via-primary to-transparent animate-dash-2" style={{ top: "20%", width: "140px" }} />
      <div className="absolute h-2 rounded opacity-25 bg-gradient-to-r from-transparent via-primary to-transparent animate-dash-3" style={{ top: "35%", width: "200px" }} />
      <div className="absolute h-2 rounded opacity-25 bg-gradient-to-r from-transparent via-primary to-transparent animate-dash-4" style={{ top: "50%", width: "160px" }} />
      <div className="absolute h-2 rounded opacity-25 bg-gradient-to-r from-transparent via-primary to-transparent animate-dash-5" style={{ top: "65%", width: "190px" }} />
      <div className="absolute h-2 rounded opacity-25 bg-gradient-to-r from-transparent via-primary to-transparent animate-dash-6" style={{ top: "80%", width: "150px" }} />
      <div className="absolute h-2 rounded opacity-25 bg-gradient-to-r from-transparent via-primary to-transparent animate-dash-7" style={{ top: "92%", width: "170px" }} />
    </div>
  );
}

function LogoHeader() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="mb-2">
      <h1 className="sr-only">DashKids NFT Collection</h1>
      <img
        src={logoPath}
        alt="DashKids Logo"
        className={`max-w-[280px] sm:max-w-[400px] w-full mx-auto transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
        onLoad={() => setLoading(false)}
        data-testid="image-logo"
      />
    </div>
  );
}

function GalleryImage({ src, alt, label }: { src: string; alt: string; label: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="group" data-testid={`gallery-item-${label.toLowerCase()}`}>
      <Card className="border-4 border-foreground shadow-[6px_6px_0_hsl(var(--foreground))] transition-all duration-200 hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[9px_9px_0_hsl(var(--foreground))]">
        <div className="relative aspect-square bg-card overflow-hidden">
          {loading && !error && (
            <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
          )}
          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <span className="font-bangers text-lg text-foreground/70">Image Loading...</span>
              <span className="text-sm text-muted-foreground mt-2">{label}</span>
            </div>
          ) : (
            <img
              src={src}
              alt={alt}
              loading="lazy"
              className={`w-full h-full object-cover transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setError(true);
              }}
              data-testid={`image-${label.toLowerCase()}`}
            />
          )}
        </div>
        <div className="bg-card p-3 text-center border-t-4 border-foreground">
          <span className="font-bangers text-lg tracking-wide text-foreground" data-testid={`label-${label.toLowerCase()}`}>
            {label}
          </span>
        </div>
      </Card>
    </div>
  );
}

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SpeedLines />

      <div className="relative z-10 max-w-[1100px] mx-auto px-5 py-10">
        <header className="text-center mb-12" data-testid="header-section">
          <LogoHeader />
          <p className="font-bangers text-2xl sm:text-3xl text-foreground tracking-[3px] flex items-center justify-center gap-2" data-testid="text-tagline">
            <Zap className="w-6 h-6 sm:w-7 sm:h-7 fill-foreground" />
            <span>RUN WITH US</span>
            <Zap className="w-6 h-6 sm:w-7 sm:h-7 fill-foreground" />
          </p>
          <Button
            onClick={() => navigate("/coloring")}
            className="mt-6 min-h-[52px] font-bold text-base border-4 border-foreground shadow-[5px_5px_0_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_hsl(var(--foreground))] active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0_hsl(var(--foreground))] transition-all duration-200 bg-primary text-primary-foreground"
            data-testid="button-coloring-studio"
          >
            🎨 Open Coloring Studio
          </Button>
        </header>

        <section className="mb-12" data-testid="about-section">
          <Card className="border-4 border-foreground shadow-[8px_8px_0_hsl(var(--foreground))] p-8 sm:p-10">
            <h2 className="font-bangers text-3xl sm:text-4xl text-primary mb-4 tracking-wide flex items-center gap-2" data-testid="heading-story">
              <Zap className="w-7 h-7 sm:w-8 sm:h-8 fill-primary" />
              <span>The Story</span>
            </h2>
            <div className="space-y-4 text-base sm:text-lg leading-relaxed text-foreground font-semibold">
              <p data-testid="text-story-paragraph-1">
                DashKids is a 1,555-piece generative collection built with the pulse of old-school craft and the spark of tomorrow. Each kid carries its own swagger, its own rhythm, its own little legend. And I wasn't about to cage that spirit in a single art style. Tradition teaches us to honor variety, to let characters breathe—so holders get four full versions at no extra cost: the original <strong>Dashing</strong>, the laid-back <strong>Chillin</strong>, the clean <strong>Portrait</strong>, and the kinetic <strong>Animated</strong> GIF. Because art isn't about locking you in. It's about giving you choices that vibe with the moment.
              </p>
              <p data-testid="text-story-paragraph-2">
                These kids don't just stand still. They run—toward something real. DashKids is built for the long haul with a roadmap that's already in motion: staking rewards earned through genuine engagement, a fully playable game launching soon, and tools that put creative power back in the hands of holders. No smoke, no fluff. Just momentum.
              </p>
              <p className="italic" data-testid="text-story-closing">
                A collection made with heart, built for the long road ahead.
              </p>
            </div>
          </Card>
        </section>

        <section className="mb-12" data-testid="gallery-section">
          <h2 className="font-bangers text-3xl sm:text-4xl text-foreground text-center mb-8 tracking-wide flex items-center justify-center gap-2" data-testid="heading-gallery">
            <Zap className="w-7 h-7 sm:w-8 sm:h-8 fill-foreground" />
            <span>Four Versions, One Legend</span>
            <Zap className="w-7 h-7 sm:w-8 sm:h-8 fill-foreground" />
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {galleryImages.map((image) => (
              <GalleryImage key={image.label} {...image} />
            ))}
          </div>
        </section>

        <section className="mb-12" data-testid="links-section">
          <h2 className="font-bangers text-3xl sm:text-4xl text-foreground text-center mb-8 tracking-wide flex items-center justify-center gap-2" data-testid="heading-links">
            <Zap className="w-7 h-7 sm:w-8 sm:h-8 fill-foreground" />
            <span>Join The Run</span>
            <Zap className="w-7 h-7 sm:w-8 sm:h-8 fill-foreground" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-[900px] mx-auto">
            {socialLinks.map((link) => (
              <Button
                key={link.label}
                asChild
                className={`min-h-[52px] font-bold text-base border-4 border-foreground shadow-[5px_5px_0_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_hsl(var(--foreground))] active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0_hsl(var(--foreground))] transition-all duration-200 ${link.className}`}
                data-testid={`button-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <a href={link.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2.5">
                  {link.icon}
                  <span>{link.label}</span>
                </a>
              </Button>
            ))}
          </div>
        </section>

        <footer className="text-center text-sm text-foreground/70 mt-16" data-testid="footer">
          © 2025 DashKids. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
