/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Youtube,
  Linkedin,
  Instagram,
  Facebook,
  Link2,
  Copy,
  Check,
  AlertCircle,
  X,
  Share2,
  Github,
  MessageSquare,
  QrCode,
  ClipboardPaste,
} from "lucide-react";
import {
  parseUrl,
  encodeDeepLinkId,
  ParsedUrl,
  Platform,
} from "@/lib/url-parser";
import dynamic from "next/dynamic";

// ⚡ Bolt: Dynamically import QRCodeSVG to reduce initial bundle size
// It's only needed when the user explicitly clicks the QR code button.
const QRCodeSVG = dynamic(() => import("qrcode.react").then((mod) => mod.QRCodeSVG), { ssr: false });

function XLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 3.827H5.078z"></path>
    </svg>
  );
}

function TikTokLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-1.13 4.49-2.92 5.89-1.72 1.34-4.08 1.83-6.18 1.25-2.09-.58-3.8-2.12-4.66-4.11-.86-2-1.02-4.32-.42-6.39.6-2.07 2.14-3.77 4.13-4.63 1.99-.86 4.31-1.02 6.38-.42v4.01c-1.05-.38-2.25-.33-3.25.13-1 .46-1.78 1.31-2.16 2.33-.38 1.02-.33 2.25.13 3.25.46 1 1.31 1.78 2.33 2.16 1.02.38 2.25.33 3.25-.13 1-.46 1.78-1.31 2.16-2.33.15-.4.24-.83.26-1.27V.02z" />
    </svg>
  );
}

function SpotifyLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.781-.18-.6.18-1.2.78-1.38 4.2-1.32 11.28-1.02 15.72 1.62.539.3.719 1.02.419 1.56-.299.42-1.02.599-1.619.3z" />
    </svg>
  );
}

function PlatformIcon({
  platform,
  className = "w-6 h-6",
}: {
  platform: Platform;
  className?: string;
}) {
  switch (platform) {
    case "youtube":
      return <Youtube className={className} />;
    case "x":
      return <XLogo className={className} />;
    case "linkedin":
      return <Linkedin className={className} />;
    case "instagram":
      return <Instagram className={className} />;
    case "facebook":
      return <Facebook className={className} />;
    case "tiktok":
      return <TikTokLogo className={className} />;
    case "spotify":
      return <SpotifyLogo className={className} />;
    default:
      return <Link2 className={className} />;
  }
}

export default function Home() {
  const [input, setInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");
  const [parsed, setParsed] = useState<ParsedUrl | null>(null);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [appShared, setAppShared] = useState(false);
  const [appUrl, setAppUrl] = useState(() => {
    if (typeof window !== "undefined") {
      return process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    }
    return "";
  });
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<{
    title?: string;
    description?: string;
    image?: string;
  } | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [copyFallback, setCopyFallback] = useState<string | null>(null);
  const fallbackInputRef = useRef<HTMLInputElement>(null);
  const [recentDrops, setRecentDrops] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedDrops = localStorage.getItem("recentDrops");
        return savedDrops ? JSON.parse(savedDrops) : [];
      } catch (e) {
        console.error("Failed to load from local storage", e);
        return [];
      }
    }
    return [];
  });
  const [dodges, setDodges] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const savedDodges = localStorage.getItem("dodges");
        return savedDodges ? parseInt(savedDodges, 10) : 0;
      } catch (e) {
        console.error("Failed to load from local storage", e);
        return 0;
      }
    }
    return 0;
  });
  const [showQR, setShowQR] = useState(false);
  const mainInputRef = useRef<HTMLInputElement>(null);
  const loadingTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
          document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Save local storage
  useEffect(() => {
    try {
      localStorage.setItem("recentDrops", JSON.stringify(recentDrops));
      localStorage.setItem("dodges", dodges.toString());
    } catch (e) {
      console.error("Failed to save to local storage", e);
    }
  }, [recentDrops, dodges]);

  // Typewriter placeholder
  useEffect(() => {
    const placeholders = [
      "Paste YouTube, X, LinkedIn URL...",
      "Drop the IG reel here...",
      "Paste that viral X thread...",
      "Link the 3-hour YouTube essay...",
      "Drop the TikTok here...",
      "Paste the Spotify track...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % placeholders.length;
      if (mainInputRef.current) {
        mainInputRef.current.placeholder = placeholders[i];
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Loading text cycler
  useEffect(() => {
    if (!isLoadingPreview) return;
    const texts = [
      "Cooking...",
      "Checking the vibes...",
      "Summoning the app...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % texts.length;
      if (loadingTextRef.current) {
        loadingTextRef.current.textContent = texts[i];
      }
    }, 800);
    return () => clearInterval(interval);
  }, [isLoadingPreview]);

  // Debounce input to optimize performance
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedInput(input), 250);
    return () => clearTimeout(timer);
  }, [input]);

  useEffect(() => {
    const processInput = () => {
      if (!debouncedInput) {
        setParsed(null);
        setError(null);
        return;
      }

      let urlToTest = debouncedInput.trim();
      if (
        !urlToTest.startsWith("http://") &&
        !urlToTest.startsWith("https://")
      ) {
        urlToTest = "https://" + urlToTest;
      }

      try {
        const urlObj = new URL(urlToTest);
        const supportedDomains = [
          "youtube.com",
          "youtu.be",
          "twitter.com",
          "x.com",
          "linkedin.com",
          "instagram.com",
          "facebook.com",
          "fb.com",
          "tiktok.com",
          "spotify.com",
        ];

        const isSupportedDomain = supportedDomains.some((domain) =>
          urlObj.hostname.toLowerCase().includes(domain),
        );

        if (!isSupportedDomain) {
          setParsed(null);
          setError(
            "Platform not supported. We currently support YouTube, X, LinkedIn, Instagram, Facebook, TikTok, and Spotify.",
          );
          return;
        }

        const result = parseUrl(urlToTest);
        if (result.platform !== "unknown") {
          setParsed(result);
          setError(null);
          setIsLoadingPreview(true);
          setPreviewData(null);

          // Subtle haptic feedback when a valid URL is detected
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(15);
          }
        } else {
          setParsed(null);
          setError(
            "Could not extract ID from this URL. Please ensure it's a valid post or profile link.",
          );
        }
      } catch {
        setParsed(null);
        setError("Invalid URL format. Please enter a valid link.");
      }
    };

    processInput();
  }, [debouncedInput]);

  useEffect(() => {
    if (parsed) {
      fetch(
        `${appUrl}/api/preview?url=${encodeURIComponent(parsed.originalUrl)}`,
      )
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setPreviewData(data);
          }
        })
        .catch((err) => console.error("Failed to fetch preview:", err))
        .finally(() => setIsLoadingPreview(false));
    } else {
      setTimeout(() => {
        setPreviewData(null);
        setIsLoadingPreview(false);
      }, 0);
    }
  }, [parsed, appUrl]);

  const triggerConfetti = useCallback(async (color: string) => {
    // ⚡ Bolt: Dynamically import canvas-confetti to reduce initial bundle size
    // It's only needed when a successful drop action occurs.
    const confetti = (await import("canvas-confetti")).default;
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: [color, "#ffffff"],
    });
  }, []);

  const addToRecentDrops = useCallback((url: string) => {
    setRecentDrops((prev) => {
      const newDrops = [url, ...prev.filter((d) => d !== url)].slice(0, 10);
      return newDrops;
    });
  }, []);

  const handleCopy = useCallback(async () => {
    if (!parsed) return;
    const encoded = encodeDeepLinkId(parsed);
    const link = `${appUrl}/open/${encoded}`;

    try {
      await navigator.clipboard.writeText(link);

      // Satisfying haptic feedback pattern for supported mobile devices
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([40, 30, 40]);
      }

      triggerConfetti(parsed.color);
      setDodges((prev) => prev + 1);
      addToRecentDrops(parsed.originalUrl);

      setCopied(true);
      setCopyFallback(null);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      setCopyFallback(link);
      // Focus the input in the next tick
      setTimeout(() => {
        if (fallbackInputRef.current) {
          fallbackInputRef.current.select();
        }
      }, 0);
    }
  }, [parsed, appUrl, triggerConfetti, addToRecentDrops]);

  const handleShare = useCallback(async () => {
    if (!parsed) return;
    const encoded = encodeDeepLinkId(parsed);
    const link = `${appUrl}/open/${encoded}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Open in App",
          text: "Click to open this link directly in the app!",
          url: link,
        });

        triggerConfetti(parsed.color);
        setDodges((prev) => prev + 1);
        addToRecentDrops(parsed.originalUrl);

        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Fallback to copy if share is not supported
      handleCopy();
    }
  }, [parsed, appUrl, handleCopy, triggerConfetti, addToRecentDrops]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInput(text);
      }
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
      setError("Clipboard access blocked. Please paste manually (Cmd/Ctrl+V).");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleShareApp = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Instant App Opener",
          text: "Open social media links directly in their native apps instead of the browser!",
          url: appUrl,
        });
        setAppShared(true);
        setTimeout(() => setAppShared(false), 2000);
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(appUrl);
      setAppShared(true);
      setTimeout(() => setAppShared(false), 2000);
    }
  }, [appUrl]);

  const handleClear = () => {
    setInput("");
    setDebouncedInput("");
    setParsed(null);
    setError(null);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!parsed) return;

      // Check if Ctrl or Cmd is pressed
      const isModifierPressed = e.ctrlKey || e.metaKey;

      if (isModifierPressed) {
        if (e.key.toLowerCase() === "c") {
          // Prevent default copy if we have a parsed link to copy instead
          e.preventDefault();
          handleCopy();
        } else if (e.key.toLowerCase() === "s") {
          // Prevent default save
          e.preventDefault();
          handleShare();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [parsed, handleCopy, handleShare]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col p-4 font-sans selection:bg-white/20 relative">
      {/* GitHub Icon */}
      <a
        href="https://github.com/dhaatrik/instant-app-opener"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-6 right-6 z-50 text-white/40 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] rounded-full"
        aria-label="GitHub Repository"
      >
        <Github className="w-6 h-6" />
      </a>

      {/* Background ambient light */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <motion.div
          className="w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 transition-colors duration-1000"
          animate={{
            backgroundColor: parsed
              ? parsed.color
              : error
                ? "#ef4444"
                : "rgba(0,0,0,0)",
          }}
        />
      </div>

      {/* Cursor Depth Effect */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300 opacity-50"
        style={{
          backgroundImage: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-3xl mx-auto gap-12 z-10 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-6"
        >
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 leading-tight">
            Open Links <br /> Directly in App
          </h1>
          <p className="text-white/40 text-lg md:text-xl max-w-xl mx-auto font-light tracking-wide">
            Shared links opening in browser is an L. Paste it here to open
            directly in-app. No cap.
          </p>
        </motion.div>

        <div className="w-full space-y-6">
          <div className="relative">
            <motion.div
              className={`relative w-full rounded-3xl transition-all duration-700 ease-out bg-white/5 backdrop-blur-2xl border hover:bg-white/10 focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/30 ${
                parsed
                  ? parsed.glowClass
                  : error
                    ? "border-red-500/50 shadow-[0_0_40px_-15px_rgba(239,68,68,0.4)]"
                    : "border-white/10 shadow-none hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)]"
              }`}
              animate={{
                scale: parsed ? 1.02 : error ? 0.98 : 1,
              }}
              whileHover={{ scale: parsed ? 1.03 : error ? 0.99 : 1.01 }}
            >
              <input
                ref={mainInputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste YouTube, X, TikTok, Spotify URL..."
                aria-label="Paste app link URL here"
                className="w-full bg-transparent text-xl md:text-2xl p-6 md:p-8 pr-[120px] md:pr-[140px] outline-none placeholder:text-white/20 font-light"
              />
              {/* Icons inside input */}
              <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 flex items-center p-1.5 rounded-2xl bg-[#050505]/60 backdrop-blur-xl border border-white/10 shadow-2xl">
                <AnimatePresence>
                  {!input && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.5, width: 0 }}
                      animate={{ opacity: 1, scale: 1, width: "auto" }}
                      exit={{ opacity: 0, scale: 0.5, width: 0 }}
                      onClick={handlePaste}
                      className="text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/10 p-1.5 mr-1 overflow-hidden flex items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
                      title="Paste"
                      aria-label="Paste URL"
                    >
                      <ClipboardPaste className="w-5 h-5 shrink-0" />
                    </motion.button>
                  )}
                  {input && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.5, width: 0 }}
                      animate={{ opacity: 1, scale: 1, width: "auto" }}
                      exit={{ opacity: 0, scale: 0.5, width: 0 }}
                      onClick={handleClear}
                      className="text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/10 p-1.5 mr-1 overflow-hidden flex items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
                      title="Clear"
                      aria-label="Clear input"
                    >
                      <X className="w-5 h-5 shrink-0" />
                    </motion.button>
                  )}
                </AnimatePresence>

                <div
                  className="flex items-center justify-center w-11 h-11 md:w-13 md:h-13 transition-all duration-500 rounded-xl shrink-0 shadow-inner"
                  style={{
                    color: parsed
                      ? parsed.color
                      : error
                        ? "#ef4444"
                        : "rgba(255,255,255,0.4)",
                    backgroundColor: parsed
                      ? `${parsed.color}20`
                      : error
                        ? "rgba(239,68,68,0.15)"
                        : "rgba(255,255,255,0.05)",
                  }}
                >
                  {error ? (
                    <AlertCircle className="w-6 h-6 md:w-7 md:h-7" />
                  ) : (
                    <PlatformIcon
                      platform={parsed ? parsed.platform : "unknown"}
                      className="w-6 h-6 md:w-7 md:h-7"
                    />
                  )}
                </div>
              </div>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 16, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  className="absolute left-0 right-0 text-red-400 font-medium tracking-wide flex items-start md:items-center justify-center gap-2 px-4"
                  role="alert"
                  aria-live="polite"
                >
                  <AlertCircle className="w-5 h-5 md:w-6 md:h-6 shrink-0 mt-0.5 md:mt-0" />
                  <span className="text-left md:text-center text-sm md:text-base leading-snug">
                    {error}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Recent Drops */}
            {recentDrops.length > 0 && !parsed && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-wrap items-center justify-center gap-2 mt-6"
              >
                <span className="text-xs text-white/40 uppercase tracking-widest mr-2">
                  Recent Drops:
                </span>
                {recentDrops.map((drop, idx) => {
                  try {
                    const url = new URL(drop);
                    return (
                      <button
                        key={idx}
                        onClick={() => setInput(drop)}
                        className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors truncate max-w-[150px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
                      >
                        {url.hostname.replace("www.", "")}
                      </button>
                    );
                  } catch {
                    return null;
                  }
                })}
              </motion.div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {parsed && (
              <motion.div
                key="preview-card"
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full mt-8"
              >
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-10 relative group shadow-2xl">
                  {/* Subtle gradient border effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
                    style={{
                      backgroundImage: `radial-gradient(circle at center, ${parsed.color}25 0%, transparent 70%)`,
                    }}
                  />

                  <div className="flex items-center gap-6 z-10 w-full lg:w-auto flex-1 min-w-0">
                    <div className="relative shrink-0">
                      <div
                        className="w-24 h-24 rounded-3xl bg-white/10 flex items-center justify-center border border-white/20 shadow-2xl backdrop-blur-md relative overflow-hidden"
                        style={{ color: parsed.color }}
                      >
                        {previewData?.image ? (
                          <img
                            src={previewData.image}
                            alt="Preview"
                            className="absolute inset-0 w-full h-full object-contain opacity-90"
                          />
                        ) : (
                          <>
                            <div
                              className="absolute inset-0 opacity-25"
                              style={{ backgroundColor: parsed.color }}
                            />
                            <PlatformIcon
                              platform={parsed.platform}
                              className="w-12 h-12 relative z-10 drop-shadow-xl"
                            />
                          </>
                        )}
                      </div>

                      {/* Animated Success Indicator - Moved outside overflow-hidden to prevent truncation */}
                      <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 z-20">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500 border-2 border-[#050505]"></span>
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-bold text-3xl capitalize tracking-tight text-white/95 truncate">
                          {parsed.platform}
                        </h3>
                        <span className="shrink-0 whitespace-nowrap px-3 py-1 rounded-full bg-green-500/15 text-green-400 text-[11px] uppercase tracking-widest font-bold border border-green-500/30 shadow-lg shadow-green-500/10">
                          Certified App
                        </span>
                      </div>
                      {isLoadingPreview ? (
                        <div className="flex items-center gap-3 mt-3">
                          <div className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white/90 animate-spin" />
                          <p ref={loadingTextRef} className="text-white/70 text-base font-medium">
                            Cooking...
                          </p>
                        </div>
                      ) : previewData?.title ? (
                        <p className="text-white/90 text-base font-medium leading-relaxed">
                          {previewData.title}
                        </p>
                      ) : (
                        <p className="text-white/50 text-sm break-all font-mono opacity-80">
                          {parsed.originalUrl}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto z-10 shrink-0 mt-6 lg:mt-0">
                    <motion.button
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ y: 2, scale: 0.98 }}
                      animate={
                        copied
                          ? {
                              scale: [1, 0.95, 1.05, 1],
                            }
                          : { scale: 1 }
                      }
                      transition={{
                        duration: 0.4,
                        times: [0, 0.2, 0.5, 1],
                        ease: "easeInOut",
                      }}
                      onClick={handleCopy}
                      className={`group relative overflow-hidden flex shrink-0 items-center gap-2 px-6 py-4 rounded-xl font-medium transition-all w-full sm:w-auto justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),_0_4px_10px_rgba(0,0,0,0.4)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),_0_12px_24px_rgba(0,0,0,0.6),_0_0_20px_rgba(255,255,255,0.3)] active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] ${copied ? "bg-green-500 text-white hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),_0_12px_24px_rgba(0,0,0,0.6),_0_0_20px_rgba(34,197,94,0.4)]" : "bg-white text-black hover:bg-gray-50"}`}
                    >
                      <div
                        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                        style={{
                          backgroundImage: `radial-gradient(120px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(0,0,0,0.08), transparent 100%)`,
                          backgroundAttachment: "fixed",
                        }}
                      />
                      <div className="relative z-10 flex items-center gap-2">
                        {copied ? (
                          <>
                            <Check className="w-5 h-5" />
                            <span>Link Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-5 h-5" />
                            <span>Copy Link</span>
                            <span className="hidden md:inline-flex items-center justify-center px-1.5 py-0.5 ml-1 text-[10px] font-mono font-bold text-black/40 bg-black/5 rounded border border-black/10">
                              ⌘C
                            </span>
                          </>
                        )}
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ y: 2, scale: 0.98 }}
                      onClick={handleShare}
                      className="group relative overflow-hidden flex shrink-0 items-center gap-2 px-6 py-4 rounded-xl font-medium transition-all w-full sm:w-auto justify-center bg-white/10 text-white hover:bg-white/20 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_10px_rgba(0,0,0,0.4)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_12px_24px_rgba(0,0,0,0.6),_0_0_20px_rgba(255,255,255,0.15)] active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
                    >
                      <div
                        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                        style={{
                          backgroundImage: `radial-gradient(120px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255,255,255,0.15), transparent 100%)`,
                          backgroundAttachment: "fixed",
                        }}
                      />
                      <div className="relative z-10 flex items-center gap-2">
                        {shared ? (
                          <Check className="w-5 h-5 text-green-400" />
                        ) : (
                          <Share2 className="w-5 h-5" />
                        )}
                        <span>Share</span>
                        {!shared && (
                          <span className="hidden md:inline-flex items-center justify-center px-1.5 py-0.5 ml-1 text-[10px] font-mono font-bold text-white/40 bg-white/5 rounded border border-white/10">
                            ⌘S
                          </span>
                        )}
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ y: 2, scale: 0.98 }}
                      onClick={() => setShowQR(true)}
                      className="group relative overflow-hidden flex shrink-0 items-center gap-2 px-4 py-4 rounded-xl font-medium transition-all w-full sm:w-auto justify-center bg-white/10 text-white hover:bg-white/20 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_10px_rgba(0,0,0,0.4)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_12px_24px_rgba(0,0,0,0.6),_0_0_20px_rgba(255,255,255,0.15)]"
                      title="Show QR Code"
                      aria-label="Show QR Code"
                    >
                      <QrCode className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* QR Code Modal */}
                <AnimatePresence>
                  {showQR && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl p-6"
                    >
                      <div
                        className="bg-white p-6 rounded-2xl flex flex-col items-center gap-4 relative"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="qr-modal-title"
                      >
                        <button
                          onClick={() => setShowQR(false)}
                          className="absolute top-2 right-2 text-black/40 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-full p-1"
                          aria-label="Close QR Code"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <div id="qr-code-container">
                          <QRCodeSVG
                            value={`${appUrl}/open/${encodeDeepLinkId(parsed)}`}
                            size={200}
                          />
                        </div>
                        <p id="qr-modal-title" className="text-black/60 text-sm font-medium">
                          Scan the Sauce
                        </p>
                        <button
                          onClick={() => {
                            const svg = document.querySelector(
                              "#qr-code-container svg",
                            );
                            if (svg) {
                              const svgData =
                                new XMLSerializer().serializeToString(svg);
                              const canvas = document.createElement("canvas");
                              const ctx = canvas.getContext("2d");
                              const img = new Image();
                              img.onload = () => {
                                canvas.width = img.width;
                                canvas.height = img.height;
                                ctx?.drawImage(img, 0, 0);
                                const pngFile = canvas.toDataURL("image/png");
                                const downloadLink =
                                  document.createElement("a");
                                downloadLink.download =
                                  "instant-app-opener-qr.png";
                                downloadLink.href = `${pngFile}`;
                                downloadLink.click();
                              };
                              img.src =
                                "data:image/svg+xml;base64," +
                                btoa(unescape(encodeURIComponent(svgData)));
                            }
                          }}
                          className="mt-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                        >
                          Download QR
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Copy Fallback UI */}
                <AnimatePresence>
                  {copyFallback && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                        <p className="text-sm text-yellow-400 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Copy failed, that&apos;s an L. Do it manually, bestie:
                        </p>
                        <div className="flex gap-2">
                          <input
                            ref={fallbackInputRef}
                            type="text"
                            readOnly
                            value={copyFallback}
                            aria-label="Fallback deep link URL"
                            className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 outline-none focus:border-white/30 selection:bg-white/30"
                          />
                          <button
                            onClick={() => {
                              if (fallbackInputRef.current) {
                                fallbackInputRef.current.select();
                                document.execCommand("copy");
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                              }
                            }}
                            className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
                          >
                            <Copy className="w-4 h-4" />
                            Copy
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Share App & Feedback Section */}
      <div className="mt-auto pt-12 pb-4 flex flex-col items-center justify-center z-10 gap-6">
        <div className="flex flex-col items-center">
          <p className="text-white/40 text-sm mb-4 text-center max-w-md">
            Vibing with Instant App Opener? Share the sauce with your friends
            and mutuals.
          </p>
          <button
            onClick={handleShareApp}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
          >
            {appShared ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
            {appShared ? "Shared!" : "Share Instant App Opener"}
          </button>
        </div>

        <div className="flex flex-col items-center w-full max-w-md">
          <button
            onClick={() => setShowFeedback(!showFeedback)}
            className="flex items-center gap-2 px-4 py-2 text-white/40 hover:text-white/80 transition-colors text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] rounded-full"
          >
            <MessageSquare className="w-4 h-4" />
            Send Feedback
          </button>

          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden w-full"
              >
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-4">
                  <p className="text-sm text-white/60 text-center">
                    Got suggestions or found a bug? Slide into the
                    developer&apos;s DMs.
                  </p>
                  <div className="flex items-center gap-4">
                    <a
                      href="https://x.com/dhaatrik"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
                      aria-label="X (Twitter)"
                    >
                      <XLogo className="w-5 h-5" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/dhaatrik/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-[#0a66c2] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-4 pt-4 text-white/20 text-xs font-mono tracking-widest uppercase text-center px-4 z-10 flex flex-col gap-2">
        <span>
          Currently supports YouTube, X, LinkedIn, Instagram, Facebook, TikTok &
          Spotify
        </span>
        {dodges > 0 && (
          <span className="text-white/40">
            You&apos;ve dodged the browser {dodges}{" "}
            {dodges === 1 ? "time" : "times"}.
          </span>
        )}
      </div>
    </div>
  );
}
