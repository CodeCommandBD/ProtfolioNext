import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import StyledComponentsRegistry from "@/lib/registry";
import StoreProvider from "@/components/StoreProvider";
import QueryProvider from "@/lib/tanstack/QueryProvider";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

export const metadata = {
  title: "Shanto Kumar - Portfolio",
  description:
    "Front-End Developer, Web Designer, and Programmer portfolio showcasing projects, skills, and experience.",
  keywords: [
    "portfolio",
    "web developer",
    "frontend developer",
    "react",
    "nextjs",
    "web design",
    "full stack developer",
    "javascript",
    "typescript",
  ],
  authors: [{ name: "Shanto Kumar" }],
  creator: "Shanto Kumar",
  publisher: "Shanto Kumar",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Shanto Kumar - Portfolio",
    description:
      "Front-End Developer, Web Designer, and Programmer showcasing innovative projects and technical expertise.",
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    siteName: "Shanto Kumar Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Shanto Kumar Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shanto Kumar - Portfolio",
    description: "Front-End Developer, Web Designer, and Programmer",
    creator: "@yourusername",
    images: ["/og-image.png"],
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link
          rel="dns-prefetch"
          href="https://user-images.githubusercontent.com"
        />
        <link rel="dns-prefetch" href="https://upload.wikimedia.org" />
      </head>
      <body className={poppins.className}>
        <StoreProvider>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
            >
              <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
            </ThemeProvider>
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
