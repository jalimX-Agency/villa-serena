"use client";
import { useActionState, useEffect, useRef } from "react";
import { Check, Loader2 } from "lucide-react";
import { changePassword, type PasswordState } from "@/lib/actions/admin-settings";
import { btn, field, labelCls } from "@/components/admin/ui";

const initial: PasswordState = { status: "idle" };

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, initial);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.status === "success") ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="space-y-4 p-5">
      <div>
        <label className={labelCls}>Mot de passe actuel</label>
        <input type="password" name="current" required autoComplete="current-password" className={field} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Nouveau mot de passe</label>
          <input type="password" name="next" required minLength={10} autoComplete="new-password" className={field} />
        </div>
        <div>
          <label className={labelCls}>Confirmer</label>
          <input type="password" name="confirm" required minLength={10} autoComplete="new-password" className={field} />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className={btn.primary}>
          {pending && <Loader2 className="size-4 animate-spin" />} Mettre à jour
        </button>
        {state.status === "error" && <p className="text-sm text-red-600">{state.error}</p>}
        {state.status === "success" && (
          <p className="flex items-center gap-1.5 text-sm text-emerald-600"><Check className="size-4" /> Mot de passe modifié</p>
        )}
      </div>
    </form>
  );
}
