import type { Metadata } from "next";
import "./globals.css";
import { PlatformProvider } from "@/components/providers/PlatformProvider";

export const metadata: Metadata = {
  title: "GradeFour — GCSE Mathematics Examination Preparation",
  description:
    "A calm, structured digital examination preparation system for GCSE Mathematics. Diagnose gaps, master topics with step-marked practice, and sit realistic mock examinations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-[#FAF9F5] text-[#141413] antialiased selection:bg-[#0F4C3A]/15 selection:text-[#0F4C3A]">
        <PlatformProvider>{children}</PlatformProvider>
      </body>
    </html>
  );
}
