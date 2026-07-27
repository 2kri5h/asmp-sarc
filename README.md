# ASMP - Alumni Student Mentorship Program

This repository contains both the **Frontend** and **Backend** services for the ASMP project.

## Repository Structure

```
.
├── frontend/             # Vite + React Frontend Application
│   ├── src/
│   │   ├── assets/       # Consolidated static assets (images, fonts, videos)
│   │   ├── components/   # Structured, modular React components
│   │   ├── pages/        # Page views (Login, Register, Research)
│   │   ├── hooks/        # Custom React hooks
│   │   ├── data/         # Mock data & metadata
│   │   └── styles/       # CSS/SCSS stylesheets
│   ├── public/           # Public static files
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/              # Django REST API Backend
│   ├── manage.py
│   ├── pyproject.toml
│   └── requirements.txt
└── docker-compose.yml    # Docker environment orchestration
```

## Getting Started

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Backend Development

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

### Running with Docker Compose

```bash
docker-compose up --build
```
