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

  const totalDone  = PROBLEMS.filter(p => progress[p.id]).length;
  const totalCount = PROBLEMS.length;

  // Decide which topics have visible results given the current filter
  const visibleTopics = TOPICS.filter(topic => {
    const probs = problemsByTopic[topic] || [];
    return probs.some(p => {
      if (filters.diff !== 'all' && p.diff !== filters.diff) return false;
      if (filters.status === 'done'    && !progress[p.id]) return false;
      if (filters.status === 'pending' &&  progress[p.id]) return false;
      if (filters.query) {
        const q = filters.query.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !String(p.id).includes(q)) return false;
      }
      return true;
    });
  });

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Ambient background blobs */}
      <div className="bg-blob w-96 h-96 opacity-10" style={{ background: '#3b82f6', top: '-10%', left: '-5%' }} />
      <div className="bg-blob w-80 h-80 opacity-8" style={{ background: '#1d4ed8', bottom: '10%', right: '-5%' }} />

      {/* ── Sidebar ── */}
      <Sidebar />

      {/* ── Main Content ── */}
      <main className="flex-1 min-w-0 overflow-auto" id="main-content">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="font-display text-2xl font-700 text-txt-primary mb-1">Problem Set</h1>
            <p className="text-sm text-txt-muted">
              Track your progress across {TOPICS.length} topics · {totalDone}/{totalCount} problems solved
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <p className="text-txt-muted text-sm">Loading your progress...</p>
              </div>
            </div>
          )}

          {/* Filter Bar */}
          {!loading && <FilterBar filters={filters} onChange={setFilters} />}

          {/* Results summary when filtering */}
          {!loading && (filters.diff !== 'all' || filters.status !== 'all' || filters.query) && (
            <p className="text-[12px] text-txt-muted mb-4">
              Showing {visibleTopics.length} topic{visibleTopics.length !== 1 ? 's' : ''} with matching problems
            </p>
          )}

          {/* Topic Sections */}
          {!loading && (
            <div className="space-y-3">
              {(visibleTopics.length > 0 ? visibleTopics : TOPICS).map(topic => (
                <TopicSection
                  key={topic}
                  topic={topic}
                  problems={problemsByTopic[topic] || []}
                  filters={filters}
                />
              ))}

              {visibleTopics.length === 0 && (filters.diff !== 'all' || filters.status !== 'all' || filters.query) && (
                <div className="text-center py-16">
                  <svg className="w-10 h-10 text-txt-muted mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                  </svg>
                  <p className="text-txt-secondary font-medium">No problems found</p>
                  <p className="text-txt-muted text-sm mt-1">Try adjusting your filters</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
