/**
 * Decode an encoded polyline string (Google Encoded Polyline Algorithm Format)
 * into an array of {lat, lng} objects.
 *
 * Reference: https://developers.google.com/maps/documentation/utilities/polylinealgorithm
 * Complexity: O(n) where n = encoded string length.
 *
 * @param {string} encoded
 * @returns {{lat:number,lng:number}[]} path
 */
export function decodePolyline(encoded) {
  if (!encoded || typeof encoded !== 'string') return [];
  let index = 0;
  let lat = 0;
  let lng = 0;
  const path = [];

  while (index < encoded.length) {
    let result = 0;
    let shift = 0;
    let b;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    result = 0;
    shift = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    path.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return path;
}

export default decodePolyline;
