import { Link } from 'react-router-dom';

function SiteHeader() {
  return (
    <header className="site-header">
      <div className="brand">
        <span className="brand-mark" />
        <span className="brand-name">MaVille</span>
      </div>
      <nav className="nav-links">
        <Link className="link" to="/reports">
          Signalements
        </Link>
        <Link className="link" to="/map">
          Carte
        </Link>
        <Link className="link" to="/track">
          Suivi
        </Link>
        <Link className="link" to="/admin">
          Admin
        </Link>
      </nav>
      <div className="header-actions">
        <Link className="ghost" to="/auth">
          Se connecter
        </Link>
        <Link className="primary" to="/auth">
          Creer un compte
        </Link>
      </div>
    </header>
  );
}

export default SiteHeader;
