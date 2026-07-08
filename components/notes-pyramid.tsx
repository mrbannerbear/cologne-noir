type NotesPyramidProps = {
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
};

function NoteRow({ label, notes }: { label: string; notes: string[] }) {
  return (
    <article className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
      <p className="label-caps text-muted">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {notes.map((note) => (
          <span key={note} className="glass rounded-full px-3 py-1 text-xs text-foreground">
            {note}
          </span>
        ))}
      </div>
    </article>
  );
}

export function NotesPyramid({ topNotes, middleNotes, baseNotes }: NotesPyramidProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <NoteRow label="Top" notes={topNotes} />
      <NoteRow label="Middle" notes={middleNotes} />
      <NoteRow label="Base" notes={baseNotes} />
    </div>
  );
}
