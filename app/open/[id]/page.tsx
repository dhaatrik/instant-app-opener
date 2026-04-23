'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { decodeDeepLinkId, APP_STORE_LINKS, Platform } from '@/lib/url-parser';
import { isSafeUrl } from '@/lib/safe-url';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

export default function OpenPage() {
  const params = useParams();
  const [status, setStatus] = useState('Opening app...');
  const [fallbackUrl, setFallbackUrl] = useState('');

  useEffect(() => {
    const handleRedirection = () => {
      if (!params.id || typeof params.id !== 'string') {
        setStatus('Invalid link');
        return;
      }

      const data = decodeDeepLinkId(params.id);
      if (!data || !data.p || !data.u) {
        setStatus('Invalid link data');
        return;
      }

      setFallbackUrl(data.u);

      const deepLink = data.d || data.u;
      const platform = data.p as Platform;

      // Attempt to open deep link
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
      const isAndroid = /android/i.test(userAgent);
      const isMobile = isIOS || isAndroid;

      // Security: Validate URLs before redirecting
      if (!isSafeUrl(deepLink) || !isSafeUrl(data.u)) {
        setStatus('Invalid or unsafe link');
        setFallbackUrl('');
        return;
      }

      if (isMobile) {
        // Try to open app
        window.location.href = deepLink;

        // Fallback to app store or web after 2 seconds if app didn't open
        const timeout = setTimeout(() => {
          setStatus('App not found. Redirecting...');
          const storeLinks = APP_STORE_LINKS[platform];
          
          if (!isSafeUrl(data.u)) return;
          if (storeLinks && (!isSafeUrl(storeLinks.ios) || !isSafeUrl(storeLinks.android))) return;

          if (isIOS && storeLinks?.ios) {
            window.location.href = storeLinks.ios;
          } else if (isAndroid && storeLinks?.android) {
            window.location.href = storeLinks.android;
          } else {
            window.location.href = data.u;
          }
        }, 2000);

        return timeout;
      } else {
        // On desktop, just redirect to web URL
        setStatus('Redirecting to web...');
        if (isSafeUrl(data.u)) {
            window.location.href = data.u;
        }
        return null;
      }
    };

    const timeoutId = handleRedirection();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [params.id]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6"
      >
        <Loader2 className="w-12 h-12 animate-spin text-white/50" />
        <h2 className="text-xl font-medium text-white/80">{status}</h2>
        {fallbackUrl && (
          <a href={fallbackUrl} className="text-sm text-white/40 hover:text-white/80 underline underline-offset-4 transition-colors">
            Click here if you are not redirected
          </a>
        )}
      </motion.div>
    </div>
  );
}
