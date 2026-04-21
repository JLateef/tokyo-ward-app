import { useMemo, useState } from 'react';
import { tokyoWardsMuseumData } from './data/museumsData';
import MuseumWardDetail from './MuseumWardDetail';

const PRIMARY  = '#9C27B0';
const LIGHT    = '#F3E8FF';
const DARK     = '#4A148C';
const RANK_BG  = [DARK, PRIMARY, PRIMARY, PRIMARY, PRIMARY];

const MUSEUM_SVG = (
  <svg viewBox="0 0 32 32" fill="none" width="22" height="22">
    <polygon points="16,4 28,11 4,11" fill="white" opacity="0.9" />
    <rect x="6" y="11" width="4" height="13" fill="white" opacity="0.9" />
    <rect x="14" y="11" width="4" height="13" fill="white" opacity="0.9" />
    <rect x="22" y="11" width="4" height="13" fill="white" opacity="0.9" />
    <rect x="4" y="24" width="24" height="3" rx="1" fill="white" opacity="0.9" />
  </svg>
);

function MuseumCard({ ward, rank, onClick }) {
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
        {ward.totalMuseums} museums total · {ward.prominentMuseums} nationally recognized
      </div>

      <div className="mt-2 ml-11 flex flex-wrap gap-1.5">
        {ward.featuredMuseums.map(museum => (
          <span
            key={museum}
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: LIGHT, color: DARK }}
          >
            {museum}
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

export default function MuseumsResults({ onBack }) {
  const [selectedWard, setSelectedWard] = useState(null);

  const rankedWards = useMemo(() => {
    const maxTotal     = Math.max(...tokyoWardsMuseumData.map(w => w.totalMuseums));
    const maxProminent = Math.max(...tokyoWardsMuseumData.map(w => w.prominentMuseums));
    const maxPerCapita = Math.max(...tokyoWardsMuseumData.map(w => w.perCapita));

    const withBase = tokyoWardsMuseumData.map(ward => ({
      ...ward,
      baseScore: (
        (ward.totalMuseums     / maxTotal)     * 0.55 +
        (ward.prominentMuseums / maxProminent) * 0.30 +
        (ward.perCapita        / maxPerCapita) * 0.15
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
      <MuseumWardDetail
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
            {MUSEUM_SVG}
          </div>
          <h1 className="text-xl font-bold" style={{ color: DARK }}>Top wards for museums</h1>
        </div>
        <p className="text-sm font-semibold mb-3" style={{ color: PRIMARY }}>
          Ranked by total museums including small collections
        </p>
        <p className="text-sm text-gray-500 leading-relaxed mb-3">
          We scored wards on the breadth and caliber of their museums. We counted every institution,
          from major national collections to small specialty galleries and historical neighborhood
          museums.
        </p>
        <p className="text-xs text-gray-400">
          Source: Japan Museum Association + Tokyo Metropolitan Government + curated verification
        </p>
      </div>

      <div className="h-px bg-gray-200 mb-5" />

      <div className="flex flex-col gap-3">
        {rankedWards.map((ward, i) => (
          <MuseumCard
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
