import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AdminTheme = "cream" | "midnight" | "emerald" | "obsidian";

export interface ThemeConfig {
  id: AdminTheme;
  name: string;
  description: string;
  bgMain: string;
  bgSidebar: string;
  bgCard: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  accent: string;
  accentHover: string;
  previewBg: string;
}

export const THEME_CONFIGS: Record<AdminTheme, ThemeConfig> = {
  cream: {
    id: "cream",
    name: "Crème & Or",
    description: "Le thème classique Himmel avec tons crème chaleureux et accents dorés.",
    bgMain: "bg-[#F8F6F0]",
    bgSidebar: "bg-white border-r border-stone-200/80",
    bgCard: "bg-white border border-stone-200/80 shadow-xs text-stone-900",
    textPrimary: "text-stone-900",
    textSecondary: "text-stone-500",
    border: "border-stone-200/80",
    accent: "bg-gold text-stone-950",
    accentHover: "hover:bg-gold-light",
    previewBg: "bg-[#F8F6F0]",
  },
  midnight: {
    id: "midnight",
    name: "Nuit Royale",
    description: "Un bleu nuit profond avec finitions dorées pour une ambiance nocturne élégante.",
    bgMain: "bg-[#0b132b]",
    bgSidebar: "bg-[#1c2541] border-r border-slate-700/60",
    bgCard: "bg-[#1c2541] border border-slate-700/80 shadow-lg text-slate-100",
    textPrimary: "text-slate-100",
    textSecondary: "text-slate-400",
    border: "border-slate-700/80",
    accent: "bg-gold text-stone-950",
    accentHover: "hover:bg-gold-light",
    previewBg: "bg-[#0b132b]",
  },
  emerald: {
    id: "emerald",
    name: "Émeraude Élégante",
    description: "Un vert émeraude ténébreux raffiné et luxueux avec reflets chauds.",
    bgMain: "bg-[#062c22]",
    bgSidebar: "bg-[#0a3a2e] border-r border-emerald-800/60",
    bgCard: "bg-[#0a3a2e] border border-emerald-800/80 shadow-lg text-emerald-50",
    textPrimary: "text-emerald-50",
    textSecondary: "text-emerald-300/80",
    border: "border-emerald-800/80",
    accent: "bg-gold text-stone-950",
    accentHover: "hover:bg-gold-light",
    previewBg: "bg-[#062c22]",
  },
  obsidian: {
    id: "obsidian",
    name: "Obsidienne Moderne",
    description: "Un noir charbon pur et minimaliste inspiré des flacons d'exception.",
    bgMain: "bg-[#09090b]",
    bgSidebar: "bg-[#141416] border-r border-zinc-800",
    bgCard: "bg-[#141416] border border-zinc-800/90 shadow-xl text-zinc-100",
    textPrimary: "text-zinc-100",
    textSecondary: "text-zinc-400",
    border: "border-zinc-800",
    accent: "bg-gold text-stone-950",
    accentHover: "hover:bg-gold-light",
    previewBg: "bg-[#09090b]",
  },
};

interface AdminThemeState {
  theme: AdminTheme;
  setTheme: (theme: AdminTheme) => void;
}

export const useAdminThemeStore = create<AdminThemeState>()(
  persist(
    (set) => ({
      theme: "cream",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "himmel-admin-theme",
    }
  )
);
