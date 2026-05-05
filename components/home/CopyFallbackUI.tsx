import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, Copy } from "lucide-react";
import { RefObject } from "react";

interface CopyFallbackUIProps {
  copyFallback: string | null;
  fallbackInputRef: RefObject<HTMLInputElement | null>;
  setCopied: (copied: boolean) => void;
}

export function CopyFallbackUI({
  copyFallback,
  fallbackInputRef,
  setCopied,
}: CopyFallbackUIProps) {
  return (
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
                className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
