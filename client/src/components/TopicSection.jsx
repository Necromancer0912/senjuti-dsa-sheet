import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TOPIC_ICONS, DIFF_COLORS } from '../data/problems';
import ProblemCard from './ProblemCard';

export default function TopicSection({ topic, problems, filters }) {
  const [open, setOpen] = useState(true);
  const { progress } = useApp();

  // Apply filters
  const filtered = problems.filter(p => {
    const dMatch = filters.diff   === 'all' || p.diff === filters.diff;
    const isDone = !!progress[p.key];
    const sMatch = filters.status === 'all'
      ? true
      : filters.status === 'done' ? isDone : !isDone;
    const qMatch = !filters.query
      || p.title.toLowerCase().includes(filters.query)
      || String(p.id).includes(filters.query);
    return dMatch && sMatch && qMatch;
  });

  const diffOrder = { Easy: 1, Medium: 2, Hard: 3 };
  const sortedFiltered = [...filtered].sort((a, b) => {
    if (diffOrder[a.diff] !== diffOrder[b.diff]) {
      return diffOrder[a.diff] - diffOrder[b.diff];
    }
    return a.id - b.id;
  });

  const total = problems.length;
  const done  = problems.filter(p => progress[p.key]).length;
  const pct   = total ? Math.round((done / total) * 100) : 0;

  const diffCount = { Easy: 0, Medium: 0, Hard: 0 };
  problems.forEach(p => diffCount[p.diff]++);

  // Don't render section if query+filter yields nothing
  if (filtered.length === 0 && (filters.query || filters.diff !== 'all' || filters.status !== 'all')) {
    return null;
  }

  return (
    <div className="bg-card rounded-card overflow-hidden shadow-elevation-1 mb-4">
      {/* Accordion Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-card-hover transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          {/* Chevron */}
          <div className={`w-5 h-5 flex items-center justify-center text-txt-muted transition-transform duration-300 ${open ? 'rotate-90' : ''}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
            </svg>
          </div>
          <h2 className="text-[15px] font-medium text-txt-primary tracking-tight">{topic}</h2>
        </div>

        {/* Progress bar + count */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="w-24 h-1 bg-surface rounded-full overflow-hidden hidden sm:block">
            <div
              className="h-full bg-border transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[13px] font-medium text-txt-muted w-12 text-right">{done} / {total}</span>
        </div>
      </button>

      {/* Accordion Body */}
      <div className={`accordion-content ${open ? 'open' : ''}`}>
        <div className="bg-bg">
          {sortedFiltered.length > 0 ? (
            <div className="flex flex-col pt-2 pb-2">
                {sortedFiltered.map(p => (
                  <ProblemCard key={p.key} problem={p} />
                ))}
              </div>
          ) : (
            <div className="py-10 text-center text-txt-muted text-[14px]">
              No problems match the current filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
