"use client";
import { useActionState } from "react";
import type { Room } from "@prisma/client";
import { updateRoom, type AdminRoomState } from "@/lib/actions/admin-rooms";

const initialState: AdminRoomState = { status: "idle" };

export function RoomEditForm({ room }: { room: Room }) {
  const boundAction = updateRoom.bind(null, room.id);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  return (
    <form action={formAction} className="bg-card border border-border p-6 space-y-5 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="font-sans text-xs tracking-wide uppercase text-muted-foreground block mb-1.5">
            Sous-titre (FR)
          </label>
          <input
            name="subtitle"
            defaultValue={room.subtitle}
            className="w-full border border-border bg-background px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-villa-terracotta"
          />
        </div>
        <div>
          <label className="font-sans text-xs tracking-wide uppercase text-muted-foreground block mb-1.5">
            Sous-titre (EN)
          </label>
          <input
            name="subtitleEn"
            defaultValue={room.subtitleEn}
            className="w-full border border-border bg-background px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-villa-terracotta"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label className="font-sans text-xs tracking-wide uppercase text-muted-foreground block mb-1.5">
            Prix / nuit (€)
          </label>
          <input
            type="number"
            step="1"
            min="0"
            name="price"
            defaultValue={room.price}
            required
            className="w-full border border-border bg-background px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-villa-terracotta"
          />
        </div>
        <div>
          <label className="font-sans text-xs tracking-wide uppercase text-muted-foreground block mb-1.5">
            Surface
          </label>
          <input
            name="size"
            defaultValue={room.size}
            placeholder="30 m²"
            className="w-full border border-border bg-background px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-villa-terracotta"
          />
        </div>
        <div>
          <label className="font-sans text-xs tracking-wide uppercase text-muted-foreground block mb-1.5">
            Capacité max
          </label>
          <input
            type="number"
            min="1"
            name="maxGuests"
            defaultValue={room.maxGuests}
            className="w-full border border-border bg-background px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-villa-terracotta"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="font-sans text-xs tracking-wide uppercase text-muted-foreground block mb-1.5">
            Type de lit (FR)
          </label>
          <input
            name="bedType"
            defaultValue={room.bedType}
            className="w-full border border-border bg-background px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-villa-terracotta"
          />
        </div>
        <div>
          <label className="font-sans text-xs tracking-wide uppercase text-muted-foreground block mb-1.5">
            Type de lit (EN)
          </label>
          <input
            name="bedTypeEn"
            defaultValue={room.bedTypeEn}
            className="w-full border border-border bg-background px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-villa-terracotta"
          />
        </div>
      </div>

      <div>
        <label className="font-sans text-xs tracking-wide uppercase text-muted-foreground block mb-1.5">
          Équipements (FR, séparés par des virgules)
        </label>
        <textarea
          name="amenities"
          defaultValue={room.amenities}
          rows={2}
          className="w-full border border-border bg-background px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-villa-terracotta"
        />
      </div>
      <div>
        <label className="font-sans text-xs tracking-wide uppercase text-muted-foreground block mb-1.5">
          Équipements (EN, séparés par des virgules)
        </label>
        <textarea
          name="amenitiesEn"
          defaultValue={room.amenitiesEn}
          rows={2}
          className="w-full border border-border bg-background px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-villa-terracotta"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-end">
        <div>
          <label className="font-sans text-xs tracking-wide uppercase text-muted-foreground block mb-1.5">
            Ordre d&apos;affichage
          </label>
          <input
            type="number"
            name="order"
            defaultValue={room.order}
            className="w-full border border-border bg-background px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-villa-terracotta"
          />
        </div>
        <label className="flex items-center gap-2 font-sans text-sm text-foreground pb-2.5">
          <input type="checkbox" name="featured" defaultChecked={room.featured} className="size-4" />
          Mise en avant
        </label>
      </div>

      {state.status === "error" && <p className="font-sans text-sm text-destructive">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="px-8 py-3 bg-villa-terracotta hover:bg-villa-terracotta/90 disabled:opacity-50 text-white font-sans text-xs tracking-[0.15em] uppercase transition-colors"
      >
        {pending ? "…" : "Enregistrer"}
      </button>
    </form>
  );
}
