"use client";
import { useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TableKit } from "@tiptap/extension-table";
import Image from "@tiptap/extension-image";
import { compressImage } from "@/lib/compress-image";
import { uploadBlogImage } from "@/lib/actions/admin-blog";
import {
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link2,
  Link2Off,
  Table as TableIcon,
  Undo2,
  Redo2,
  Code2,
  ImagePlus,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Article editor for non-technical editors: headings, lists, links, quotes and simple tables.
 * The HTML goes into a hidden input named `name`; it is sanitised again on the server.
 */
export function RichTextEditor({ name, initial, placeholder }: { name: string; initial: string; placeholder?: string }) {
  const [html, setHtml] = useState(initial);
  const [source, setSource] = useState(false);

  const editor = useEditor({
    immediatelyRender: false, // avoids SSR hydration mismatch in Next.js
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false, autolink: true } }),
      TableKit.configure({ table: { resizable: false } }),
      Image.configure({ inline: false }),
    ],
    content: initial,
    editorProps: {
      attributes: {
        class: "prose-villa min-h-[22rem] px-5 py-4 focus:outline-none",
        "data-placeholder": placeholder ?? "",
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  return (
    <div className="rounded-xl ring-1 ring-stone-200 bg-white overflow-hidden">
      <input type="hidden" name={name} value={html} />
      <Toolbar editor={editor} source={source} onToggleSource={() => setSource((s) => !s)} />
      {source ? (
        <textarea
          value={html}
          onChange={(e) => {
            setHtml(e.target.value);
            editor?.commands.setContent(e.target.value, { emitUpdate: false });
          }}
          spellCheck={false}
          className="block w-full min-h-[22rem] px-5 py-4 font-mono text-xs text-stone-700 focus:outline-none"
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
}

function Toolbar({ editor, source, onToggleSource }: { editor: Editor | null; source: boolean; onToggleSource: () => void }) {
  const [uploading, setUploading] = useState(false);
  if (!editor) return <div className="h-11 border-b border-stone-200 bg-stone-50" />;

  // Photo in the text: compressed in the browser, uploaded to R2, then inserted with its description.
  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const fd = new FormData();
        fd.set("file", await compressImage(file));
        const res = await uploadBlogImage(fd);
        if (res.url) {
          const alt = window.prompt("Description de la photo (pour Google et l'accessibilité)", "") ?? "";
          editor.chain().focus().setImage({ src: res.url, alt }).run();
        } else window.alert(res.error ?? "Erreur d'envoi.");
      } catch (e) {
        window.alert(e instanceof Error ? e.message : "Erreur d'envoi.");
      }
      setUploading(false);
    };
    input.click();
  };

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Adresse du lien (ex. /fr/suites ou https://…)", prev ?? "");
    if (url === null) return;
    if (url === "") editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const items: { icon: typeof Bold; label: string; run: () => void; active?: boolean; disabled?: boolean }[] = [
    { icon: Heading2, label: "Titre de section (H2)", run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
    { icon: Heading3, label: "Sous-titre (H3)", run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
    { icon: Bold, label: "Gras", run: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
    { icon: Italic, label: "Italique", run: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
    { icon: List, label: "Liste à puces", run: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
    { icon: ListOrdered, label: "Liste numérotée", run: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
    { icon: Quote, label: "Citation", run: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote") },
    { icon: Link2, label: "Ajouter un lien", run: setLink, active: editor.isActive("link") },
    { icon: Link2Off, label: "Retirer le lien", run: () => editor.chain().focus().unsetLink().run(), disabled: !editor.isActive("link") },
    { icon: uploading ? Loader2 : ImagePlus, label: "Insérer une photo", run: addImage, disabled: uploading },
    { icon: TableIcon, label: "Insérer un tableau", run: () => editor.chain().focus().insertTable({ rows: 3, cols: 2, withHeaderRow: true }).run() },
    { icon: Undo2, label: "Annuler", run: () => editor.chain().focus().undo().run(), disabled: !editor.can().undo() },
    { icon: Redo2, label: "Rétablir", run: () => editor.chain().focus().redo().run(), disabled: !editor.can().redo() },
  ];

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-stone-200 bg-stone-50 px-2 py-1.5">
      {!source &&
        items.map(({ icon: Icon, label, run, active, disabled }) => (
          <button
            key={label}
            type="button"
            title={label}
            aria-label={label}
            onClick={run}
            disabled={disabled}
            className={cn(
              "rounded-md p-2 text-stone-600 hover:bg-white hover:text-stone-900 disabled:opacity-30",
              active && "bg-white text-villa-terracotta shadow-sm"
            )}
          >
            <Icon className="size-4" />
          </button>
        ))}
      {editor.isActive("table") && !source && (
        <span className="ml-1 flex items-center gap-1 text-[11px] text-stone-500">
          <button type="button" className="rounded px-1.5 py-1 hover:bg-white" onClick={() => editor.chain().focus().addRowAfter().run()}>+ ligne</button>
          <button type="button" className="rounded px-1.5 py-1 hover:bg-white" onClick={() => editor.chain().focus().deleteRow().run()}>− ligne</button>
          <button type="button" className="rounded px-1.5 py-1 hover:bg-white" onClick={() => editor.chain().focus().deleteTable().run()}>Supprimer le tableau</button>
        </span>
      )}
      <button
        type="button"
        title="Voir le code HTML"
        onClick={onToggleSource}
        className={cn("ml-auto rounded-md p-2 text-stone-500 hover:bg-white hover:text-stone-900", source && "bg-white text-villa-terracotta shadow-sm")}
      >
        <Code2 className="size-4" />
      </button>
    </div>
  );
}
