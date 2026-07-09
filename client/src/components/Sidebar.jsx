import { useApp } from '../context/AppContext';
import { PROBLEMS, TOPICS } from '../data/problems';
import TopicIcon from './TopicIcon';

export default function Sidebar() {
  const { user, progress, loading } = useApp();

  const totalDone  = PROBLEMS.filter(p => progress[p.id]).length;
  const totalCount = PROBLEMS.length;
  const pct = totalCount ? Math.round((totalDone / totalCount) * 100) : 0;

  // Per-topic stats
  const topicStats = TOPICS.map(topic => {
    const probs = PROBLEMS.filter(p => p.topic === topic);
    const done  = probs.filter(p => progress[p.id]).length;
    return { topic, done, total: probs.length, pct: probs.length ? done / probs.length : 0 };
  });

  const handleLogin  = () => { window.location.href = '/auth/google'; };
  const handleLogout = () => { window.location.href = '/auth/logout'; };

  const avatarUrl = user?.avatarSeed
    ? `https://api.dicebear.com/9.x/shapes/svg?seed=${user.avatarSeed}&backgroundColor=0a172c,040d1a&shapeColor=3b82f6,2563eb`
    : null;

  return (
    <aside className="sidebar w-64 flex flex-col" role="navigation" aria-label="Main navigation">
      {/* ── Logo / Branding ── */}
      <div className="px-6 pt-7 pb-6 border-b border-white/5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-white text-sm font-bold font-display">S</div>
          <div>
            <h1 className="font-display font-700 text-[15px] text-txt-primary leading-tight">DSA Tracker</h1>
            <p className="text-[11px] text-txt-muted leading-tight">Senjuti Ghosal</p>
          </div>
        </div>
      </div>

      {/* ── User Profile ── */}
      <div className="px-4 py-4 border-b border-white/5">
        {loading ? (
          <div className="h-14 rounded-xl bg-surface2 animate-pulse" />
        ) : user ? (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface2 border border-white/5">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-9 h-9 rounded-full ring-2 ring-accent/30 flex-shrink-0" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm flex-shrink-0">
                {user.name?.[0] || '?'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-txt-primary truncate">{user.name}</p>
              <p className="text-[11px] text-txt-muted truncate">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex-shrink-0 text-txt-muted hover:text-accent transition-colors p-1.5 rounded-lg hover:bg-accent/10"
              title="Sign out"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            id="google-login-btn"
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-surface2 border border-white/8 hover:border-accent/30 hover:bg-accent/5 transition-all text-[13px] font-medium text-txt-primary group"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Sign in with Google</span>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-txt-muted group-hover:text-accent transition-colors">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Overall Progress ── */}
      <div className="px-4 py-4 border-b border-white/5">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] text-txt-muted uppercase tracking-wider font-medium">Overall Progress</span>
            <span className="font-display text-[13px] font-600 text-accent">{pct}%</span>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-accent rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[11px] text-txt-muted">{totalDone} of {totalCount} solved</p>
        </div>
      </div>

      {/* ── Topic List ── */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <p className="text-[10px] text-txt-muted uppercase tracking-widest font-medium px-2 mb-2">Topics</p>
        <nav className="space-y-0.5">
          {topicStats.map(({ topic, done, total, pct }) => (
            <div key={topic} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-surface2 transition-colors group cursor-pointer">
              <span className="text-txt-secondary group-hover:text-accent transition-colors flex-shrink-0">
                <TopicIcon topic={topic} className="w-4 h-4" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-medium text-txt-secondary group-hover:text-txt-primary transition-colors truncate">{topic}</span>
                  <span className="text-[10px] text-txt-muted ml-1">{done}/{total}</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct * 100}%`,
                      background: pct === 1 ? '#10b981' : pct > 0.5 ? '#f59e0b' : '#3b82f6'
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* ── Footer ── */}
      <div className="px-4 py-4 border-t border-white/5">
        <p className="text-[10px] text-txt-muted text-center">
          Made with <span className="text-accent">♥</span> for Senjuti
        </p>
      </div>
    </aside>
  );
}
