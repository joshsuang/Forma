import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Shell } from "@/app/shell";
import "./globals.css";

// Applies the saved theme before first paint so the correct theme is shown
// immediately. Kept in sync with THEME_STORAGE_KEY in lib/theme.ts.
const themeScript = `(function(){try{var t=localStorage.getItem("forma-theme");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light";}catch(e){}})();`;

export const metadata: Metadata = {
  title: "Forma",
  description: "A minimal habit tracker for daily consistency.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the theme script sets data-theme on <html>
    // before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh antialiased">
        <ThemeProvider>
          <Shell>{children}</Shell>
        </ThemeProvider>
      </body>
    </html>
  );
}
