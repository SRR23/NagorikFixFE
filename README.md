# NagorikFix Frontend

React + Vite + Tailwind UI for the NagorikFix API.

## Screens

| Role | Routes |
| --- | --- |
| Nagorik | `/app` reports, `/app/new` submit form |
| Administration | `/admin` inbox + assign, `/admin/approvals` |
| Staff | `/staff` tasks + status update |

## Run

```bash
# Terminal 1 — API
cd NagorikFixAPI
source ../venv/bin/activate
python manage.py runserver

# Terminal 2 — UI
cd NagorikFixFrontend
npm install
npm run dev
```

Open http://localhost:5173

Vite proxies `/api` and `/media` to `http://localhost:8000`.

## Stack

- React 19
- Vite 8
- Tailwind CSS 4
- React Router 7
