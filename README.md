# Provider Verification Tool

A full-stack application to look up and verify healthcare providers using the official NPPES NPI Registry API.

## 🚀 Features

- **Provider Search**: Search by 10-digit NPI number or by provider name.
- **Detailed Results**: View credentials, gender, practice locations, and registration dates.
- **Persistence**: Every lookup is automatically saved to a local SQLite database using Drizzle ORM.
- **History Dashboard**: A dedicated dashboard to view, search, and sort past lookups.
- **Responsive UI**: A modern, premium design built with React, Tailwind CSS, and Lucide icons.
- **Rate Limiting**: Backend protection allowing 10 search requests per minute per IP.
- **Optimized Performance**: Debounced search inputs and server-side filtering/sorting.

## 🛠️ Tech Stack

### Frontend

- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router
- **Notifications**: Sonner

### Backend

- **Server**: Node.js + Express
- **Database**: SQLite
- **ORM**: Drizzle ORM
- **Security**: express-rate-limit
- **Testing**: Jest + Supertest + Nock

## 📦 Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd npi_assesment

```

### 2. Backend Setup

```bash
cd server
npm install
# Push the schema to the database
npx drizzle-kit push
# Start the server
npm run dev
```

The server will run at `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd client
npm install
# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`.

## 🧪 Running Tests

The project includes a suite of backend tests covering API logic and database persistence.

```bash
cd server
npm test
```

## 📂 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Main view components
│   │   ├── services/       # API and network logic
│   │   └── App.tsx         # Main entry and routing
├── server/                 # Node/Express backend
│   ├── db/                 # Database schema and connection
│   ├── index.js            # Main server and routes
│   └── index.test.js       # Backend unit tests
└── README.md
```
