# 🐾 FurEver Home — Client

The Next.js frontend for the FurEver Home pet adoption platform. Browse pets, submit adoption requests, and manage your listings through a beautiful, responsive dashboard.

## 🌐 Live URL

> https://assignment-9-client-nu.vercel.app

## ✨ Features

- 🔐 **JWT Authentication** — Secure login/registration with tokens stored in HttpOnly cookies; session persists on page reload.
- 🐕 **Browse & Search Pets** — Filter by species, search by name, and sort by adoption fee or date.
- 📋 **Adoption Request Workflow** — Submit requests with a pickup date & message; track their status from your dashboard.
- 🏠 **Owner Dashboard** — List your pets, view incoming adoption requests, and edit or delete your listings.
- 💜 **Wishlist** — Save favourite pets across sessions with localStorage persistence.
- 🌗 **Dark / Light Theme Toggle** — System-preference-aware with localStorage persistence.
- 📱 **Fully Responsive** — Mobile, tablet, and desktop layouts with a hamburger nav menu.
- 🔔 **Toast Notifications** — All user feedback delivered via custom slide-in toast UI.
- 🔑 **Google OAuth** — One-click sign in with your Google account.

## 🛠️ NPM Packages Used

| Package | Purpose |
|---|---|
| `next` | React framework with App Router |
| `react` / `react-dom` | UI library |
| `lucide-react` | Icon library |
| `@react-oauth/google` | Google OAuth login component |

## 🚀 Getting Started Locally

### Prerequisites
- Node.js ≥ 18
- The backend server running at `http://localhost:5000`

### 1. Clone the repository
```bash
git clone https://github.com/mahmudul194/Assignment-9-client.git
cd Assignment-9-client
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create a `.env.local` file
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-google-client-id>
```

### 4. Run the development server
```bash
npm run dev
```

Visit **http://localhost:3000**

## 📁 Project Structure

```
client/
└── src/
    ├── app/
    │   ├── page.js              # Homepage with hero & pet listings
    │   ├── pets/                # All pets & pet detail pages
    │   ├── login/               # Login page
    │   ├── register/            # Register page
    │   └── dashboard/           # Protected dashboard pages
    │       ├── my-listings/     # Manage your pet listings
    │       ├── add-pet/         # Add a new pet listing
    │       ├── my-requests/     # View your adoption requests
    │       └── wishlist/        # Saved favourite pets
    ├── components/
    │   ├── Navbar.js            # Sticky responsive navigation
    │   ├── Footer.js            # Site footer
    │   └── Loader.js            # Full-page loading spinner
    └── context/
        ├── AuthContext.js       # Auth state, login, logout, wishlist
        ├── ThemeContext.js      # Dark/light theme management
        └── ToastContext.js      # Global toast notification system
```

## 🔒 Security Notes
- JWT is stored in HttpOnly cookies on the server — never accessible to client-side JS.
- All dashboard routes check for an authenticated user and redirect to `/login` if not found.
- Google Client ID is exposed via `NEXT_PUBLIC_` prefix intentionally — it is safe to be public.
