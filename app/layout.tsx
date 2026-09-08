import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "GigoPlanet Coding Vibes — Build software with AI";
const description =
  "Learn to design and ship production software, business websites and personal portfolios using Cursor, Antigravity and the modern AI stack.";

export const metadata: Metadata = {
  title: {
    default: title,
    template: "%s · GigoPlanet Coding Vibes",
  },
  description,
  keywords: [
    "vibe coding",
    "Cursor AI",
    "Antigravity AI",
    "AI web development course",
    "build websites with AI",
    "portfolio website training",
  ],
  openGraph: {
    title,
    description,
    siteName: "GigoPlanet Coding Vibes",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}var r=document.documentElement;r.classList.remove("light","dark");r.classList.add(t);r.style.colorScheme=t}catch(e){}})();`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
