import { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext(null);

const initialState = {
  user:     null,
  progress: {},
  loading:  true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.user, progress: action.progress, loading: false };
    case 'SET_PROGRESS':
      return { ...state, progress: action.progress };
    case 'TOGGLE_PROBLEM': {
      const p = { ...state.progress };
      if (action.done) p[action.key] = true;
      else             delete p[action.key];
      return { ...state, progress: p };
    }
    case 'SET_LOADING':
      return { ...state, loading: action.loading };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch('/api/me')
      .then(r => r.json())
      .then(data => {
        dispatch({ type: 'SET_USER', user: data.user, progress: data.progress || {} });
      })
      .catch(() => dispatch({ type: 'SET_LOADING', loading: false }));
  }, []);

  async function toggleProblem(key, done) {
    // Optimistic update
    dispatch({ type: 'TOGGLE_PROBLEM', key, done });

    if (!state.user) return; // guest — just local

    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, done }),
      });
      const data = await res.json();
      if (data.progress) dispatch({ type: 'SET_PROGRESS', progress: data.progress });
    } catch (err) {
      console.error('Failed to save progress', err);
    }
  }

  return (
    <AppContext.Provider value={{ ...state, dispatch, toggleProblem }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
