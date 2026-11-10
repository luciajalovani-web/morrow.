import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { InterfaceLanguageProvider } from "@/app/components/interface-language";
import { LearningProgressProvider } from "@/app/components/learning-progress-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "morrow — Find your words",
  description:
    "Learn English, French, Spanish, Italian and German with thoughtful, level-based lessons made for real life.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <InterfaceLanguageProvider>
          <LearningProgressProvider>{children}</LearningProgressProvider>
        </InterfaceLanguageProvider>
      </body>
    </html>
  );
}
