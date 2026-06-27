import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import './App.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function App() {
  const [authMode, setAuthMode] = useState('login');
  const [adminView, setAdminView] = useState(false);
  const [authStatus, setAuthStatus] = useState('');
  const [authError, setAuthError] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
  });
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
  const [mapReports, setMapReports] = useState([]);
  const [mapError, setMapError] = useState('');
  const [mapStatusFilter, setMapStatusFilter] = useState('');
  const [mapCategoryFilter, setMapCategoryFilter] = useState('');
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

  const apiBase = useMemo(
    () => process.env.REACT_APP_API_BASE || 'http://127.0.0.1:8000',
    []
  );

  useEffect(() => {
    const stored = localStorage.getItem('maville_token');
    if (stored) {
      setAdminToken(stored);
    }
  }, []);

  useEffect(() => {
    if (!reportFile) {
      setReportPreview('');
      return;
    }
    const previewUrl = URL.createObjectURL(reportFile);
    setReportPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [reportFile]);

  useEffect(() => {
    const verifyAdmin = async () => {
      import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

      import './App.css';
      import Layout from './components/layout/Layout';
      import AdminPage from './pages/AdminPage';
      import AuthPage from './pages/AuthPage';
      import HomePage from './pages/HomePage';
      import MapPage from './pages/MapPage';
      import ReportPage from './pages/ReportPage';
      import TrackPage from './pages/TrackPage';

      function App() {
        return (
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/reports" element={<ReportPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/track" element={<TrackPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        );
      }

      export default App;
    adminStatusFilter,
