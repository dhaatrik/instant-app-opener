/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Youtube, Linkedin, Instagram, Facebook, Link2, Copy, Check, AlertCircle, X, Share2, Github, MessageSquare } from 'lucide-react';
import { parseUrl, encodeDeepLinkId, ParsedUrl, Platform } from '@/lib/url-parser';

function XLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 3.827H5.078z"></path>
    </svg>
  );
}

function PlatformIcon({ platform, className = "w-6 h-6" }: { platform: Platform, className?: string }) {
  switch (platform) {
    case 'youtube': return <Youtube className={className} />;
    case 'x': return <XLogo className={className} />;
    case 'linkedin': return <Linkedin className={className} />;
    case 'instagram': return <Instagram className={className} />;
    case 'facebook': return <Facebook className={className} />;
    default: return <Link2 className={className} />;
  }
}

export default function Home() {
  const [input, setInput] = useState('');
  const [debouncedInput, setDebouncedInput] = useState('');
  const [parsed, setParsed] = useState<ParsedUrl | null>(null);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [appShared, setAppShared] = useState(false);
  const [appUrl, setAppUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    }
    return '';
  });
  const [error, setError] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [previewData, setPreviewData] = useState<{ title?: string, description?: string, image?: string } | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [copyFallback, setCopyFallback] = useState<string | null>(null);
  const fallbackInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
      if (!urlToTest.startsWith('http://') && !urlToTest.startsWith('https://')) {
        urlToTest = 'https://' + urlToTest;
      }

      try {
        const urlObj = new URL(urlToTest);
        const supportedDomains = ['youtube.com', 'youtu.be', 'twitter.com', 'x.com', 'linkedin.com', 'instagram.com', 'facebook.com', 'fb.com'];
        
        const isSupportedDomain = supportedDomains.some(domain => urlObj.hostname.toLowerCase().includes(domain));
        
        if (!isSupportedDomain) {
          setParsed(null);
          setError("Platform not supported. We currently support YouTube, X, LinkedIn, Instagram, and Facebook.");
          return;
        }

        const result = parseUrl(urlToTest);
        if (result.platform !== 'unknown') {
          setParsed(result);
          setError(null);
          setIsLoadingPreview(true);
          setPreviewData(null);
          
          // Subtle haptic feedback when a valid URL is detected
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(15);
          }
        } else {
          setParsed(null);
          setError("Could not extract ID from this URL. Please ensure it's a valid post or profile link.");
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
      fetch(`/api/preview?url=${encodeURIComponent(parsed.originalUrl)}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setPreviewData(data);
          }
        })
        .catch(err => console.error('Failed to fetch preview:', err))
        .finally(() => setIsLoadingPreview(false));
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewData(null);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoadingPreview(false);
    }
  }, [parsed]);

  const handleCopy = useCallback(async () => {
    if (!parsed) return;
    const encoded = encodeDeepLinkId(parsed);
    const link = `${appUrl}/open/${encoded}`;
    
    try {
      await navigator.clipboard.writeText(link);
      
      // Satisfying haptic feedback pattern for supported mobile devices
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([40, 30, 40]);
      }
      
      setCopied(true);
      setCopyFallback(null);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      setCopyFallback(link);
      // Focus the input in the next tick
      setTimeout(() => {
        if (fallbackInputRef.current) {
          fallbackInputRef.current.select();
        }
      }, 0);
    }
  }, [parsed, appUrl]);

  const handleShare = useCallback(async () => {
    if (!parsed) return;
    const encoded = encodeDeepLinkId(parsed);
    const link = `${appUrl}/open/${encoded}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Open in App',
          text: 'Click to open this link directly in the app!',
          url: link,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (err) {
        // User cancelled or share failed
        console.log('Share cancelled or failed', err);
      }
    } else {
      // Fallback to copy if share is not supported
      handleCopy();
    }
  }, [parsed, appUrl, handleCopy]);

  const handleShareApp = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Instant App Opener',
          text: 'Open social media links directly in their native apps instead of the browser!',
          url: appUrl,
        });
        setAppShared(true);
        setTimeout(() => setAppShared(false), 2000);
      } catch (err) {
        console.log('Share cancelled or failed', err);
      }
    } else {
      await navigator.clipboard.writeText(appUrl);
      setAppShared(true);
      setTimeout(() => setAppShared(false), 2000);
    }
  }, [appUrl]);

  const handleClear = () => {
    setInput('');
    setDebouncedInput('');
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
        if (e.key.toLowerCase() === 'c') {
          // Prevent default copy if we have a parsed link to copy instead
          e.preventDefault();
          handleCopy();
        } else if (e.key.toLowerCase() === 's') {
          // Prevent default save
          e.preventDefault();
          handleShare();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [parsed, handleCopy, handleShare]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col p-4 font-sans selection:bg-white/20 relative">
      {/* GitHub Icon */}
      <a 
        href="https://github.com/dhaatrik/instant-app-opener" 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute top-6 right-6 z-50 text-white/40 hover:text-white transition-colors"
        aria-label="GitHub Repository"
      >
        <Github className="w-6 h-6" />
      </a>

      {/* Background ambient light */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <motion.div 
          className="w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 transition-colors duration-1000"
          animate={{
            backgroundColor: parsed ? parsed.color : error ? '#ef4444' : 'rgba(0,0,0,0)'
          }}
        />
      </div>
      
      {/* Cursor Depth Effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300 opacity-50" 
        style={{ 
          backgroundImage: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.06), transparent 40%)` 
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
            Open Links <br/> Directly in App
          </h1>
          <p className="text-white/40 text-lg md:text-xl max-w-xl mx-auto font-light tracking-wide">
            The shared link opens in a browser? Paste it here and share the link to open in app.
          </p>
        </motion.div>

        <div className="w-full space-y-6">
          <div className="relative">
            <motion.div
              className={`relative w-full rounded-3xl transition-all duration-700 ease-out bg-white/5 backdrop-blur-2xl border hover:bg-white/10 ${
                parsed ? parsed.glowClass : error ? 'border-red-500/50 shadow-[0_0_40px_-15px_rgba(239,68,68,0.4)]' : 'border-white/10 shadow-none hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)]'
              }`}
              animate={{
                scale: parsed ? 1.02 : error ? 0.98 : 1,
              }}
              whileHover={{ scale: parsed ? 1.03 : error ? 0.99 : 1.01 }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste YouTube, X, LinkedIn URL..."
                className="w-full bg-transparent text-xl md:text-2xl p-6 md:p-8 pr-[110px] md:pr-[130px] outline-none placeholder:text-white/20 font-light"
              />
              {/* Icons inside input */}
              <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 flex items-center p-1.5 rounded-2xl bg-[#050505]/60 backdrop-blur-xl border border-white/10 shadow-2xl">
                <AnimatePresence>
                  {input && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.5, width: 0 }}
                      animate={{ opacity: 1, scale: 1, width: 'auto' }}
                      exit={{ opacity: 0, scale: 0.5, width: 0 }}
                      onClick={handleClear}
                      className="text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/10 p-1.5 mr-1 overflow-hidden flex items-center justify-center shrink-0"
                    >
                      <X className="w-5 h-5 shrink-0" />
                    </motion.button>
                  )}
                </AnimatePresence>
                
                <div 
                  className="flex items-center justify-center p-2 transition-colors duration-500 rounded-xl shrink-0" 
                  style={{ 
                    color: parsed ? parsed.color : error ? '#ef4444' : 'rgba(255,255,255,0.4)', 
                    backgroundColor: parsed ? `${parsed.color}15` : error ? 'rgba(239,68,68,0.1)' : 'transparent' 
                  }}
                >
                   {error ? <AlertCircle className="w-5 h-5 md:w-6 md:h-6" /> : <PlatformIcon platform={parsed ? parsed.platform : 'unknown'} className="w-5 h-5 md:w-6 md:h-6" />}
                </div>
              </div>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 16, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  className="absolute left-0 right-0 text-center text-red-400 font-medium tracking-wide flex items-center justify-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
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
                <div className="bg-white/5 border border-white/10 rounded-2xl p-7 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-2xl">
                  {/* Subtle gradient border effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at center, ${parsed.color}20 0%, transparent 70%)` }} />
                  
                  <div className="flex items-center gap-5 z-10 w-full md:w-auto overflow-hidden">
                    <div className="w-20 h-20 shrink-0 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-xl backdrop-blur-md relative overflow-hidden" style={{ color: parsed.color }}>
                      {previewData?.image ? (
                        <img src={previewData.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                      ) : (
                        <>
                          <div className="absolute inset-0 opacity-20" style={{ backgroundColor: parsed.color }} />
                          <PlatformIcon platform={parsed.platform} className="w-10 h-10 relative z-10 drop-shadow-md" />
                        </>
                      )}
                      
                      {/* Animated Success Indicator */}
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 z-20">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-[#050505]"></span>
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-2xl capitalize tracking-wide text-white/90">{parsed.platform}</h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] uppercase tracking-wider font-semibold border border-green-500/20">App Ready</span>
                      </div>
                      {isLoadingPreview ? (
                        <div className="h-4 w-32 bg-white/10 rounded animate-pulse mt-2" />
                      ) : previewData?.title ? (
                        <p className="text-white/80 text-sm truncate font-medium">{previewData.title}</p>
                      ) : (
                        <p className="text-white/40 text-sm truncate">{parsed.originalUrl}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto z-10 p-1 md:mr-6">
                    <motion.button
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ y: 2, scale: 0.98 }}
                      animate={copied ? { 
                        scale: [1, 0.95, 1.05, 1],
                      } : { scale: 1 }}
                      transition={{ 
                        duration: 0.4, 
                        times: [0, 0.2, 0.5, 1],
                        ease: "easeInOut"
                      }}
                      onClick={handleCopy}
                      className={`group relative overflow-hidden flex shrink-0 items-center gap-2 px-6 py-4 rounded-xl font-medium transition-all w-full sm:w-auto justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),_0_4px_10px_rgba(0,0,0,0.4)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),_0_12px_24px_rgba(0,0,0,0.6),_0_0_20px_rgba(255,255,255,0.3)] active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] ${copied ? 'bg-green-500 text-white hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),_0_12px_24px_rgba(0,0,0,0.6),_0_0_20px_rgba(34,197,94,0.4)]' : 'bg-white text-black hover:bg-gray-50'}`}
                    >
                      <div 
                        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100" 
                        style={{ 
                          backgroundImage: `radial-gradient(120px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,0.08), transparent 100%)`,
                          backgroundAttachment: 'fixed'
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
                          backgroundImage: `radial-gradient(120px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.15), transparent 100%)`,
                          backgroundAttachment: 'fixed'
                        }} 
                      />
                      <div className="relative z-10 flex items-center gap-2">
                        {shared ? <Check className="w-5 h-5 text-green-400" /> : <Share2 className="w-5 h-5" />}
                        <span>Share</span>
                        {!shared && (
                          <span className="hidden md:inline-flex items-center justify-center px-1.5 py-0.5 ml-1 text-[10px] font-mono font-bold text-white/40 bg-white/5 rounded border border-white/10">
                            ⌘S
                          </span>
                        )}
                      </div>
                    </motion.button>
                  </div>
                </div>

                {/* Copy Fallback UI */}
                <AnimatePresence>
                  {copyFallback && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                        <p className="text-sm text-yellow-400 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Automatic copy failed. Please copy the link manually:
                        </p>
                        <div className="flex gap-2">
                          <input
                            ref={fallbackInputRef}
                            type="text"
                            readOnly
                            value={copyFallback}
                            className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 outline-none focus:border-white/30 selection:bg-white/30"
                          />
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
            Do you like the &quot;Instant App Opener&quot;? Wanna spread it with friends and other professionals?
          </p>
          <button
            onClick={handleShareApp}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all text-sm font-medium"
          >
            {appShared ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
            {appShared ? 'Shared!' : 'Share Instant App Opener'}
          </button>
        </div>

        <div className="flex flex-col items-center w-full max-w-md">
          <button
            onClick={() => setShowFeedback(!showFeedback)}
            className="flex items-center gap-2 px-4 py-2 text-white/40 hover:text-white/80 transition-colors text-sm font-medium"
          >
            <MessageSquare className="w-4 h-4" />
            Send Feedback
          </button>
          
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden w-full"
              >
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-4">
                  <p className="text-sm text-white/60 text-center">
                    Have a suggestion or found a bug? Reach out to the developer directly.
                  </p>
                  <div className="flex items-center gap-4">
                    <a 
                      href="https://x.com/dhaatrik" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all"
                      aria-label="X (Twitter)"
                    >
                      <XLogo className="w-5 h-5" />
                    </a>
                    <a 
                      href="https://www.linkedin.com/in/dhaatrik/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-[#0a66c2] transition-all"
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
      <div className="pb-4 pt-4 text-white/20 text-xs font-mono tracking-widest uppercase text-center px-4 z-10">
        Currently supports YouTube, X, LinkedIn, Instagram & Facebook
      </div>
    </div>
  );
}
