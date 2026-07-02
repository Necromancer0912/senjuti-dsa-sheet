export default function FilterBar({ filters, onChange }) {
  function set(key, val) {
    onChange({ ...filters, [key]: val });
  }

  const chip = (key, val, label, extra = '') =>
    `px-4 py-1.5 rounded-full text-[12px] font-semibold transition-colors cursor-pointer ${
      filters[key] === val
        ? `bg-accent text-bg shadow-elevation-1`
        : `bg-card text-txt-muted hover:bg-card-hover hover:text-txt-primary shadow-sm`
    } ${extra}`;

  return (
    <div className="flex flex-col gap-3 p-5 bg-surface shadow-elevation-1 rounded-card z-40">
      {/* Difficulty */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-medium text-txt-muted uppercase tracking-wider w-16 shrink-0">Difficulty</span>
        {['all', 'Easy', 'Medium', 'Hard'].map(v => {
          let activeClass = '';
          if (filters.diff === v && v !== 'all') {
            if (v === 'Easy') activeClass = 'bg-easy text-bg shadow-elevation-1';
            else if (v === 'Medium') activeClass = 'bg-medium text-bg shadow-elevation-1';
            else activeClass = 'bg-hard text-bg shadow-elevation-1';
          }
          return (
            <button
              key={v}
              onClick={() => set('diff', v)}
              className={
                activeClass
                  ? `px-3 py-1.5 rounded-card text-[12px] font-semibold transition-colors cursor-pointer ${activeClass}`
                  : chip('diff', v, v)
              }
            >
              {v === 'all' ? 'All' : v}
            </button>
          );
        })}
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-semibold text-txt-muted uppercase tracking-widest w-16 shrink-0">Status</span>
        {[
          { val: 'all',  label: 'All' },
          { val: 'done', label: 'Done' },
          { val: 'todo', label: 'Todo' },
        ].map(({ val, label }) => (
          <button key={val} onClick={() => set('status', val)} className={chip('status', val, label)}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
