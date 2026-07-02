import { useApp } from '../context/AppContext';
import { DIFF_COLORS } from '../data/problems';
import confetti from 'canvas-confetti';

export default function ProblemCard({ problem }) {
  const { progress, toggleProblem } = useApp();
  const isDone = !!progress[problem.key];
  const dc = DIFF_COLORS[problem.diff];

  function handleCheck(e) {
    e.stopPropagation();
    toggleProblem(problem.key, !isDone);
  }



  // Map difficulty to explicit tailwind classes to prevent purging
  const diffClasses = {
    Easy:   'bg-easy-bg text-easy',
    Medium: 'bg-medium-bg text-medium',
    Hard:   'bg-hard-bg text-hard'
  };

  return (
    <div className="grid grid-cols-[60px_1fr_80px_80px] gap-4 px-6 py-3 items-center hover:bg-surface transition-colors">
      
      {/* 1. Status Checkbox */}
      <div className="flex justify-center">
        <button
          onClick={handleCheck}
          className={`w-[18px] h-[18px] rounded-[3px] border flex items-center justify-center transition-colors ${
            isDone ? 'bg-accent border-accent text-bg' : 'border-txt-muted hover:border-accent bg-transparent'
          }`}
        >
          {isDone && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}
        </button>
      </div>

      {/* 2. Problem Title */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 min-w-0">
        <span className="text-[14px] font-medium text-txt-primary truncate">
          {problem.title}
        </span>
      </div>

      {/* 3. Practice */}
      <div className="w-20 flex justify-center">
        <a
          href={problem.lcUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-accent hover:text-accent-dim hover:underline text-[13px] font-semibold flex items-center gap-1"
        >
          Solve
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
          </svg>
        </a>
      </div>

      {/* 4. Difficulty Tag */}
      <div className="w-20 flex justify-center">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${diffClasses[problem.diff]}`}>
          {problem.diff}
        </span>
      </div>
    </div>
  );
}
