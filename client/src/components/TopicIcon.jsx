import React from 'react';

export default function TopicIcon({ topic, className = "w-5 h-5" }) {
  switch (topic) {
    case 'Linked List':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="10" width="4" height="4" rx="1" />
          <rect x="17" y="10" width="4" height="4" rx="1" />
          <path d="M7 12h10" />
          <polygon points="14 9 17 12 14 15" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'Stack':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 17l8 3 8-3" />
          <path d="M4 12l8 3 8-3" />
          <path d="M4 7l8 3 8-3" />
        </svg>
      );
    case 'Queue':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 13a9 9 0 0 1 15.65-6.17L21 9" />
          <path d="M21 9V3M21 9h-6" />
          <path d="M21 11a9 9 0 0 1-15.65 6.17L3 15" />
          <path d="M3 15v6M3 15h6" />
        </svg>
      );
    case 'Tree':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="3" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="18" r="3" />
          <path d="M12 8l-4 7M12 8l4 7" />
        </svg>
      );
    case 'Priority Queue':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
          <path d="M12 2v10" strokeDasharray="3 3" />
        </svg>
      );
    case 'Disjoint Set ADT':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="5" cy="12" r="3" />
          <circle cx="19" cy="8" r="3" />
          <circle cx="19" cy="16" r="3" />
          <path d="M8 12h8M19 11v2" />
        </svg>
      );
    case 'Graph':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="18" r="3" />
          <circle cx="6" cy="6" r="3" />
          <path d="M8 8l8 8M8 6h7M6 8v7M18 9v6" />
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 17V7M15 17V7" />
        </svg>
      );
  }
}
