import { Youtube, Linkedin, Instagram, Facebook, Link2 } from "lucide-react";
import { Platform } from "@/lib/url-parser";

export function XLogo({ className = "w-6 h-6" }: { className?: string }) {
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

export function TikTokLogo({ className = "w-6 h-6" }: { className?: string }) {
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

export function SpotifyLogo({ className = "w-6 h-6" }: { className?: string }) {
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

export function PlatformIcon({
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
