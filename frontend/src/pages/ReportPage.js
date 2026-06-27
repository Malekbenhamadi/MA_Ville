import { useEffect, useState } from 'react';

import { API_BASE } from '../lib/api';

function ReportPage() {
  const [reportForm, setReportForm] = useState({
    category: 'Nid-de-poule',
    description: '',
    latitude: '',
    longitude: '',
  });
  const [reportFile, setReportFile] = useState(null);
  const [reportPreview, setReportPreview] = useState('');
  const [reportStatus, setReportStatus] = useState('');
  const [reportError, setReportError] = useState('');

  useEffect(() => {
    if (!reportFile) {
      setReportPreview('');
      return;
    }
    const previewUrl = URL.createObjectURL(reportFile);
    setReportPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [reportFile]);

  const handleReportChange = (event) => {
    const { name, value } = event.target;
    setReportForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitReport = async (event) => {
    event.preventDefault();
    setReportStatus('');
    setReportError('');
    if (!reportForm.category.trim()) {
      setReportError('La categorie est requise');
      return;
    }
    if (reportForm.description.trim().length < 10) {
      setReportError('La description doit contenir 10 caracteres minimum');
      return;
    }
    if (reportForm.latitude && Number.isNaN(Number(reportForm.latitude))) {
      setReportError('Latitude invalide');
      return;
    }
    if (reportForm.longitude && Number.isNaN(Number(reportForm.longitude))) {
      setReportError('Longitude invalide');
      return;
    }
    if (reportFile) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024;
      if (!allowedTypes.includes(reportFile.type)) {
        setReportError('Format image non supporte (jpg, png, webp)');
        return;
      }
      if (reportFile.size > maxSize) {
        setReportError('Image trop volumineuse (max 5 Mo)');
        return;
      }
    }
    try {
      const formData = new FormData();
      formData.append('category', reportForm.category);
      formData.append('description', reportForm.description);
      if (reportForm.latitude) {
        formData.append('latitude', reportForm.latitude);
      }
      if (reportForm.longitude) {
        formData.append('longitude', reportForm.longitude);
      }
      if (reportFile) {
        formData.append('photo', reportFile);
      }
      const response = await fetch(`${API_BASE}/api/reports`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Signalement non enregistre');
      }
      setReportStatus('Signalement envoye');
      setReportForm({
        category: 'Nid-de-poule',
        description: '',
        latitude: '',
        longitude: '',
      });
      setReportFile(null);
      setReportPreview('');
    } catch (error) {
      setReportError(error.message || 'Erreur lors de lenvoi');
    }
  };

  return (
    <section className="report-section">
      <div className="report-panel">
        <h2>Creer un signalement</h2>
        <p>Decrivez le probleme et indiquez son emplacement.</p>
        <form className="report-form" onSubmit={submitReport}>
          <label>
            Categorie
            <select
              name="category"
              value={reportForm.category}
              onChange={handleReportChange}
            >
              <option value="Nid-de-poule">Nid-de-poule</option>
              <option value="Eclairage defaillant">Eclairage defaillant</option>
              <option value="Depots sauvages">Depots sauvages</option>
              <option value="Voirie endommagee">Voirie endommagee</option>
            </select>
          </label>
          <label>
            Description
            <textarea
              name="description"
              rows="4"
              placeholder="Ajoutez des details utiles"
              value={reportForm.description}
              onChange={handleReportChange}
            />
          </label>
          <div className="form-row">
            <label>
              Latitude
              <input
                name="latitude"
                type="text"
                placeholder="48.8566"
                value={reportForm.latitude}
                onChange={handleReportChange}
              />
            </label>
            <label>
              Longitude
              <input
                name="longitude"
                type="text"
                placeholder="2.3522"
                value={reportForm.longitude}
                onChange={handleReportChange}
              />
            </label>
          </div>
          <label className="upload">
            Photo
            <div className="upload-box">
              <span>Glissez ou cliquez pour ajouter</span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  setReportError('');
                  setReportFile(event.target.files?.[0] || null);
                }}
              />
              {reportFile && <span className="upload-name">{reportFile.name}</span>}
            </div>
            {reportPreview && (
              <div className="upload-preview">
                <img src={reportPreview} alt="Apercu du signalement" />
              </div>
            )}
          </label>
          <button className="primary">Soumettre</button>
          <div className="form-status">
            {reportStatus && <span className="success-text">{reportStatus}</span>}
            {reportError && <span className="error-text">{reportError}</span>}
          </div>
        </form>
      </div>
      <div className="map-panel">
        <div className="map-shell">
          <div className="map-header">
            <h3>Conseils rapides</h3>
          </div>
          <div className="map-empty">
            Ajoutez une photo claire et une localisation precise.
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

export default ReportPage;
