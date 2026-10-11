import React, { useState } from 'react';
import { StickyNote, Check } from 'lucide-react';

export const QuickNotesWidget: React.FC = () => {
  const [note, setNote] = useState<string>(
    '• Prof Miller office hours: Thurs 2-4 PM (Gates 392)\n• Bring printed draft of literature review\n• Group project sync on Friday 6 PM on Discord'
  );
  const [saved, setSaved] = useState<boolean>(false);

  const handleBlur = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-amber-50/50 rounded-2xl border border-amber-200/70 p-4.5 shadow-2xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
            <StickyNote className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
            Quick Study Scratchpad
          </h3>
        </div>

        {saved && (
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
            <Check className="w-3 h-3" /> Saved
          </span>
        )}
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onBlur={handleBlur}
        rows={4}
        placeholder="Type quick study notes, zoom links, formulas..."
        className="w-full bg-white/80 p-3 rounded-xl border border-amber-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-200 resize-none font-mono leading-relaxed"
      />

      <div className="mt-2 text-[10px] text-amber-800 flex justify-between items-center">
        <span>Auto-saved locally for this session</span>
        <span>{note.length} chars</span>
      </div>
    </div>
  );
};
