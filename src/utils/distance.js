// Imperial Palace as city center reference
const CENTER = { lat: 35.6852, lng: 139.7528 };

export function distanceToCenter(lat, lng) {
  const R = 6371;
  const dLat = (lat - CENTER.lat) * Math.PI / 180;
  const dLng = (lng - CENTER.lng) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(CENTER.lat * Math.PI / 180) *
    Math.cos(lat * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  const km = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const miles = km * 0.621371;
  return `${km.toFixed(1)}km (${miles.toFixed(1)} miles) to city center`;
}
