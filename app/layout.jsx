import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import StyledComponentsRegistry from "@/lib/registry";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
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
  ],
  authors: [{ name: "Shanto Kumar" }],
  openGraph: {
    title: "Shanto Kumar - Portfolio",
    description: "Front-End Developer, Web Designer, and Programmer",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </ThemeProvider>
      </body>
    </html>
  );
}
