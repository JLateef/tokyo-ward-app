import { useMemo, useState } from 'react';
import { tokyoWardsTempleData } from './data/templesData';
import TempleWardDetail from './TempleWardDetail';

const PRIMARY = '#E53935';
const LIGHT   = '#FDE8E8';
const DARK    = '#B71C1C';
const RANK_BG = [DARK, PRIMARY, PRIMARY, PRIMARY, PRIMARY];

const TEMPLE_SVG = (
  <svg viewBox="0 0 32 32" fill="none" width="22" height="22">
    <line x1="16" y1="1" x2="16" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
    <path d="M10 8 Q16 5 22 8 L21 10 Q16 7.5 11 10 Z" fill="white" opacity="0.95" />
    <rect x="12" y="10" width="8" height="4" rx="0.5" fill="white" opacity="0.85" />
    <path d="M7 15 Q16 11.5 25 15 L24 17 Q16 14 8 17 Z" fill="white" opacity="0.9" />
    <rect x="10" y="17" width="12" height="4" rx="0.5" fill="white" opacity="0.85" />
    <path d="M4 22 Q16 18 28 22 L27 24 Q16 20.5 5 24 Z" fill="white" opacity="0.9" />
    <rect x="11" y="24" width="10" height="4" rx="0.5" fill="white" opacity="0.85" />
  </svg>
);

function TempleCard({ ward, rank, onClick }) {
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
        {ward.totalSites} temples & shrines · {ward.majorSites} major sites
      </div>

      <div className="mt-2 ml-11 flex flex-wrap gap-1.5">
        {ward.featuredSites.map(site => (
          <span
            key={site}
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: LIGHT, color: DARK }}
          >
            {site}
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

export default function TemplesResults({ onBack }) {
  const [selectedWard, setSelectedWard] = useState(null);

  const rankedWards = useMemo(() => {
    const maxTotal = Math.max(...tokyoWardsTempleData.map(w => w.totalSites));
    const maxMajor = Math.max(...tokyoWardsTempleData.map(w => w.majorSites));

    const withBase = tokyoWardsTempleData.map(ward => ({
      ...ward,
      baseScore: (
        (ward.totalSites    / maxTotal) * 0.50 +
        (ward.majorSites    / maxMajor) * 0.35 +
        (ward.heritageScore / 10)       * 0.15
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
      <TempleWardDetail
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
            {TEMPLE_SVG}
          </div>
          <h1 className="text-xl font-bold" style={{ color: DARK }}>
            Top wards for temples & shrines
          </h1>
        </div>
        <p className="text-sm font-semibold mb-3" style={{ color: PRIMARY }}>
          Ranked by sacred site density and heritage significance
        </p>
        <p className="text-sm text-gray-500 leading-relaxed mb-3">
          We scored wards on the total number of temples and shrines, including small
          neighborhood sites, weighted by major landmark status and national heritage
          designations.
        </p>
        <p className="text-xs text-gray-400">
          Source: Agency for Cultural Affairs + Tokyo Metropolitan Government + curated verification
        </p>
      </div>

      <div className="h-px bg-gray-200 mb-5" />

      <div className="flex flex-col gap-3">
        {rankedWards.map((ward, i) => (
          <TempleCard
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
