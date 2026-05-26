import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next Start Kit",
  description: "Next.js + Supabase + Tailwind starter kit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body suppressHydrationWarning>
        <Script
          id="suppress-hmr-error"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html:
            'window.addEventListener("unhandledrejection",function(e){if(e.reason&&e.reason.code===-32603)e.preventDefault();});'
          }}
        />
        {children}
      </body>
    </html>
  );
}
