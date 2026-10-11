"use client";
import { useActionState } from "react";
import type { Room } from "@prisma/client";
import { Check, Loader2 } from "lucide-react";
import { updateRoom, uploadRoomImage, type AdminRoomState } from "@/lib/actions/admin-rooms";
import { ImageListEditor } from "@/components/admin/ImageListEditor";
import { Card, CardHeader, btn, field, labelCls } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

const initialState: AdminRoomState = { status: "idle" };

export function RoomEditForm({ room }: { room: Room }) {
  const [state, formAction, pending] = useActionState(updateRoom.bind(null, room.id), initialState);
  const saved = state.status === "success" && !pending;

  return (
    <form action={formAction} className="space-y-6 pb-24">
      <Card>
        <CardHeader title="Photos" />
        <div className="p-5">
          <ImageListEditor name="images" initial={room.images.split(",").filter(Boolean)} upload={uploadRoomImage} />
        </div>
      </Card>

      <Card>
        <CardHeader title="Textes" />
        <div className="p-5 space-y-5">
          <div className="hidden sm:grid grid-cols-2 gap-5 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
            <span>Français</span>
            <span>English</span>
          </div>
          <Pair label="Nom" fr={<input name="name" required defaultValue={room.name} className={field} />}
            en={<input name="nameEn" defaultValue={room.nameEn} className={field} />} />
          <Pair label="Sous-titre" fr={<input name="subtitle" defaultValue={room.subtitle} className={field} />}
            en={<input name="subtitleEn" defaultValue={room.subtitleEn} className={field} />} />
          <Pair label="Description courte (cartes)"
            fr={<textarea name="description" rows={3} defaultValue={room.description} className={field} />}
            en={<textarea name="descriptionEn" rows={3} defaultValue={room.descriptionEn} className={field} />} />
          <Pair label="Description longue (page de la suite)"
            fr={<textarea name="longDescription" rows={6} defaultValue={room.longDescription} className={field} />}
            en={<textarea name="longDescriptionEn" rows={6} defaultValue={room.longDescriptionEn} className={field} />} />
          <Pair label="Équipements — séparés par des virgules"
            fr={<textarea name="amenities" rows={2} defaultValue={room.amenities} className={field} />}
            en={<textarea name="amenitiesEn" rows={2} defaultValue={room.amenitiesEn} className={field} />} />
          <Pair label="Literie" fr={<input name="bedType" defaultValue={room.bedType} className={field} />}
            en={<input name="bedTypeEn" defaultValue={room.bedTypeEn} className={field} />} />
        </div>
      </Card>

      <Card>
        <CardHeader title="Informations" />
        <div className="grid gap-5 p-5 sm:grid-cols-3">
          <div>
            <label className={labelCls}>Surface</label>
            <input name="size" defaultValue={room.size} placeholder="30 m²" className={field} />
          </div>
          <div>
            <label className={labelCls}>Voyageurs max.</label>
            <input type="number" min={1} name="maxGuests" defaultValue={room.maxGuests} className={field} />
          </div>
          <div>
            <label className={labelCls}>Ordre d&apos;affichage</label>
            <input type="number" name="order" defaultValue={room.order} className={field} />
          </div>
          <label className="sm:col-span-3 flex items-center gap-2 text-sm text-stone-700">
            <input type="checkbox" name="featured" defaultChecked={room.featured} className="size-4 accent-villa-terracotta" />
            Mettre en avant sur la page d&apos;accueil
          </label>
        </div>
      </Card>

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/90 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-4 px-4 py-3 sm:px-6 lg:px-10">
          {state.status === "error" && <p className="text-sm text-red-600">{state.error}</p>}
          {saved && (
            <p className="flex items-center gap-1.5 text-sm text-emerald-600"><Check className="size-4" /> Enregistré</p>
          )}
          <button type="submit" disabled={pending} className={cn(btn.primary, "min-w-36")}>
            {pending && <Loader2 className="size-4 animate-spin" />} Enregistrer
          </button>
        </div>
      </div>
    </form>
  );
}

function Pair({ label, fr, en }: { label: string; fr: React.ReactNode; en: React.ReactNode }) {
  return (
    <div>
      <p className={labelCls}>{label}</p>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-5">
        <div className="relative">
          <span className="sm:hidden text-[10px] font-semibold text-stone-400">FR</span>
          {fr}
        </div>
        <div className="relative">
          <span className="sm:hidden text-[10px] font-semibold text-stone-400">EN</span>
          {en}
        </div>
      </div>
    </div>
  );
}
