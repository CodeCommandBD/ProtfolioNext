"use client";

import styled, { ThemeProvider } from "styled-components";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { darkTheme, lightTheme } from "@/lib/utils/themes";
import { ReactNode, useEffect, useState } from "react";
import { useTheme } from "next-themes";

const Body = styled.div`
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
  transition: background 0.3s ease, color 0.3s ease;
`;

const Wrapper = styled.div`
  padding-bottom: 100px;
  background: linear-gradient(38.73deg, rgba(204,0,187,0.15) 0%, rgba(201,32,184,0) 50%),
  linear-gradient(141.27deg, rgba(0,70,209,0) 50%, rgba(0,70,209,0.15)100%);
  width: 100%;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 30% 98%, 0 100%);
`;

interface ClientWrapperProps {
  children: ReactNode;
}

function ThemedContent({ children }: ClientWrapperProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent flash of unstyled content
  if (!mounted) {
    return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>;
  }

  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      {children}
    </ThemeProvider>
  );
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="portfolio-theme"
    >
      <ThemedContent>{children}</ThemedContent>
    </NextThemesProvider>
  );
}

export { Body, Wrapper };
