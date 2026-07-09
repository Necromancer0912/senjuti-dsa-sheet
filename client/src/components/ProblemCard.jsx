import { useState, useCallback, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { DIFF_COLORS } from '../data/problems';
import confetti from 'canvas-confetti';

export default function ProblemCard({ problem, index }) {
  const { progress, toggleProblem } = useApp();
  const isDone = !!progress[problem.key];
  const [animating, setAnimating] = useState(false);
  const checkRef = useRef(null);

  const diffBadge = {
    Easy:   'badge-easy',
    Medium: 'badge-medium',
    Hard:   'badge-hard',
  };

  const handleCheck = useCallback((e) => {
    e.stopPropagation();
    if (!isDone) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 400);
      // Fire small confetti burst on completion
      confetti({
        particleCount: 20,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#e85d75', '#ff9eb5', '#ffffff'],
        ticks: 60,
        scalar: 0.7,
      });
    }
    toggleProblem(problem.key, !isDone);
  }, [isDone, problem.key, toggleProblem]);

  return (
    <div
      className={`problem-row flex items-center gap-4 px-5 py-3.5 ${isDone ? 'done' : ''}`}
      style={{ animationDelay: `${index * 20}ms` }}
    >
      {/* Checkbox */}
      <button
        onClick={handleCheck}
        className={`check-box flex-shrink-0 ${isDone ? 'done' : ''} ${animating ? 'animate-check' : ''}`}
        aria-label={isDone ? 'Mark as undone' : 'Mark as done'}
      >
        {isDone && (
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="2 6 5 9 10 3" />
          </svg>
        )}
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <span className="problem-title text-[13.5px] font-medium text-txt-primary leading-snug truncate block">
          {problem.title}
        </span>
      </div>

      {/* Difficulty Badge */}
      <span className={`${diffBadge[problem.diff]} px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0 hidden sm:inline-flex`}>
        {problem.diff}
      </span>

      {/* Solve Link */}
      <a
        href={problem.lcUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="solve-link flex-shrink-0"
      >
        Solve
        <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
        </svg>
      </a>
    </div>
  );
}
