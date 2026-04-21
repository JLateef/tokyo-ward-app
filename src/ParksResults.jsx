import { useMemo, useState } from 'react';
import { tokyoWardsParksData } from './data/parksData';
import WardDetail from './WardDetail';
import { distanceToCenter } from './utils/distance';

const RANK_BG = ['#085041', '#1D9E75', '#1D9E75', '#1D9E75', '#1D9E75'];

function WardCard({ ward, rank, onClick }) {
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
            <span className="text-2xl font-black leading-none" style={{ color: '#085041' }}>
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
        {ward.majorParks} major parks · {ward.perCapita} m² green space per resident
      </div>
      <div className="mt-1 ml-11 text-xs text-gray-400">
        {distanceToCenter(ward.lat, ward.lng)}
      </div>

      <div className="mt-2 ml-11 flex flex-wrap gap-1.5">
        {ward.featuredParks.map(park => (
          <span
            key={park}
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: '#E1F5EE', color: '#085041' }}
          >
            {park}
          </span>
        ))}
      </div>

      <div className="mt-3 h-1 rounded-full" style={{ backgroundColor: '#E1F5EE' }}>
        <div
          className="h-1 rounded-full"
          style={{ width: `${ward.displayScore}%`, backgroundColor: '#1D9E75' }}
        />
      </div>
    </button>
  );
}

export default function ParksResults({ onBack }) {
  const [selectedWard, setSelectedWard] = useState(null);

  const rankedWards = useMemo(() => {
    const maxParks     = Math.max(...tokyoWardsParksData.map(w => w.majorParks));
    const maxPerCapita = Math.max(...tokyoWardsParksData.map(w => w.perCapita));

    const withBase = tokyoWardsParksData.map(ward => ({
      ...ward,
      baseScore:
        ((ward.majorParks / maxParks) * 0.6 +
          (ward.perCapita / maxPerCapita) * 0.4) * 100,
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
      <WardDetail
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
            style={{ backgroundColor: '#1D9E75' }}
          >
            <svg viewBox="0 0 32 32" fill="none" width="22" height="22">
              <ellipse cx="16" cy="12" rx="9" ry="8" fill="white" opacity="0.9" />
              <ellipse cx="10" cy="15" rx="6" ry="5.5" fill="white" opacity="0.9" />
              <ellipse cx="22" cy="15" rx="6" ry="5.5" fill="white" opacity="0.9" />
              <rect x="14.5" y="19" width="3" height="7" rx="1.5" fill="white" opacity="0.9" />
            </svg>
          </div>
          <h1 className="text-xl font-bold" style={{ color: '#085041' }}>
            Top wards for parks
          </h1>
        </div>
        <p className="text-sm font-semibold mb-3" style={{ color: '#1D9E75' }}>
          Ranked by major parks with open green space
        </p>
        <p className="text-sm text-gray-500 leading-relaxed mb-3">
          We ranked wards by access to parks with open green spaces. This includes places with lawns
          where you can have a picnic, walk around, or just relax in nature.
        </p>
        <p className="text-xs text-gray-400">
          Source: Tokyo Metropolitan Government + curated verification
        </p>
      </div>

      <div className="h-px bg-gray-200 mb-5" />

      <div className="flex flex-col gap-3">
        {rankedWards.map((ward, i) => (
          <WardCard
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
