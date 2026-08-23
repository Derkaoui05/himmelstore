"use client";

import { useState } from "react";
import { trpcReact } from "@/lib/trpc-client";
import { useAdminThemeStore, THEME_CONFIGS } from "@/lib/adminThemeStore";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  createdAt: any;
}

export default function AdminUsersPage() {
  const { theme } = useAdminThemeStore();
  const themeConfig = THEME_CONFIGS[theme] || THEME_CONFIGS.cream;
  const isDark = theme !== "cream";

  // TRPC Queries & Mutations
  const { data: admins, isLoading, refetch } = trpcReact.admin.list.useQuery();
  const createMutation = trpcReact.admin.create.useMutation();
  const updateMutation = trpcReact.admin.update.useMutation();
  const deleteMutation = trpcReact.admin.delete.useMutation();

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setErrorMsg(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddOpen(true);
  };

  const handleOpenEdit = (admin: AdminUser) => {
    resetForm();
    setName(admin.name);
    setEmail(admin.email);
    setEditingAdmin(admin);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await createMutation.mutateAsync({
        name,
        email,
        password,
      });
      setSuccessMsg("Administrateur créé avec succès.");
      setIsAddOpen(false);
      resetForm();
      refetch();
    } catch (err: any) {
      setErrorMsg(err.message || "Erreur lors de la création.");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await updateMutation.mutateAsync({
        id: editingAdmin.id,
        name,
        email,
        password: password || undefined,
      });
      setSuccessMsg("Administrateur mis à jour avec succès.");
      setEditingAdmin(null);
      resetForm();
      refetch();
    } catch (err: any) {
      setErrorMsg(err.message || "Erreur lors de la modification.");
    }
  };

  const handleDelete = async (id: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await deleteMutation.mutateAsync({ id });
      setSuccessMsg("Administrateur supprimé.");
      setDeletingId(null);
      refetch();
    } catch (err: any) {
      setErrorMsg(err.message || "Erreur lors de la suppression.");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold font-heading ${themeConfig.textPrimary}`}>
            Gestion des Administrateurs
          </h1>
          <p className={`text-xs mt-1 ${themeConfig.textSecondary}`}>
            Gérez les comptes d'accès à l'espace d'administration et leurs identifiants.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-950 shadow-md hover:bg-gold-light hover:scale-[1.02] active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nouveau Compte Admin
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-medium flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700">✕</button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs font-medium flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-rose-500 hover:text-rose-700">✕</button>
        </div>
      )}

      {/* Admins Table */}
      <div className={`rounded-2xl border ${themeConfig.border} ${themeConfig.bgCard} overflow-hidden shadow-xs`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b ${themeConfig.border} ${isDark ? "bg-slate-800/40" : "bg-stone-50"}`}>
              <tr>
                <th className={`px-6 py-4 font-semibold uppercase tracking-wider ${themeConfig.textSecondary}`}>
                  Nom
                </th>
                <th className={`px-6 py-4 font-semibold uppercase tracking-wider ${themeConfig.textSecondary}`}>
                  Email
                </th>
                <th className={`px-6 py-4 font-semibold uppercase tracking-wider ${themeConfig.textSecondary}`}>
                  Date de Création
                </th>
                <th className={`px-6 py-4 font-semibold uppercase tracking-wider ${themeConfig.textSecondary} text-right`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${themeConfig.border}`}>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-stone-400">
                    Chargement des administrateurs...
                  </td>
                </tr>
              ) : admins && admins.length > 0 ? (
                admins.map((admin: any) => (
                  <tr key={admin.id} className={`${isDark ? "hover:bg-slate-800/30" : "hover:bg-stone-50/60"} transition-colors`}>
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-xs border border-gold/30">
                        {admin.name[0]?.toUpperCase()}
                      </div>
                      <span className={themeConfig.textPrimary}>{admin.name}</span>
                    </td>
                    <td className={`px-6 py-4 ${themeConfig.textSecondary}`}>
                      {admin.email}
                    </td>
                    <td className={`px-6 py-4 ${themeConfig.textSecondary}`}>
                      {new Date(admin.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(admin)}
                          className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:border-gold hover:text-gold transition-colors text-[11px] font-semibold cursor-pointer"
                        >
                          Modifier
                        </button>

                        <button
                          onClick={() => setDeletingId(admin.id)}
                          disabled={admins.length <= 1}
                          className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-colors ${
                            admins.length <= 1
                              ? "border-stone-200 text-stone-400 cursor-not-allowed opacity-50"
                              : "border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                          }`}
                          title={admins.length <= 1 ? "Impossible de supprimer le dernier admin" : "Supprimer cet admin"}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-stone-400">
                    Aucun administrateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD ADMIN */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-md rounded-2xl border ${themeConfig.border} ${themeConfig.bgCard} p-6 shadow-2xl space-y-5`}>
            <div className="flex items-center justify-between border-b border-stone-200/60 pb-3">
              <h3 className={`text-base font-semibold ${themeConfig.textPrimary}`}>
                Ajouter un Administrateur
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-stone-400 hover:text-stone-600 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className={`text-xs font-semibold uppercase tracking-wider ${themeConfig.textSecondary}`}>
                  Nom complet
                </label>
                <input
                  type="text"
                  required
                  placeholder="Fatima Derkaoui"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full rounded-xl border ${themeConfig.border} ${isDark ? "bg-slate-900 text-white" : "bg-stone-50 text-stone-900"} px-4 py-2.5 text-xs focus:border-gold focus:outline-none`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-semibold uppercase tracking-wider ${themeConfig.textSecondary}`}>
                  Adresse Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@himmel.ma"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full rounded-xl border ${themeConfig.border} ${isDark ? "bg-slate-900 text-white" : "bg-stone-50 text-stone-900"} px-4 py-2.5 text-xs focus:border-gold focus:outline-none`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-semibold uppercase tracking-wider ${themeConfig.textSecondary}`}>
                  Mot de passe
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full rounded-xl border ${themeConfig.border} ${isDark ? "bg-slate-900 text-white" : "bg-stone-50 text-stone-900"} px-4 py-2.5 text-xs focus:border-gold focus:outline-none`}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-500 hover:text-stone-800 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-gold text-xs font-semibold uppercase tracking-wider text-stone-950 shadow-md hover:bg-gold-light cursor-pointer"
                >
                  {createMutation.isPending ? "Création..." : "Créer le compte"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ADMIN */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-md rounded-2xl border ${themeConfig.border} ${themeConfig.bgCard} p-6 shadow-2xl space-y-5`}>
            <div className="flex items-center justify-between border-b border-stone-200/60 pb-3">
              <h3 className={`text-base font-semibold ${themeConfig.textPrimary}`}>
                Modifier l'Administrateur
              </h3>
              <button onClick={() => setEditingAdmin(null)} className="text-stone-400 hover:text-stone-600 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-1">
                <label className={`text-xs font-semibold uppercase tracking-wider ${themeConfig.textSecondary}`}>
                  Nom complet
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full rounded-xl border ${themeConfig.border} ${isDark ? "bg-slate-900 text-white" : "bg-stone-50 text-stone-900"} px-4 py-2.5 text-xs focus:border-gold focus:outline-none`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-semibold uppercase tracking-wider ${themeConfig.textSecondary}`}>
                  Adresse Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full rounded-xl border ${themeConfig.border} ${isDark ? "bg-slate-900 text-white" : "bg-stone-50 text-stone-900"} px-4 py-2.5 text-xs focus:border-gold focus:outline-none`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-semibold uppercase tracking-wider ${themeConfig.textSecondary}`}>
                  Nouveau mot de passe (laisser vide pour ne pas changer)
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full rounded-xl border ${themeConfig.border} ${isDark ? "bg-slate-900 text-white" : "bg-stone-50 text-stone-900"} px-4 py-2.5 text-xs focus:border-gold focus:outline-none`}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingAdmin(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-500 hover:text-stone-800 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-gold text-xs font-semibold uppercase tracking-wider text-stone-950 shadow-md hover:bg-gold-light cursor-pointer"
                >
                  {updateMutation.isPending ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-sm rounded-2xl border ${themeConfig.border} ${themeConfig.bgCard} p-6 shadow-2xl space-y-4 text-center`}>
            <div className="mx-auto h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className={`text-base font-semibold ${themeConfig.textPrimary}`}>
              Confirmer la suppression
            </h3>
            <p className={`text-xs ${themeConfig.textSecondary}`}>
              Êtes-vous sûr de vouloir supprimer cet administrateur ? Cette action est irréversible.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                disabled={deleteMutation.isPending}
                className="px-5 py-2 rounded-xl bg-rose-600 text-xs font-semibold uppercase tracking-wider text-white shadow-md hover:bg-rose-700 cursor-pointer"
              >
                {deleteMutation.isPending ? "Suppression..." : "Oui, supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
