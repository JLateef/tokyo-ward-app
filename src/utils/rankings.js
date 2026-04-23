import { tokyoWardsParksData }     from '../data/parksData';
import { tokyoWardsMuseumData }    from '../data/museumsData';
import { tokyoWardsTempleData }    from '../data/templesData';
import { tokyoWardsNightlifeData } from '../data/nightlifeData';

function rankParks() {
  const maxParks     = Math.max(...tokyoWardsParksData.map(w => w.majorParks));
  const maxPerCapita = Math.max(...tokyoWardsParksData.map(w => w.perCapita));
  return tokyoWardsParksData
    .map(w => ({ id: w.id, score: (w.majorParks / maxParks) * 0.6 + (w.perCapita / maxPerCapita) * 0.4 }))
    .sort((a, b) => b.score - a.score);
}

function rankMuseums() {
  const maxTotal     = Math.max(...tokyoWardsMuseumData.map(w => w.totalMuseums));
  const maxProminent = Math.max(...tokyoWardsMuseumData.map(w => w.prominentMuseums));
  const maxPerCapita = Math.max(...tokyoWardsMuseumData.map(w => w.perCapita));
  return tokyoWardsMuseumData
    .map(w => ({ id: w.id, score: (w.totalMuseums / maxTotal) * 0.55 + (w.prominentMuseums / maxProminent) * 0.30 + (w.perCapita / maxPerCapita) * 0.15 }))
    .sort((a, b) => b.score - a.score);
}

function rankTemples() {
  const maxTotal = Math.max(...tokyoWardsTempleData.map(w => w.totalSites));
  const maxMajor = Math.max(...tokyoWardsTempleData.map(w => w.majorSites));
  return tokyoWardsTempleData
    .map(w => ({ id: w.id, score: (w.totalSites / maxTotal) * 0.50 + (w.majorSites / maxMajor) * 0.35 + (w.heritageScore / 10) * 0.15 }))
    .sort((a, b) => b.score - a.score);
}

function rankNightlife() {
  const maxBars   = Math.max(...tokyoWardsNightlifeData.map(w => w.barsIzakayas));
  const maxClubs  = Math.max(...tokyoWardsNightlifeData.map(w => w.nightclubs));
  const maxDining = Math.max(...tokyoWardsNightlifeData.map(w => w.lateNightDining));
  return tokyoWardsNightlifeData
    .map(w => ({ id: w.id, score: (w.barsIzakayas / maxBars) * 0.35 + (w.nightclubs / maxClubs) * 0.25 + (w.lateNightDining / maxDining) * 0.20 + (w.footTrafficScore / 10) * 0.20 }))
    .sort((a, b) => b.score - a.score);
}

const find = (ranked, id) => {
  const idx = ranked.findIndex(w => w.id === id);
  return idx === -1 ? null : idx + 1;
};

export function getCrossRankings(wardId) {
  return {
    parks:     find(rankParks(),     wardId),
    museums:   find(rankMuseums(),   wardId),
    temples:   find(rankTemples(),   wardId),
    nightlife: find(rankNightlife(), wardId),
  };
}
