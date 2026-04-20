import { useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import ParksResults from './ParksResults';
import MuseumsResults from './MuseumsResults';
import TemplesResults from './TemplesResults';
import NightlifeResults from './NightlifeResults';

const categories = [
  {
    id: 'parks',
    label: 'Parks',
    bg: '#e8f5e9',
    iconBg: '#4caf50',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
        <ellipse cx="16" cy="12" rx="9" ry="8" fill="white" opacity="0.9" />
        <ellipse cx="10" cy="15" rx="6" ry="5.5" fill="white" opacity="0.9" />
        <ellipse cx="22" cy="15" rx="6" ry="5.5" fill="white" opacity="0.9" />
        <rect x="14.5" y="19" width="3" height="7" rx="1.5" fill="white" opacity="0.9" />
      </svg>
    ),
  },
  {
    id: 'museums',
    label: 'Museums',
    bg: '#f3e8ff',
    iconBg: '#9c27b0',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
        <polygon points="16,4 28,11 4,11" fill="white" opacity="0.9" />
        <rect x="6" y="11" width="4" height="13" fill="white" opacity="0.9" />
        <rect x="14" y="11" width="4" height="13" fill="white" opacity="0.9" />
        <rect x="22" y="11" width="4" height="13" fill="white" opacity="0.9" />
        <rect x="4" y="24" width="24" height="3" rx="1" fill="white" opacity="0.9" />
      </svg>
    ),
  },
  {
    id: 'nightlife',
    label: 'Nightlife',
    bg: '#fff3e0',
    iconBg: '#ff9800',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
        {/* mug body */}
        <rect x="5" y="10" width="16" height="16" rx="2" fill="white" opacity="0.9" />
        {/* handle */}
        <path d="M21 13 Q28 13 28 18 Q28 23 21 23" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />
        {/* foam */}
        <ellipse cx="9" cy="10" rx="2" ry="2.5" fill="white" opacity="0.75" />
        <ellipse cx="13" cy="9" rx="2.5" ry="3" fill="white" opacity="0.85" />
        <ellipse cx="17" cy="10" rx="2" ry="2.5" fill="white" opacity="0.75" />
      </svg>
    ),
  },
  {
    id: 'temples',
    label: 'Temples & Shrines',
    bg: '#fde8e8',
    iconBg: '#e53935',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
        {/* spire */}
        <line x1="16" y1="1" x2="16" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
        {/* top roof */}
        <path d="M10 8 Q16 5 22 8 L21 10 Q16 7.5 11 10 Z" fill="white" opacity="0.95" />
        <rect x="12" y="10" width="8" height="4" rx="0.5" fill="white" opacity="0.85" />
        {/* middle roof */}
        <path d="M7 15 Q16 11.5 25 15 L24 17 Q16 14 8 17 Z" fill="white" opacity="0.9" />
        <rect x="10" y="17" width="12" height="4" rx="0.5" fill="white" opacity="0.85" />
        {/* bottom roof */}
        <path d="M4 22 Q16 18 28 22 L27 24 Q16 20.5 5 24 Z" fill="white" opacity="0.9" />
        {/* base/foundation */}
        <rect x="11" y="24" width="10" height="4" rx="0.5" fill="white" opacity="0.85" />
        <rect x="9" y="28" width="14" height="2" rx="0.5" fill="white" opacity="0.75" />
      </svg>
    ),
  },
];

export default function App() {
  const [welcomed, setWelcomed] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  if (!welcomed) {
    return <WelcomeScreen onEnter={() => setWelcomed(true)} />;
  }

  if (activeCategory === 'parks') {
    return <ParksResults onBack={() => setActiveCategory(null)} />;
  }
  if (activeCategory === 'museums') {
    return <MuseumsResults onBack={() => setActiveCategory(null)} />;
  }
  if (activeCategory === 'temples') {
    return <TemplesResults onBack={() => setActiveCategory(null)} />;
  }
  if (activeCategory === 'nightlife') {
    return <NightlifeResults onBack={() => setActiveCategory(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          opacity: 0;
          animation: fadeUp 1s ease forwards;
        }
      `}</style>

      <button
        onClick={() => setWelcomed(false)}
        className="fade-up absolute top-10 left-4 flex items-center gap-1 text-sm font-semibold text-gray-400 active:opacity-60 transition-opacity"
        style={{ animationDelay: '0.2s' }}
      >
        ← Back
      </button>

      <h1
        className="fade-up text-2xl font-bold text-gray-800 text-center mb-2 tracking-tight leading-snug max-w-xs"
        style={{ animationDelay: '0.4s' }}
      >
        What would you like to explore in Tokyo?
      </h1>
      <p
        className="fade-up text-gray-400 text-sm mb-10"
        style={{ animationDelay: '0.8s' }}
      >
        Choose a category to see the top 5 wards
      </p>

      <div
        className="fade-up grid grid-cols-2 gap-4 w-full max-w-xs"
        style={{ animationDelay: '1.1s' }}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{ backgroundColor: cat.bg }}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl p-6 cursor-pointer border-2 border-transparent hover:border-gray-200 active:scale-95 transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: cat.iconBg }}
            >
              {cat.icon}
            </div>
            <span className="text-gray-700 font-semibold text-sm text-center leading-tight">
              {cat.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
