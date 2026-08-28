# TourVista - Complete MERN Tours & Travels Booking Website

This is a complete MERN-stack tour booking project prepared for local demonstration.

## Technology
- Frontend: React 18, React Router
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Authentication: JWT + bcryptjs
- API: REST

## Folder structure
- `frontend/` React application
- `backend/` Express API and MongoDB models

## 1. Backend setup

Open Terminal 1:

```powershell
cd backend
npm.cmd install
```

Copy `.env.example` to `.env` and set:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/tourvista
JWT_SECRET=change_this_to_a_long_random_secret
CLIENT_URL=http://localhost:3000
```

If you use MongoDB Atlas, put your Atlas connection string in `MONGO_URI`.

Start backend:

```powershell
npm.cmd run dev
```

or:

```powershell
npm.cmd start
```

Backend:
`http://localhost:5000`

Health check:
`http://localhost:5000/api/health`

## 2. Frontend setup

Open Terminal 2:

```powershell
cd frontend
npm.cmd install
npm.cmd start
```

Frontend:
`http://localhost:3000`

## 3. Demo flow

1. Open the website.
2. Go to Register and create a user.
3. Login using that same email/password.
4. Open Tours.
5. Open a tour.
6. Submit a booking.
7. The booking is sent to the Express backend.
8. If MongoDB is running, the user and booking are stored in MongoDB.

## Important
The project does NOT contain real payment processing. The booking page records a booking request; it does not charge money.

If PowerShell says `npm.ps1 cannot be loaded`, use `npm.cmd` exactly as shown above.
