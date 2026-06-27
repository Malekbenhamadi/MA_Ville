# MaVille

Plateforme citoyenne de signalement et de suivi des problemes urbains.

## Structure
- frontend: application React
- backend: API FastAPI
- docker-compose.yml: PostgreSQL

## Demarrage rapide

### Base de donnees (PostgreSQL)
Option Docker:
```
docker compose up -d
```

### Backend (FastAPI)
```
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

### Frontend (React)
```
cd frontend
npm install
npm start
```

### Configuration Frontend
Copiez l'exemple si besoin:
```
copy .env.example .env
```
Variable:
- REACT_APP_API_BASE (par defaut http://127.0.0.1:8000)

## Sprint 1 - Authentification
Endpoints:
- POST /api/auth/register
- POST /api/auth/admin/register (X-Admin-Secret header)
- POST /api/auth/login
- GET /api/auth/me
- GET /api/auth/admin/me

## Sprint 4 - Statuts (prep)
Endpoints:
- PATCH /api/reports/{report_id}/status (admin only)
 - GET /api/reports?status=&category=&q=&limit=&offset=
 - GET /api/reports/{report_id}/comments (admin only)
 - POST /api/reports/{report_id}/comments (admin only)
 - GET /api/notifications (admin only)
 - PATCH /api/notifications/{id}/read (admin only)

## Sprint 2 - Signalement
Endpoints:
- POST /api/reports (multipart form with optional photo)
Photo URL is served from /uploads/<filename>
Constraints:
- Description min 10 characters
- Image types: jpg, png, webp
- Image size: max 5 MB

## Sprint 3 - Carte
Frontend uses Leaflet to display reports with latitude/longitude.

## Notes
- Mettez a jour DATABASE_URL dans backend/.env si vous n'utilisez pas Docker.
