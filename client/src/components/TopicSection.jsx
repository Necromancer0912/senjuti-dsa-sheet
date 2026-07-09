import { useState, useRef, useEffect } from 'react';
import ProblemCard from './ProblemCard';
import { useApp } from '../context/AppContext';


// Animated SVG progress ring
function ProgressRing({ pct, color = '#a855f7', size = 44 }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
      <circle
        cx={size/2} cy={size/2} r={r}
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        className="ring-progress"
        style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </svg>
  );
}

import TopicIcon from './TopicIcon';

export default function TopicSection({ topic, problems, filters }) {
  const { progress } = useApp();
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);

  // Filtered problems for display
  const filtered = problems.filter(p => {
    if (filters.diff !== 'all' && p.diff !== filters.diff) return false;
    if (filters.status === 'done'    && !progress[p.id]) return false;
    if (filters.status === 'pending' &&  progress[p.id]) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !String(p.id).includes(q)) return false;
    }
    return true;
  });

  const total = problems.length;
  const done  = problems.filter(p => progress[p.id]).length;
  const pct   = total ? done / total : 0;

  // Auto-open if search/filter is active and there are matches
  useEffect(() => {
    const hasFilter = filters.diff !== 'all' || filters.status !== 'all' || filters.query;
    if (hasFilter && filtered.length > 0) setOpen(true);
  }, [filters]);

  const ringColor = pct === 1 ? '#10b981' : pct > 0.5 ? '#f59e0b' : '#a855f7';

  const diffCounts = {
    Easy:   problems.filter(p => p.diff === 'Easy').length,
    Medium: problems.filter(p => p.diff === 'Medium').length,
    Hard:   problems.filter(p => p.diff === 'Hard').length,
  };

  return (
    <div className={`topic-card ${open ? 'open' : ''} animate-fade-in`}>
      {/* ── Header ── */}
      <div className="topic-header" onClick={() => setOpen(o => !o)}>
        {/* Icon + Title */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-accent flex-shrink-0">
            <TopicIcon topic={topic} className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-[16px] font-600 text-txt-primary truncate m-0 leading-tight">{topic}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[11px] text-txt-muted">{done}/{total} done</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-easy font-medium">{diffCounts.Easy}E</span>
                <span className="text-[10px] text-txt-muted">·</span>
                <span className="text-[10px] text-medium font-medium">{diffCounts.Medium}M</span>
                <span className="text-[10px] text-txt-muted">·</span>
                <span className="text-[10px] text-hard font-medium">{diffCounts.Hard}H</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Ring */}
        <div className="relative flex-shrink-0">
          <ProgressRing pct={pct} color={ringColor} size={44} />
          {pct === 1 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-easy text-xs">✓</span>
            </div>
          )}
        </div>

        {/* Chevron */}
        <svg
          width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"
          viewBox="0 0 24 24"
          className="text-txt-muted flex-shrink-0 transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* ── Problem List ── */}
      <div
        ref={contentRef}
        className="accordion-content"
        style={{ maxHeight: open ? '9999px' : '0', opacity: open ? 1 : 0 }}
      >
        {/* Table header */}
        {open && filtered.length > 0 && (
          <div className="flex items-center gap-4 px-5 py-2 border-t border-white/5">
            <div className="w-5 flex-shrink-0" />
            <span className="flex-1 text-[11px] text-txt-muted uppercase tracking-wider font-medium">Problem</span>
            <span className="text-[11px] text-txt-muted uppercase tracking-wider font-medium hidden sm:block w-16 text-center">Difficulty</span>
            <span className="text-[11px] text-txt-muted uppercase tracking-wider font-medium w-16 text-center">Link</span>
          </div>
        )}

        {open && filtered.length === 0 && (
          <div className="px-5 py-8 text-center border-t border-white/5">
            <p className="text-txt-muted text-sm">No problems match your filters.</p>
          </div>
        )}

        {open && filtered.map((problem, i) => (
          <ProblemCard key={problem.key} problem={problem} index={i} />
        ))}
      </div>
    </div>
  );
}
