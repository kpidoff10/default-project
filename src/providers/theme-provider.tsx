"use client";

import * as React from "react";

import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      {/* Grille très subtile en arrière-plan */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />

      {/* Halo principal moderne - dégradé ultra-doux */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.04)_0%,rgba(147,51,234,0.02)_40%,rgba(59,130,246,0.01)_70%,transparent_100%)] pointer-events-none" />

      {/* Halo d'accent - dégradé ultra-doux */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.03)_0%,rgba(236,72,153,0.015)_50%,rgba(6,182,212,0.005)_80%,transparent_100%)] pointer-events-none" />

      {/* Particules modernes animées */}
      <div className="fixed top-1/4 left-1/4 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse [animation-duration:4s] pointer-events-none" />
      <div className="fixed top-1/3 right-1/4 w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-bounce [animation-duration:3s] [animation-delay:1s] pointer-events-none" />
      <div className="fixed bottom-1/3 left-1/3 w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse [animation-duration:5s] [animation-delay:2s] pointer-events-none" />
      <div className="fixed top-2/3 right-1/3 w-1.5 h-1.5 bg-gradient-to-r from-pink-400 to-cyan-400 rounded-full animate-bounce [animation-duration:3.5s] [animation-delay:0.5s] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-1 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse [animation-duration:4.5s] [animation-delay:1.5s] pointer-events-none" />
      <div className="fixed top-1/2 left-1/4 w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-bounce [animation-duration:3s] [animation-delay:2.5s] pointer-events-none" />

      {/* Effet de mouvement subtil */}
      <div className="fixed top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-white/2 to-transparent dark:from-transparent dark:via-white/4 dark:to-transparent blur-3xl animate-spin [animation-duration:40s] pointer-events-none" />

      {children}
    </NextThemesProvider>
  );
}
