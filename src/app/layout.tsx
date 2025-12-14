import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Sidebar } from "@/components/shell/Sidebar";
import { CommandPalette } from "@/components/shell/CommandPalette";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Flux | The Spatial Operating System",
  description: "A polymorphic workspace that combines Ideation, Execution, and Scheduling into one fluid experience.",
  openGraph: {
    title: "Flux | The Spatial Operating System",
    description: "Design. Execute. Schedule. All in one place.",
    type: "website",
    url: "https://flux.os",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flux | The Spatial OS",
    description: "Your new digital home.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <div className="flex h-screen w-full">
          <Sidebar />
          <main className="flex-1 h-full overflow-hidden relative">
            {children}
          </main>
          <CommandPalette />
        </div>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
