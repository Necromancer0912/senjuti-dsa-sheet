export default function FilterBar({ filters, onChange }) {
  const { diff, status, query } = filters;

  const setFilter = (key, val) => onChange({ ...filters, [key]: val });

  const diffOptions = [
    { val: 'all',    label: 'All' },
    { val: 'Easy',   label: 'Easy' },
    { val: 'Medium', label: 'Medium' },
    { val: 'Hard',   label: 'Hard' },
  ];
  const statusOptions = [
    { val: 'all',     label: 'All' },
    { val: 'pending', label: 'Todo' },
    { val: 'done',    label: 'Done' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 py-4">
      {/* Search */}
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <svg
          width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-muted pointer-events-none"
        >
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => setFilter('query', e.target.value)}
          placeholder="Search problems..."
          className="search-input"
          aria-label="Search problems"
          id="search-problems"
        />
        {query && (
          <button
            onClick={() => setFilter('query', '')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-txt-muted hover:text-txt-primary transition-colors"
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="h-5 w-px bg-white/8 hidden sm:block" />

      {/* Difficulty Filters */}
      <div className="flex items-center gap-1.5" role="group" aria-label="Filter by difficulty">
        {diffOptions.map(o => (
          <button
            key={o.val}
            onClick={() => setFilter('diff', o.val)}
            className={`filter-pill ${diff === o.val ? 'active' : ''}`}
            id={`filter-diff-${o.val}`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="h-5 w-px bg-white/8 hidden sm:block" />

      {/* Status Filters */}
      <div className="flex items-center gap-1.5" role="group" aria-label="Filter by status">
        {statusOptions.map(o => (
          <button
            key={o.val}
            onClick={() => setFilter('status', o.val)}
            className={`filter-pill ${status === o.val ? 'active' : ''}`}
            id={`filter-status-${o.val}`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* Clear All */}
      {(diff !== 'all' || status !== 'all' || query) && (
        <button
          onClick={() => onChange({ diff: 'all', status: 'all', query: '' })}
          className="text-[12px] text-txt-muted hover:text-accent transition-colors flex items-center gap-1"
        >
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          Clear
        </button>
      )}
    </div>
  );
}
