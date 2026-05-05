import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import dynamic from "next/dynamic";
import { ParsedUrl, encodeDeepLinkId } from "@/lib/url-parser";

const QRCodeSVG = dynamic(
  () => import("qrcode.react").then((mod) => mod.QRCodeSVG),
  { ssr: false },
);

interface QRCodeModalProps {
  showQR: boolean;
  setShowQR: (show: boolean) => void;
  appUrl: string;
  parsed: ParsedUrl;
}

export function QRCodeModal({
  showQR,
  setShowQR,
  appUrl,
  parsed,
}: QRCodeModalProps) {
  return (
    <AnimatePresence>
      {showQR && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl p-6"
          onClick={() => setShowQR(false)}
        >
          <div
            className="bg-white p-6 rounded-2xl flex flex-col items-center gap-4 relative"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="QR Code"
          >
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-2 right-2 text-black/40 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 rounded-full p-1"
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
            <p className="text-black/60 text-sm font-medium">Scan the Sauce</p>
            <button
              onClick={() => {
                const svg = document.querySelector("#qr-code-container svg");
                if (svg) {
                  const svgData = new XMLSerializer().serializeToString(svg);
                  const canvas = document.createElement("canvas");
                  const ctx = canvas.getContext("2d");
                  const img = new Image();
                  img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx?.drawImage(img, 0, 0);
                    const pngFile = canvas.toDataURL("image/png");
                    const downloadLink = document.createElement("a");
                    downloadLink.download = "instant-app-opener-qr.png";
                    downloadLink.href = `${pngFile}`;
                    downloadLink.click();
                  };
                  img.src =
                    "data:image/svg+xml;base64," +
                    btoa(unescape(encodeURIComponent(svgData)));
                }
              }}
              className="mt-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/80 transition-colors"
            >
              Download QR
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
