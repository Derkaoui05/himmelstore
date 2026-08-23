"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { trpcReact } from "@/lib/trpc-client";
import { useAdminThemeStore, THEME_CONFIGS, AdminTheme } from "@/lib/adminThemeStore";
import BrandLogo from "@/components/common/BrandLogo";

export default function AdminSettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const { theme, setTheme } = useAdminThemeStore();
  const themeConfig = THEME_CONFIGS[theme] || THEME_CONFIGS.cream;
  const isDark = theme !== "cream";

  // TRPC Query and Mutations
  const { data: storeSettings, refetch: refetchStoreSettings } = trpcReact.admin.getStoreSettings.useQuery();
  const updateStoreSettingsMutation = trpcReact.admin.updateStoreSettings.useMutation();
  const updateAdminMutation = trpcReact.admin.update.useMutation();

  // Branding Form States
  const [storeName, setStoreName] = useState("HIMMEL");
  const [storeTagline, setStoreTagline] = useState("fatima zahrae derkaoui");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoMode, setLogoMode] = useState<"TEXT_ONLY" | "IMAGE_ONLY" | "IMAGE_AND_TEXT">("TEXT_ONLY");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [uploadTab, setUploadTab] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const [brandingMsg, setBrandingMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Form States
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Sync initial branding values
  useEffect(() => {
    if (storeSettings) {
      setStoreName(storeSettings.storeName || "HIMMEL");
      setStoreTagline(storeSettings.storeTagline || "");
      setLogoUrl(storeSettings.logoUrl || "");
      setLogoMode((storeSettings.logoMode as any) || "TEXT_ONLY");
      setFaviconUrl(storeSettings.faviconUrl || "");
    }
  }, [storeSettings]);

  // Sync initial profile values
  useEffect(() => {
    if (session?.user) {
      setAdminName(session.user.name || "");
      setAdminEmail(session.user.email || "");
    }
  }, [session]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setBrandingMsg(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Échec du téléversement");
      }

      setLogoUrl(data.url);
      // Auto-select IMAGE_ONLY or IMAGE_AND_TEXT if it was TEXT_ONLY
      if (logoMode === "TEXT_ONLY") {
        setLogoMode("IMAGE_AND_TEXT");
      }
      setBrandingMsg({ type: "success", text: `Image téléversée avec succès : ${data.fileName}` });
    } catch (err: any) {
      setBrandingMsg({ type: "error", text: err.message || "Erreur de téléversement." });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleBrandingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBrandingMsg(null);

    try {
      await updateStoreSettingsMutation.mutateAsync({
        storeName,
        storeTagline,
        logoUrl: logoUrl.trim() || null,
        logoMode,
        faviconUrl: faviconUrl.trim() || null,
      });

      await refetchStoreSettings();
      setBrandingMsg({ type: "success", text: "Logo et paramètres de la boutique enregistrés avec succès !" });
    } catch (err: any) {
      setBrandingMsg({ type: "error", text: err.message || "Erreur lors de l'enregistrement du logo." });
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);

    if (password && password !== confirmPassword) {
      setProfileMsg({ type: "error", text: "Les mots de passe ne correspondent pas." });
      return;
    }

    const userId = (session?.user as any)?.id;
    if (!userId) {
      setProfileMsg({ type: "error", text: "Session utilisateur invalide." });
      return;
    }

    try {
      await updateAdminMutation.mutateAsync({
        id: userId,
        name: adminName,
        email: adminEmail,
        password: password || undefined,
      });

      // Update local session details
      await updateSession({ name: adminName, email: adminEmail });

      setProfileMsg({ type: "success", text: "Vos identifiants ont été mis à jour avec succès !" });
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setProfileMsg({ type: "error", text: err.message || "Erreur lors de la mise à jour des identifiants." });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold font-heading ${themeConfig.textPrimary}`}>
          Thème & Paramètres
        </h1>
        <p className={`text-xs mt-1 ${themeConfig.textSecondary}`}>
          Personnalisez le logo de votre boutique (par fichier ou URL), l'ambiance visuelle du tableau de bord et vos accès administrateur.
        </p>
      </div>

      {/* SECTION 1: LOGO & STORE BRANDING CONFIGURATION */}
      <div className={`rounded-2xl border ${themeConfig.border} ${themeConfig.bgCard} p-6 space-y-6 shadow-xs`}>
        <div className="border-b border-stone-200/40 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className={`text-base font-semibold ${themeConfig.textPrimary}`}>
              Logo & Identité Visuelle de la Boutique
            </h2>
            <p className={`text-xs mt-0.5 ${themeConfig.textSecondary}`}>
              Téléversez un fichier image ou collez une URL pour configurer le logo de votre site.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-gold/20 text-gold-dark text-[10px] font-bold uppercase tracking-wider self-start">
            Boutique & Admin
          </span>
        </div>

        {brandingMsg && (
          <div
            className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between ${
              brandingMsg.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-600"
                : "bg-rose-500/10 border border-rose-500/30 text-rose-600"
            }`}
          >
            <span>{brandingMsg.text}</span>
            <button onClick={() => setBrandingMsg(null)} className="cursor-pointer">✕</button>
          </div>
        )}

        <form onSubmit={handleBrandingSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Configuration inputs */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className={`text-xs font-semibold uppercase tracking-wider ${themeConfig.textSecondary}`}>
                  Nom de la Marque / Titre
                </label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="HIMMEL"
                  className={`w-full rounded-xl border ${themeConfig.border} ${isDark ? "bg-slate-900 text-white" : "bg-stone-50 text-stone-900"} px-4 py-2.5 text-xs focus:border-gold focus:outline-none`}
                />
              </div>

              <div className="space-y-1.5">
                <label className={`text-xs font-semibold uppercase tracking-wider ${themeConfig.textSecondary}`}>
                  Sous-titre / Signature
                </label>
                <input
                  type="text"
                  value={storeTagline}
                  onChange={(e) => setStoreTagline(e.target.value)}
                  placeholder="fatima zahrae derkaoui"
                  className={`w-full rounded-xl border ${themeConfig.border} ${isDark ? "bg-slate-900 text-white" : "bg-stone-50 text-stone-900"} px-4 py-2.5 text-xs focus:border-gold focus:outline-none`}
                />
              </div>

              <div className="space-y-1.5">
                <label className={`text-xs font-semibold uppercase tracking-wider ${themeConfig.textSecondary}`}>
                  Mode d'affichage du Logo
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "TEXT_ONLY", label: "Texte Seul" },
                    { id: "IMAGE_ONLY", label: "Image Seule" },
                    { id: "IMAGE_AND_TEXT", label: "Image + Texte" },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setLogoMode(mode.id as any)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        logoMode === mode.id
                          ? "border-gold bg-gold text-stone-950 font-bold shadow-xs"
                          : `${themeConfig.border} ${isDark ? "bg-slate-900 text-stone-300" : "bg-stone-50 text-stone-700"} hover:border-gold/50`
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logo Source (Upload vs URL) */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-semibold uppercase tracking-wider ${themeConfig.textSecondary}`}>
                    Image du Logo
                  </label>
                  <div className="flex rounded-lg border border-stone-200/60 p-0.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setUploadTab("upload")}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        uploadTab === "upload"
                          ? "bg-gold text-stone-950 font-bold shadow-xs"
                          : "text-stone-500 hover:text-stone-800"
                      }`}
                    >
                      Téléverser
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadTab("url")}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        uploadTab === "url"
                          ? "bg-gold text-stone-950 font-bold shadow-xs"
                          : "text-stone-500 hover:text-stone-800"
                      }`}
                    >
                      URL directe
                    </button>
                  </div>
                </div>

                {uploadTab === "upload" ? (
                  <div className="space-y-2">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`h-24 w-full rounded-xl border-2 border-dashed ${themeConfig.border} ${
                        isDark ? "bg-slate-900/50 hover:bg-slate-900" : "bg-stone-50/60 hover:bg-stone-50"
                      } flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all hover:border-gold`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/svg+xml,image/webp"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      {uploading ? (
                        <div className="flex items-center gap-2 text-xs text-gold">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                          <span>Téléversement en cours...</span>
                        </div>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-stone-400 mb-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                          </svg>
                          <span className={`text-xs font-medium ${themeConfig.textPrimary}`}>
                            Cliquez pour choisir un fichier image (PNG, SVG, JPG)
                          </span>
                          <span className="text-[10px] text-stone-400 mt-0.5">
                            Fond transparent recommandé
                          </span>
                        </>
                      )}
                    </div>

                    {/* Quick Presets */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] text-stone-400">Presets disponibles :</span>
                      <button
                        type="button"
                        onClick={() => {
                          setLogoUrl("/himmel.png");
                          if (logoMode === "TEXT_ONLY") setLogoMode("IMAGE_AND_TEXT");
                        }}
                        className="text-[10px] px-2 py-0.5 rounded border border-stone-200/80 bg-stone-100 hover:border-gold hover:text-gold-dark transition-colors cursor-pointer"
                      >
                        himmel.png
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLogoUrl("/himmel_logo.jpg");
                          if (logoMode === "TEXT_ONLY") setLogoMode("IMAGE_AND_TEXT");
                        }}
                        className="text-[10px] px-2 py-0.5 rounded border border-stone-200/80 bg-stone-100 hover:border-gold hover:text-gold-dark transition-colors cursor-pointer"
                      >
                        himmel_logo.jpg
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <input
                      type="url"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://exemple.com/mon-logo.png"
                      className={`w-full rounded-xl border ${themeConfig.border} ${isDark ? "bg-slate-900 text-white" : "bg-stone-50 text-stone-900"} px-4 py-2.5 text-xs focus:border-gold focus:outline-none`}
                    />
                    <p className="text-[11px] text-stone-400">
                      Entrez l'URL directe d'une image hébergée sur le web.
                    </p>
                  </div>
                )}

                {/* Clear Logo Button */}
                {logoUrl && (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className={`text-[11px] ${themeConfig.textSecondary} truncate max-w-[280px]`}>
                      Fichier actif : <span className="font-mono text-gold-dark">{logoUrl}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setLogoUrl("")}
                      className="text-[11px] text-rose-500 hover:text-rose-700 cursor-pointer font-medium"
                    >
                      Effacer le logo
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Live Interactive Previews */}
            <div className="space-y-3">
              <span className={`text-xs font-semibold uppercase tracking-wider ${themeConfig.textSecondary}`}>
                Aperçu en Direct du Logo
              </span>

              {/* Light Background Preview */}
              <div className="rounded-xl border border-stone-200 bg-[#FAF8F5] p-5 shadow-inner space-y-2">
                <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">
                  Sur Fond Clair (Boutique & Navbar)
                </span>
                <div className="h-20 flex items-center justify-center rounded-lg border border-dashed border-stone-300 bg-white px-4">
                  {logoMode === "IMAGE_ONLY" && logoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={logoUrl} alt="Aperçu" className="max-h-12 w-auto object-contain" />
                  ) : logoMode === "IMAGE_AND_TEXT" && logoUrl ? (
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={logoUrl} alt="Aperçu" className="max-h-9 w-auto object-contain" />
                      <div className="flex flex-col">
                        <span className="font-heading text-lg font-bold tracking-widest text-gold-dark">
                          {storeName || "HIMMEL"}
                        </span>
                        {storeTagline && (
                          <span className="font-semibold text-[10px] uppercase text-black tracking-wide">
                            {storeTagline}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <span className="font-heading text-xl font-bold tracking-widest text-gold-dark">
                        {storeName || "HIMMEL"}
                      </span>
                      {storeTagline && (
                        <span className="font-semibold text-[10px] uppercase text-black tracking-wide">
                          {storeTagline}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Dark Background Preview */}
              <div className="rounded-xl border border-slate-700 bg-[#0F172A] p-5 shadow-inner space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Sur Fond Sombre (Mode Nuit / Admin)
                </span>
                <div className="h-20 flex items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-900 px-4">
                  {logoMode === "IMAGE_ONLY" && logoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={logoUrl} alt="Aperçu" className="max-h-12 w-auto object-contain" />
                  ) : logoMode === "IMAGE_AND_TEXT" && logoUrl ? (
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={logoUrl} alt="Aperçu" className="max-h-9 w-auto object-contain" />
                      <div className="flex flex-col">
                        <span className="font-heading text-lg font-bold tracking-widest text-gold">
                          {storeName || "HIMMEL"}
                        </span>
                        {storeTagline && (
                          <span className="font-semibold text-[10px] uppercase text-stone-400 tracking-wide">
                            {storeTagline}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <span className="font-heading text-xl font-bold tracking-widest text-gold">
                        {storeName || "HIMMEL"}
                      </span>
                      {storeTagline && (
                        <span className="font-semibold text-[10px] uppercase text-stone-400 tracking-wide">
                          {storeTagline}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={updateStoreSettingsMutation.isPending}
              className="px-6 py-2.5 rounded-xl bg-gold text-xs font-semibold uppercase tracking-wider text-stone-950 shadow-md hover:bg-gold-light hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              {updateStoreSettingsMutation.isPending ? "Enregistrement..." : "Enregistrer le Logo"}
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: THEME PICKER */}
      <div className={`rounded-2xl border ${themeConfig.border} ${themeConfig.bgCard} p-6 space-y-6 shadow-xs`}>
        <div>
          <h2 className={`text-base font-semibold ${themeConfig.textPrimary}`}>
            Thème du Tableau de Bord
          </h2>
          <p className={`text-xs mt-0.5 ${themeConfig.textSecondary}`}>
            Sélectionnez votre ambiance visuelle préférée. La sélection est sauvegardée pour vos prochaines visites.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(THEME_CONFIGS) as AdminTheme[]).map((themeKey) => {
            const cfg = THEME_CONFIGS[themeKey];
            const isSelected = theme === themeKey;

            return (
              <button
                key={themeKey}
                onClick={() => setTheme(themeKey)}
                className={`relative group text-left rounded-xl border p-4 transition-all duration-200 cursor-pointer overflow-hidden ${
                  isSelected
                    ? "border-gold ring-2 ring-gold/40 shadow-lg scale-[1.02]"
                    : `${themeConfig.border} ${isDark ? "hover:border-slate-600" : "hover:border-stone-300"}`
                }`}
              >
                {/* Active Badge */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 bg-gold text-stone-950 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-xs">
                    Actif
                  </div>
                )}

                {/* Color Palette Preview Box */}
                <div className={`h-24 w-full rounded-lg ${cfg.previewBg} border border-stone-200/20 p-2.5 flex flex-col justify-between mb-3 shadow-inner`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-widest text-gold">{storeName || "HIMMEL"}</span>
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-gold" />
                      <div className="h-2 w-2 rounded-full bg-amber-400" />
                    </div>
                  </div>
                  <div className="h-6 w-full rounded bg-white/10 border border-white/10 flex items-center px-2">
                    <div className="h-2 w-12 rounded bg-gold/60" />
                  </div>
                </div>

                {/* Theme Info */}
                <h3 className={`text-xs font-bold ${cfg.textPrimary} group-hover:text-gold transition-colors`}>
                  {cfg.name}
                </h3>
                <p className={`text-[11px] mt-1 leading-snug ${cfg.textSecondary}`}>
                  {cfg.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: MY PROFILE & CREDENTIALS */}
      <div className={`rounded-2xl border ${themeConfig.border} ${themeConfig.bgCard} p-6 space-y-6 shadow-xs`}>
        <div>
          <h2 className={`text-base font-semibold ${themeConfig.textPrimary}`}>
            Mon Profil & Identifiants
          </h2>
          <p className={`text-xs mt-0.5 ${themeConfig.textSecondary}`}>
            Modifiez le nom et le mot de passe associés à votre compte administrateur actuel.
          </p>
        </div>

        {profileMsg && (
          <div
            className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between ${
              profileMsg.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-600"
                : "bg-rose-500/10 border border-rose-500/30 text-rose-600"
            }`}
          >
            <span>{profileMsg.text}</span>
            <button onClick={() => setProfileMsg(null)}>✕</button>
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-5 max-w-xl">
          <div className="space-y-1.5">
            <label className={`text-xs font-semibold uppercase tracking-wider ${themeConfig.textSecondary}`}>
              Nom d'Administrateur
            </label>
            <input
              type="text"
              required
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className={`w-full rounded-xl border ${themeConfig.border} ${isDark ? "bg-slate-900 text-white" : "bg-stone-50 text-stone-900"} px-4 py-2.5 text-xs focus:border-gold focus:outline-none`}
            />
          </div>

          <div className="space-y-1.5">
            <label className={`text-xs font-semibold uppercase tracking-wider ${themeConfig.textSecondary}`}>
              Adresse Email (Identifiant de connexion)
            </label>
            <input
              type="email"
              required
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className={`w-full rounded-xl border ${themeConfig.border} ${isDark ? "bg-slate-900 text-white" : "bg-stone-50 text-stone-900"} px-4 py-2.5 text-xs focus:border-gold focus:outline-none`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${themeConfig.textSecondary}`}>
                Nouveau mot de passe
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-xl border ${themeConfig.border} ${isDark ? "bg-slate-900 text-white" : "bg-stone-50 text-stone-900"} px-4 py-2.5 text-xs focus:border-gold focus:outline-none`}
              />
            </div>

            <div className="space-y-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${themeConfig.textSecondary}`}>
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full rounded-xl border ${themeConfig.border} ${isDark ? "bg-slate-900 text-white" : "bg-stone-50 text-stone-900"} px-4 py-2.5 text-xs focus:border-gold focus:outline-none`}
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={updateAdminMutation.isPending}
              className="px-6 py-2.5 rounded-xl bg-gold text-xs font-semibold uppercase tracking-wider text-stone-950 shadow-md hover:bg-gold-light hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              {updateAdminMutation.isPending ? "Mise à jour..." : "Enregistrer les modifications"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
