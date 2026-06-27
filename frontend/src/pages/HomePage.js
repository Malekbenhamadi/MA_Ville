function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Plateforme citoyenne</p>
          <h1>
            Signalez les problemes urbains en quelques secondes,
            <span> suivez leur resolution en temps reel.</span>
          </h1>
          <p className="lead">
            Centralisez photos, geolocalisation et priorites. Les
            administrateurs disposent d&apos;un tableau de bord clair pour agir
            vite.
          </p>
          <div className="hero-actions">
            <button className="primary">Nouveau signalement</button>
            <button className="outline">Voir la carte</button>
          </div>
          <div className="hero-stats">
            <div>
              <p className="stat">128</p>
              <span className="stat-label">Signalements cette semaine</span>
            </div>
            <div>
              <p className="stat">72%</p>
              <span className="stat-label">Resolus en moins de 7 jours</span>
            </div>
            <div>
              <p className="stat">15</p>
              <span className="stat-label">Categories suivies</span>
            </div>
          </div>
        </div>
        <div className="hero-card">
          <div className="card-header">
            <h3>Activite en direct</h3>
            <span className="pill success">+12</span>
          </div>
          <div className="card-row">
            <div>
              <p className="card-title">Eclairage defaillant</p>
              <span className="card-meta">Rue Gambetta</span>
            </div>
            <span className="pill pending">En attente</span>
          </div>
          <div className="card-row">
            <div>
              <p className="card-title">Nid-de-poule</p>
              <span className="card-meta">Boulevard Libertie</span>
            </div>
            <span className="pill progress">En cours</span>
          </div>
          <div className="card-row">
            <div>
              <p className="card-title">Depots sauvages</p>
              <span className="card-meta">Parc Central</span>
            </div>
            <span className="pill done">Resolue</span>
          </div>
          <div className="card-footer">
            <p>Temps moyen de prise en charge: 36h</p>
            <button className="ghost">Voir le tableau de bord</button>
          </div>
        </div>
      </section>

      <section className="feature-grid">
        <article className="feature">
          <h3>Signalement express</h3>
          <p>Photo, categorie, description, tout est guide en 3 etapes.</p>
        </article>
        <article className="feature">
          <h3>Carte interactive</h3>
          <p>Visualisez les problemes par zone et priorite.</p>
        </article>
        <article className="feature">
          <h3>Suivi transparent</h3>
          <p>Recevez des notifications a chaque changement de statut.</p>
        </article>
        <article className="feature">
          <h3>Gestion admin</h3>
          <p>Attribuez, commentez, et priorisez en un clic.</p>
        </article>
      </section>

      <section className="admin-section">
        <div>
          <h2>Tableau de bord administrateur</h2>
          <p>
            Priorisez par gravite, territoire, ou temps d&apos;attente. Chaque
            signalement dispose d&apos;un historique complet.
          </p>
          <div className="admin-tags">
            <span className="pill">En attente</span>
            <span className="pill progress">En cours</span>
            <span className="pill done">Resolus</span>
          </div>
        </div>
        <div className="admin-board">
          <div className="board-column">
            <h4>En attente</h4>
            <div className="board-card">
              <p>Eclairage defaillant</p>
              <span>Quartier Nord</span>
            </div>
            <div className="board-card">
              <p>Voirie endommagee</p>
              <span>Avenue du Port</span>
            </div>
          </div>
          <div className="board-column">
            <h4>En cours</h4>
            <div className="board-card">
              <p>Nid-de-poule</p>
              <span>Rue des Lilas</span>
            </div>
          </div>
          <div className="board-column">
            <h4>Resolus</h4>
            <div className="board-card">
              <p>Depots sauvages</p>
              <span>Parc Central</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
