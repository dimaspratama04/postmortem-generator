import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Postmortem Generator | SRE Tool",
  description: "Generate professional incident postmortem reports. Support export to PDF only.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
