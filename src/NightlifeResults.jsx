import { useMemo, useState } from 'react';
import { tokyoWardsNightlifeData } from './data/nightlifeData';
import NightlifeWardDetail from './NightlifeWardDetail';

const PRIMARY = '#F57C00';
const LIGHT   = '#FFF3E0';
const DARK    = '#E65100';
const RANK_BG = [DARK, PRIMARY, PRIMARY, PRIMARY, PRIMARY];

const NIGHTLIFE_SVG = (
  <svg viewBox="0 0 32 32" fill="none" width="22" height="22">
    <rect x="5" y="10" width="16" height="16" rx="2" fill="white" opacity="0.9" />
    <path d="M21 13 Q28 13 28 18 Q28 23 21 23" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />
    <ellipse cx="9" cy="10" rx="2" ry="2.5" fill="white" opacity="0.75" />
    <ellipse cx="13" cy="9" rx="2.5" ry="3" fill="white" opacity="0.85" />
    <ellipse cx="17" cy="10" rx="2" ry="2.5" fill="white" opacity="0.75" />
  </svg>
);

function NightlifeCard({ ward, rank, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl p-4 border border-gray-100 text-left w-full active:scale-98 transition-transform duration-100 hover:border-gray-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ backgroundColor: RANK_BG[rank - 1] }}
          >
            <span className="text-white text-sm font-bold">{rank}</span>
          </div>
          <div>
            <div className="font-bold text-gray-800 text-base leading-tight">{ward.name}</div>
            <div className="text-xs text-gray-400 mt-0.5">{ward.nameJa}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex flex-col items-end">
            <span className="text-2xl font-black leading-none" style={{ color: DARK }}>
              {ward.displayScore}
            </span>
            <span className="text-xs text-gray-400 mt-0.5">/ 100</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-300 mt-1">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="mt-3 ml-11 text-xs text-gray-500">
        {ward.barsIzakayas.toLocaleString()} bars & izakayas · {ward.nightclubs} clubs
      </div>

      <div className="mt-2 ml-11 flex flex-wrap gap-1.5">
        {ward.featuredVenues.map(venue => (
          <span
            key={venue}
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: LIGHT, color: DARK }}
          >
            {venue}
          </span>
        ))}
      </div>

      <div className="mt-3 h-1 rounded-full" style={{ backgroundColor: LIGHT }}>
        <div
          className="h-1 rounded-full"
          style={{ width: `${ward.displayScore}%`, backgroundColor: PRIMARY }}
        />
      </div>
    </button>
  );
}

export default function NightlifeResults({ onBack }) {
  const [selectedWard, setSelectedWard] = useState(null);

  const rankedWards = useMemo(() => {
    const maxBars   = Math.max(...tokyoWardsNightlifeData.map(w => w.barsIzakayas));
    const maxClubs  = Math.max(...tokyoWardsNightlifeData.map(w => w.nightclubs));
    const maxDining = Math.max(...tokyoWardsNightlifeData.map(w => w.lateNightDining));

    const withBase = tokyoWardsNightlifeData.map(ward => ({
      ...ward,
      baseScore: (
        (ward.barsIzakayas    / maxBars)   * 0.35 +
        (ward.nightclubs      / maxClubs)  * 0.25 +
        (ward.lateNightDining / maxDining) * 0.20 +
        (ward.footTrafficScore / 10)       * 0.20
      ) * 100,
    }));

    const maxBase = Math.max(...withBase.map(w => w.baseScore));
    const minBase = Math.min(...withBase.map(w => w.baseScore));

    return withBase
      .map(ward => {
        const normalized = maxBase === minBase ? 1 : (ward.baseScore - minBase) / (maxBase - minBase);
        return { ...ward, displayScore: Math.round(70 + normalized * 29) };
      })
      .sort((a, b) => b.baseScore - a.baseScore)
      .slice(0, 5);
  }, []);

  if (selectedWard) {
    const rank = rankedWards.findIndex(w => w.id === selectedWard.id) + 1;
    return (
      <NightlifeWardDetail
        ward={selectedWard}
        rank={rank}
        onBack={() => setSelectedWard(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-10 pb-10 max-w-md mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm font-semibold text-gray-400 mb-6 active:opacity-60 transition-opacity"
      >
        ← Back
      </button>
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-2">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: PRIMARY }}
          >
            {NIGHTLIFE_SVG}
          </div>
          <h1 className="text-xl font-bold" style={{ color: DARK }}>Top wards for nightlife</h1>
        </div>
        <p className="text-sm font-semibold mb-3" style={{ color: PRIMARY }}>
          Ranked by bars, clubs, late-night dining & foot traffic after 9pm
        </p>
        <p className="text-sm text-gray-500 leading-relaxed mb-3">
          We scored wards on the density of izakayas and bars, the number of nightclubs,
          late-night dining options open past midnight, and relative foot traffic after 9pm.
        </p>
        <p className="text-xs text-gray-400">
          Source: Tokyo Metropolitan Government + curated venue data + foot traffic estimates
        </p>
      </div>

      <div className="h-px bg-gray-200 mb-5" />

      <div className="flex flex-col gap-3">
        {rankedWards.map((ward, i) => (
          <NightlifeCard
            key={ward.id}
            ward={ward}
            rank={i + 1}
            onClick={() => setSelectedWard(ward)}
          />
        ))}
      </div>

    </div>
  );
}
