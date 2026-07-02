import { useState, useMemo } from 'react';
import { useApp } from './context/AppContext';
import { PROBLEMS, TOPICS } from './data/problems';
import Sidebar from './components/Sidebar';
import TopicSection from './components/TopicSection';
import FilterBar from './components/FilterBar';

const DEFAULT_FILTERS = { diff: 'all', status: 'all', query: '' };

export default function App() {
  const { loading, progress } = useApp();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const problemsByTopic = useMemo(() => {
    const map = {};
    TOPICS.forEach(t => { map[t] = PROBLEMS.filter(p => p.topic === t); });
    return map;
  }, []);

  const totalDone = PROBLEMS.filter(p => progress[p.key]).length;

  return (
    <div className="flex min-h-screen bg-bg font-sans">
      <Sidebar />

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-surface flex items-center justify-between px-4 py-3">
        <div>
          <h1 className="text-[16px] font-bold text-accent">DSA Tracker</h1>
          <p className="text-[10px] text-txt-muted">{totalDone}/{PROBLEMS.length} solved</p>
        </div>
        <a href="/auth/google" className="text-[12px] font-semibold text-txt-muted hover:text-accent transition-colors">
          Sign in
        </a>
      </div>

      {/* Main */}
      <main className="ml-0 md:ml-64 flex-1 min-h-screen pt-16 md:pt-0">
        <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-6">

          {/* Page header */}
          <header className="mb-2">
            <h2 className="text-[28px] font-semibold text-txt-primary tracking-tight leading-none mb-3">
              Problem Sheet<span className="text-accent">.</span>
            </h2>
            <p className="text-[14px] text-txt-muted">
              Track your DSA progress. You've solved <strong className="text-txt-primary">{totalDone}</strong> of {PROBLEMS.length} challenges.
            </p>
          </header>

          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-muted pointer-events-none"
              width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search problems by number or title…"
              value={filters.query}
              onChange={e => setFilters(f => ({ ...f, query: e.target.value.toLowerCase() }))}
              className="w-full bg-surface shadow-elevation-1 rounded-card py-3 pl-10 pr-4 text-[14px] text-txt-primary placeholder:text-txt-muted focus:outline-none focus:shadow-elevation-2 transition-shadow"
            />
          </div>

          {/* Filters */}
          <FilterBar filters={filters} onChange={setFilters} />

          {/* Sections */}
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-card rounded-card animate-pulse" />
              ))}
            </div>
          ) : (() => {
            const hasVisibleProblems = PROBLEMS.some(p => {
              const dMatch = filters.diff === 'all' || p.diff === filters.diff;
              const isDone = !!progress[p.key];
              const sMatch = filters.status === 'all' ? true : filters.status === 'done' ? isDone : !isDone;
              const qMatch = !filters.query || p.title.toLowerCase().includes(filters.query) || String(p.id).includes(filters.query);
              return dMatch && sMatch && qMatch;
            });

            return hasVisibleProblems ? (
              <div className="flex flex-col gap-4">
                {TOPICS.map(topic => (
                  <TopicSection
                    key={topic}
                    topic={topic}
                    problems={problemsByTopic[topic]}
                    filters={filters}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-10 pb-16">
                <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mb-6 shadow-elevation-2 border border-white/5 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-accent" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <h3 className="text-[20px] font-display font-semibold text-txt-primary mb-2 tracking-tight">No problems found</h3>
                <p className="text-[14px] text-txt-muted max-w-[250px] leading-relaxed">
                  Try adjusting your search query or filters to find what you're looking for.
                </p>
              </div>
            );
          })()}
        </div>
      </main>
    </div>
  );
}
