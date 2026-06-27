import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import { API_BASE } from '../lib/api';

function MapPage() {
  const [mapReports, setMapReports] = useState([]);
  const [mapError, setMapError] = useState('');
  const [mapStatusFilter, setMapStatusFilter] = useState('');
  const [mapCategoryFilter, setMapCategoryFilter] = useState('');

  useEffect(() => {
    const loadReports = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/reports?limit=200&offset=0`);
        if (!response.ok) {
          throw new Error('Impossible de charger la carte');
        }
        const payload = await response.json();
        setMapReports(payload.items || []);
      } catch (error) {
        setMapError(error.message || 'Erreur carte');
      }
    };
    loadReports();
  }, []);

  const mapCategories = Array.from(
    new Set(mapReports.map((report) => report.category).filter(Boolean))
  );
  const mapPoints = mapReports
    .filter((report) =>
      mapStatusFilter ? report.status === mapStatusFilter : true
    )
    .filter((report) =>
      mapCategoryFilter ? report.category === mapCategoryFilter : true
    )
    .map((report) => ({
      ...report,
      lat: Number(report.latitude),
      lng: Number(report.longitude),
    }))
    .filter((report) => !Number.isNaN(report.lat) && !Number.isNaN(report.lng));
  const mapCenter = mapPoints.length
    ? [mapPoints[0].lat, mapPoints[0].lng]
    : [48.8566, 2.3522];

  return (
    <section className="report-section">
      <div className="report-panel">
        <h2>Carte des signalements</h2>
        <p>Filtrez les signalements par statut ou categorie.</p>
        <div className="map-filters">
          <select
            value={mapStatusFilter}
            onChange={(event) => setMapStatusFilter(event.target.value)}
          >
            <option value="">Tous statuts</option>
            <option value="PENDING">En attente</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="RESOLVED">Resolus</option>
          </select>
          <select
            value={mapCategoryFilter}
            onChange={(event) => setMapCategoryFilter(event.target.value)}
          >
            <option value="">Toutes categories</option>
            {mapCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="ghost"
            onClick={() => {
              setMapStatusFilter('');
              setMapCategoryFilter('');
            }}
          >
            Effacer
          </button>
        </div>
      </div>
      <div className="map-panel">
        <div className="map-shell">
          <div className="map-container">
            <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={false}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {mapPoints.map((report) => (
                <Marker key={report.id} position={[report.lat, report.lng]}>
                  <Popup>
                    <strong>{report.category}</strong>
                    <br />
                    {report.description}
                    <br />
                    Statut: {report.status}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            {mapPoints.length === 0 && (
              <div className="map-empty">
                {mapError || 'Ajoutez des signalements geolocalises.'}
              </div>
            )}
          </div>
          <div className="map-footer">
            <span className="pill pending">En attente</span>
            <span className="pill progress">En cours</span>
            <span className="pill done">Resolus</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MapPage;
