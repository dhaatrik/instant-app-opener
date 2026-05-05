import { motion, AnimatePresence } from "motion/react";
import { Check, Share2, MessageSquare, Linkedin } from "lucide-react";
import { XLogo } from "./PlatformIcon";

interface ShareFeedbackSectionProps {
  appShared: boolean;
  handleShareApp: () => void;
  showFeedback: boolean;
  setShowFeedback: (show: boolean) => void;
}

export function ShareFeedbackSection({
  appShared,
  handleShareApp,
  showFeedback,
  setShowFeedback,
}: ShareFeedbackSectionProps) {
  return (
    <div className="mt-auto pt-12 pb-4 flex flex-col items-center justify-center z-10 gap-6">
      <div className="flex flex-col items-center">
        <p className="text-white/40 text-sm mb-4 text-center max-w-md">
          Vibing with Instant App Opener? Share the sauce with your friends and
          mutuals.
        </p>
        <button
          onClick={handleShareApp}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
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
          className="flex items-center gap-2 px-4 py-2 text-white/40 hover:text-white/80 transition-colors text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-lg"
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
                    className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                    aria-label="X (Twitter)"
                  >
                    <XLogo className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/dhaatrik/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-[#0a66c2] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
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
  );
}
