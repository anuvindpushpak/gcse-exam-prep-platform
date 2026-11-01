import type { Metadata } from "next";
import "./globals.css";
import { PlatformProvider } from "@/components/providers/PlatformProvider";

export const metadata: Metadata = {
  title: "GradeFour.ai — AI-Powered GCSE Maths Grade 4 Exam Preparation Platform",
  description:
    "Self-service GCSE Mathematics Foundation Tier preparation system combining diagnostic assessments, structured topic learning, step-marked practice, realistic mock examinations, and personalised readiness analytics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PlatformProvider>{children}</PlatformProvider>
      </body>
    </html>
  );
}
