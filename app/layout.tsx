import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RevealObserver from "@/components/RevealObserver";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import Transitions from "@/components/Transitions";
import { profile } from "@/content/profile";

// The only font. The optical-size axis tightens it automatically at
// display sizes.
const sans = Inter({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-sans",
  display: "swap",
});

// Runs before first paint. Marks scripts as available so animations can
// start hidden, flags a fresh load of the home page for the intro, and shows
// everything anyway if the app hasn't started within 4 seconds.
const bootScript = `(function(){var d=document.documentElement;d.classList.add("js");if(location.pathname==="/")d.classList.add("intro");setTimeout(function(){if(!d.classList.contains("reveal-ready")){d.classList.remove("js","intro")}},4000)})();`;

export const metadata: Metadata = {
  title: { default: profile.name, template: `%s · ${profile.name}` },
  description: profile.description,
  icons: { icon: "/icon.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The script above changes <html> after the server render.
    <html
      lang="en"
      className={sans.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="flex min-h-screen flex-col bg-paper font-sans text-body font-[450] text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-on-ink"
        >
          Skip to content
        </a>
        <SiteHeader />
        {/* Moved by page transitions; the header stays put */}
        <div id="page" className="flex flex-1 flex-col">
          <main id="main" className="flex-1 scroll-mt-[var(--header-h)]">
            {children}
          </main>
          <SiteFooter />
        </div>
        <Transitions />
        <RevealObserver />
      </body>
    </html>
  );
}
