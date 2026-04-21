import { useState, useEffect } from 'react';

const TEMPLE_ICON = (
  <svg viewBox="0 0 32 32" fill="none" width="26" height="26">
    <line x1="16" y1="1" x2="16" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    <path d="M10 8 Q16 5 22 8 L21 10 Q16 7.5 11 10 Z" fill="white" opacity="0.5" />
    <rect x="12" y="10" width="8" height="4" rx="0.5" fill="white" opacity="0.5" />
    <path d="M7 15 Q16 11.5 25 15 L24 17 Q16 14 8 17 Z" fill="white" opacity="0.5" />
    <rect x="10" y="17" width="12" height="4" rx="0.5" fill="white" opacity="0.5" />
    <path d="M4 22 Q16 18 28 22 L27 24 Q16 20.5 5 24 Z" fill="white" opacity="0.5" />
    <rect x="11" y="24" width="10" height="4" rx="0.5" fill="white" opacity="0.5" />
  </svg>
);

const PRIMARY = '#E53935';
const LIGHT   = '#FDE8E8';
const DARK    = '#B71C1C';

export default function TempleWardDetail({ ward, rank, onBack }) {
  const [imageUrl, setImageUrl] = useState(ward.imageUrl ?? null);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    if (ward.imageUrl) return;

    const scale = url => url.replace(/\/\d+px-/, '/400px-');

    fetch(`https://ja.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(ward.wikiTitle)}`)
      .then(r => r.json())
      .then(data => {
        const raw = data.thumbnail?.source ?? null;
        if (raw) {
          setImageUrl(scale(raw));
        } else {
          return fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(`${ward.name}, Tokyo`)}`)
            .then(r => r.json())
            .then(d => { if (d.thumbnail?.source) setImageUrl(scale(d.thumbnail.source)); });
        }
      })
      .catch(() => {});
  }, [ward.wikiTitle, ward.name]);

  const showImage = imageUrl && !imgFailed;

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-10 pb-10 max-w-md mx-auto">

      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm font-semibold text-gray-400 mb-6 active:opacity-60 transition-opacity"
      >
        ← Back
      </button>

      {/* Hero row */}
      <div className="flex gap-4 mb-5">
        <div
          className="w-32 h-32 rounded-2xl flex-shrink-0 overflow-hidden"
          style={{ backgroundColor: LIGHT }}
        >
          {showImage ? (
            <img
              src={imageUrl}
              alt={ward.featuredSites[0]}
              className="w-full h-full object-cover"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${DARK} 100%)` }}
            >
              {TEMPLE_ICON}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: rank === 1 ? DARK : PRIMARY }}
            >
              <span className="text-white text-xs font-bold leading-none">{rank}</span>
            </div>
            <span className="text-xs font-semibold" style={{ color: PRIMARY }}>
              Rank #{rank}
            </span>
          </div>
          <h1 className="text-xl font-black text-gray-800 leading-tight truncate">
            {ward.name}
          </h1>
          <p className="text-sm text-gray-400 mb-2">{ward.nameJa}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black leading-none" style={{ color: DARK }}>
              {ward.displayScore}
            </span>
            <span className="text-xs text-gray-400">/ 100</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-200 mb-5" />

      <p className="text-sm text-gray-600 leading-relaxed mb-6">
        {ward.description}
      </p>

      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
        Notable Sites
      </p>
      <div className="flex flex-wrap gap-1.5 mb-6">
        {ward.featuredSites.map(site => {
          const q = encodeURIComponent(site + ' Tokyo');
          return (
            <div key={site} className="flex items-center rounded-full text-xs font-medium overflow-hidden" style={{ backgroundColor: LIGHT }}>
              <span className="pl-2.5 pr-2 py-1" style={{ color: DARK }}>{site}</span>
              <div className="w-px self-stretch" style={{ backgroundColor: DARK + '30' }} />
              <a href={`https://maps.google.com/?q=${q}`} target="_blank" rel="noopener noreferrer" className="px-1.5 py-1 flex items-center active:opacity-60" title="Google Maps">
                <svg width="11" height="14" viewBox="0 0 11 14" fill="none"><path d="M5.5 0C2.46 0 0 2.46 0 5.5c0 4.13 5.5 8.5 5.5 8.5S11 9.63 11 5.5C11 2.46 8.54 0 5.5 0z" fill="#EA4335"/><text x="5.5" y="7.8" textAnchor="middle" fill="white" fontSize="5.5" fontWeight="800" fontFamily="Arial,sans-serif">G</text></svg>
              </a>
              <a href={`https://maps.apple.com/?q=${q}`} target="_blank" rel="noopener noreferrer" className="pr-1.5 py-1 flex items-center active:opacity-60" title="Apple Maps">
                <svg width="11" height="14" viewBox="0 0 11 14" fill="none"><path d="M5.5 0C2.46 0 0 2.46 0 5.5c0 4.13 5.5 8.5 5.5 8.5S11 9.63 11 5.5C11 2.46 8.54 0 5.5 0z" fill="#007AFF"/><path d="M3.8 6.1C3.8 4.3 4.5 3.6 5.5 3.7C6.5 3.6 7.2 4.3 7.2 6.1C7.2 7.8 6.6 8.2 5.5 8.2C4.4 8.2 3.8 7.8 3.8 6.1Z" fill="white"/><path d="M5.5 3.7C5.6 3 6.5 2.4 6.9 2.9" stroke="white" strokeWidth="0.75" strokeLinecap="round" fill="none"/><path d="M5.6 3C5.1 2.3 4.2 2.7 4.6 3.4" stroke="white" strokeWidth="0.7" strokeLinecap="round" fill="none"/></svg>
              </a>
            </div>
          );
        })}
      </div>

      <div
        className="rounded-2xl px-4 py-4 flex justify-around text-center"
        style={{ backgroundColor: LIGHT }}
      >
        <div>
          <div className="text-2xl font-black leading-none" style={{ color: DARK }}>
            {ward.totalSites}
          </div>
          <div className="text-xs text-gray-500 mt-1">temples & shrines</div>
        </div>
        <div className="w-px" style={{ backgroundColor: '#FFCDD2' }} />
        <div>
          <div className="text-2xl font-black leading-none" style={{ color: DARK }}>
            {ward.majorSites}
          </div>
          <div className="text-xs text-gray-500 mt-1">major sites</div>
        </div>
      </div>

    </div>
  );
}
