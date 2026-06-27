import { useEffect, useMemo, useState } from 'react';

import { API_BASE } from '../lib/api';

function AdminPage() {
  const [adminView, setAdminView] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [adminStatus, setAdminStatus] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);
  const [adminForm, setAdminForm] = useState({
    reportId: '',
    status: 'IN_PROGRESS',
  });
  const [adminReports, setAdminReports] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);
  const [bulkStatus, setBulkStatus] = useState('IN_PROGRESS');
  const [adminSearch, setAdminSearch] = useState('');
  const [adminStatusFilter, setAdminStatusFilter] = useState('');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState('');
  const [adminPage, setAdminPage] = useState(1);
  const [adminTotal, setAdminTotal] = useState(0);
  const [adminLimit] = useState(8);
  const [adminCategories, setAdminCategories] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeReportId, setActiveReportId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [reportComments, setReportComments] = useState([]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(adminTotal / adminLimit)),
    [adminLimit, adminTotal]
  );

  useEffect(() => {
    const stored = localStorage.getItem('maville_token');
    if (stored) {
      setAdminToken(stored);
    }
  }, []);

  useEffect(() => {
    const verifyAdmin = async () => {
      if (!adminToken) {
        setIsAdmin(false);
        setAdminChecked(true);
        return;
      }
      try {
        const response = await fetch(`${API_BASE}/api/auth/admin/me`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        setIsAdmin(response.ok);
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setAdminChecked(true);
      }
    };
    verifyAdmin();
  }, [adminToken]);

  useEffect(() => {
    if (!adminChecked || !isAdmin) {
      return;
    }
    fetchReports();
    fetchNotifications();
  }, [
    adminChecked,
    isAdmin,
    adminPage,
    adminSearch,
    adminStatusFilter,
    adminCategoryFilter,
  ]);

  const handleAdminChange = (event) => {
    const { name, value } = event.target;
    setAdminForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleReportSelection = (reportId) => {
    setSelectedReports((prev) =>
      prev.includes(reportId)
        ? prev.filter((id) => id !== reportId)
        : [...prev, reportId]
    );
  };

  async function fetchReports() {
    setAdminStatus('');
    setAdminError('');
    try {
      const params = new URLSearchParams();
      params.set('limit', String(adminLimit));
      params.set('offset', String((adminPage - 1) * adminLimit));
      if (adminSearch) {
        params.set('q', adminSearch);
      }
      if (adminStatusFilter) {
        params.set('status', adminStatusFilter);
      }
      if (adminCategoryFilter) {
        params.set('category', adminCategoryFilter);
      }
      const response = await fetch(`${API_BASE}/api/reports?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Impossible de charger les signalements');
      }
      const payload = await response.json();
      const items = payload.items || [];
      setAdminReports(items);
      setAdminTotal(payload.total || 0);
      setAdminCategories(
        Array.from(new Set(items.map((report) => report.category).filter(Boolean)))
      );
      setSelectedReports([]);
      setAdminStatus('Liste mise a jour');
    } catch (error) {
      setAdminError(error.message || 'Erreur de chargement');
    }
  }

  async function fetchNotifications() {
    if (!adminToken) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/api/notifications`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (!response.ok) {
        throw new Error('Notifications indisponibles');
      }
      const payload = await response.json();
      setNotifications(payload);
    } catch (error) {
      setAdminError(error.message || 'Erreur notifications');
    }
  }

  const markNotificationRead = async (notificationId) => {
    if (!adminToken) {
      return;
    }
    await fetch(`${API_BASE}/api/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    fetchNotifications();
  };

  const submitAdminStatus = async (event) => {
    event.preventDefault();
    setAdminStatus('');
    setAdminError('');
    if (!adminToken) {
      setAdminError('Ajoutez un token admin');
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE}/api/reports/${adminForm.reportId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ status: adminForm.status }),
        }
      );
      if (!response.ok) {
        throw new Error('Mise a jour impossible');
      }
      setAdminStatus('Statut mis a jour');
      fetchReports();
    } catch (error) {
      setAdminError(error.message || 'Erreur lors de la mise a jour');
    }
  };

  const applyBulkStatus = async () => {
    setAdminStatus('');
    setAdminError('');
    if (!adminToken) {
      setAdminError('Ajoutez un token admin');
      return;
    }
    if (selectedReports.length === 0) {
      setAdminError('Selectionnez au moins un signalement');
      return;
    }
    try {
      await Promise.all(
        selectedReports.map((reportId) =>
          fetch(`${API_BASE}/api/reports/${reportId}/status`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${adminToken}`,
            },
            body: JSON.stringify({ status: bulkStatus }),
          })
        )
      );
      setAdminStatus('Statuts mis a jour');
      fetchReports();
    } catch (error) {
      setAdminError(error.message || 'Erreur lors de la mise a jour');
    }
  };

  const fetchComments = async (reportId) => {
    if (!adminToken) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/api/reports/${reportId}/comments`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (!response.ok) {
        throw new Error('Commentaires indisponibles');
      }
      const payload = await response.json();
      setReportComments(payload);
    } catch (error) {
      setAdminError(error.message || 'Erreur commentaires');
    }
  };

  const submitComment = async (event) => {
    event.preventDefault();
    if (!activeReportId || !commentText.trim()) {
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE}/api/reports/${activeReportId}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ comment: commentText }),
        }
      );
      if (!response.ok) {
        throw new Error('Commentaire non envoye');
      }
      setCommentText('');
      fetchComments(activeReportId);
      fetchNotifications();
    } catch (error) {
      setAdminError(error.message || 'Erreur commentaire');
    }
  };

  const getStatusClass = (status) => {
    if (status === 'PENDING') return 'pill pending';
    if (status === 'IN_PROGRESS') return 'pill progress';
    if (status === 'RESOLVED') return 'pill done';
    return 'pill';
  };

  if (!adminChecked || !isAdmin) {
    return null;
  }

  return (
    <section className="admin-mini">
      <div className="admin-mini-copy">
        <p className="eyebrow">Sprint 4</p>
        <h2>Console administrateur</h2>
        <p>
          Acces admin requis. Le token est auto-rempli si vous vous connectez avec
          un compte admin.
        </p>
        <div className="admin-mini-status">
          {adminStatus && <span className="success-text">{adminStatus}</span>}
          {adminError && <span className="error-text">{adminError}</span>}
        </div>
        <div className="admin-view-toggle">
          <button
            type="button"
            className={!adminView ? 'primary' : 'ghost'}
            onClick={() => setAdminView(false)}
          >
            Compact
          </button>
          <button
            type="button"
            className={adminView ? 'primary' : 'ghost'}
            onClick={() => setAdminView(true)}
          >
            Tableau de bord
          </button>
        </div>
      </div>
      <div className="admin-mini-panel">
        <label>
          Token admin
          <input
            value={adminToken}
            onChange={(event) => setAdminToken(event.target.value)}
            placeholder="Bearer ..."
          />
        </label>
        <button className="ghost" type="button" onClick={fetchReports}>
          Charger les signalements
        </button>
        {!adminView ? (
          <form className="admin-mini-form" onSubmit={submitAdminStatus}>
            <label>
              ID du signalement
              <input
                name="reportId"
                value={adminForm.reportId}
                onChange={handleAdminChange}
                placeholder="1"
                required
              />
            </label>
            <label>
              Statut
              <select
                name="status"
                value={adminForm.status}
                onChange={handleAdminChange}
              >
                <option value="PENDING">En attente</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="RESOLVED">Resolue</option>
              </select>
            </label>
            <button className="primary" type="submit">
              Mettre a jour
            </button>
          </form>
        ) : (
          <div className="admin-dashboard">
            <div className="admin-dashboard-actions">
              <label>
                Recherche
                <input
                  value={adminSearch}
                  onChange={(event) => {
                    setAdminSearch(event.target.value);
                    setAdminPage(1);
                  }}
                  placeholder="Categorie ou description"
                />
              </label>
              <label>
                Statut
                <select
                  value={adminStatusFilter}
                  onChange={(event) => {
                    setAdminStatusFilter(event.target.value);
                    setAdminPage(1);
                  }}
                >
                  <option value="">Tous</option>
                  <option value="PENDING">En attente</option>
                  <option value="IN_PROGRESS">En cours</option>
                  <option value="RESOLVED">Resolus</option>
                </select>
              </label>
              <label>
                Categorie
                <select
                  value={adminCategoryFilter}
                  onChange={(event) => {
                    setAdminCategoryFilter(event.target.value);
                    setAdminPage(1);
                  }}
                >
                  <option value="">Toutes</option>
                  {adminCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Statut global
                <select
                  value={bulkStatus}
                  onChange={(event) => setBulkStatus(event.target.value)}
                >
                  <option value="PENDING">En attente</option>
                  <option value="IN_PROGRESS">En cours</option>
                  <option value="RESOLVED">Resolus</option>
                </select>
              </label>
              <button className="primary" type="button" onClick={applyBulkStatus}>
                Mettre a jour la selection
              </button>
            </div>
            <div className="admin-notifications">
              <div className="admin-notifications-header">
                <h4>Notifications</h4>
                <button className="ghost" type="button" onClick={fetchNotifications}>
                  Rafraichir
                </button>
              </div>
              {notifications.length === 0 ? (
                <p>Aucune notification.</p>
              ) : (
                <ul>
                  {notifications.map((note) => (
                    <li key={note.id}>
                      <div>
                        <p>{note.message}</p>
                        <span>{note.is_read ? 'Lu' : 'Non lu'}</span>
                      </div>
                      {!note.is_read && (
                        <button
                          type="button"
                          className="ghost"
                          onClick={() => markNotificationRead(note.id)}
                        >
                          Marquer lu
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="admin-dashboard-list">
              {adminReports.length === 0 ? (
                <p>Aucun signalement charge.</p>
              ) : (
                adminReports.map((report) => (
                  <div key={report.id} className="admin-dashboard-item">
                    <label className="admin-dashboard-select">
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(report.id)}
                        onChange={() => toggleReportSelection(report.id)}
                      />
                    </label>
                    <div className="admin-dashboard-info">
                      <p>{report.category}</p>
                      <span>{report.description}</span>
                    </div>
                    <span className={getStatusClass(report.status)}>
                      {report.status}
                    </span>
                    <button
                      className="ghost"
                      type="button"
                      onClick={() => {
                        setActiveReportId(report.id);
                        setCommentText('');
                        fetchComments(report.id);
                      }}
                    >
                      Commentaires
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="admin-pagination">
              <button
                className="ghost"
                type="button"
                onClick={() => setAdminPage((prev) => Math.max(prev - 1, 1))}
                disabled={adminPage === 1}
              >
                Precedent
              </button>
              <span>
                Page {adminPage} / {totalPages}
              </span>
              <button
                className="ghost"
                type="button"
                onClick={() =>
                  setAdminPage((prev) => (prev < totalPages ? prev + 1 : prev))
                }
                disabled={adminPage >= totalPages}
              >
                Suivant
              </button>
            </div>
            {activeReportId && (
              <div className="admin-comments">
                <div className="admin-comments-header">
                  <h4>Commentaires</h4>
                  <button
                    className="ghost"
                    type="button"
                    onClick={() => setActiveReportId(null)}
                  >
                    Fermer
                  </button>
                </div>
                <div className="admin-comments-list">
                  {reportComments.length === 0 ? (
                    <p>Aucun commentaire.</p>
                  ) : (
                    reportComments.map((comment) => (
                      <div key={comment.id}>
                        <p>{comment.comment}</p>
                        <span>{comment.author_email}</span>
                      </div>
                    ))
                  )}
                </div>
                <form className="admin-comments-form" onSubmit={submitComment}>
                  <textarea
                    rows="3"
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                    placeholder="Ajouter un commentaire"
                  />
                  <button className="primary" type="submit">
                    Envoyer
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminPage;
