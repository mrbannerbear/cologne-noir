type NotesPyramidProps = {
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
};

function NoteRow({ label, notes }: { label: string; notes: string[] }) {
  if (!notes.length) return null;

  return (
    <div className="flex flex-col py-4 border-b border-border/80 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-6">
      <span className="label-caps text-xs text-muted w-24 shrink-0 font-medium">{label}</span>
      <p className="text-xs text-foreground mt-1 sm:mt-0 font-sans tracking-wide">
        {notes.join(", ")}
      </p>
    </div>
  );
}

export function NotesPyramid({ topNotes, middleNotes, baseNotes }: NotesPyramidProps) {
  return (
    <div className="border-t border-b border-border/80 mt-6">
      <NoteRow label="Top" notes={topNotes} />
      <NoteRow label="Middle" notes={middleNotes} />
      <NoteRow label="Base" notes={baseNotes} />
    </div>
  );
}
