> Real admin login is now enabled. Dashboard API routes require a valid bearer token for an active admin account. Passwords are saved only in the local, Git-ignored README.credentials.md. Historical demo/no-auth notes below are superseded.

# Commerce Studio — React admin dashboard

A responsive e-commerce admin dashboard using JavaScript, React and CSS. Connected to `F:\react-admin-api` through a small fetch service. The existing component and page structure is retained. No authentication or authorization is applied to the dashboard API calls.

## Run locally

Install Node.js 22.12 or newer, open this folder in your terminal, then run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To make a production build:

```bash
npm run build
npm run preview
```

## Source structure

| Location                               | Responsibility                                                  |
| -------------------------------------- | --------------------------------------------------------------- |
| `src/main.jsx`                         | Mounts React and loads global styles                            |
| `src/App.jsx`                          | Coordinates navigation and shared session state                 |
| `src/pages/`                           | Products, customers, settings, and signed-out screens           |
| `src/components/layout/`               | Sidebar, header, page heading, footer                           |
| `src/components/dashboard/`            | KPI cards, revenue chart, category sales, top products, traffic |
| `src/components/orders/OrderTable.jsx` | Order rows, filters, pagination, detail actions                 |
| `src/components/products/`             | Reusable product card and SVG artwork                           |
| `src/components/dialogs/`              | Shared dialog shell and individual dialog contents              |
| `src/components/common/`               | Shared search toolbar                                           |
| `src/data/mockData.js`                 | Unused original sample data (retained for reference)                   |
| `src/hooks/useToast.js`                | Notification state, timeout replacement and cleanup             |
| `src/utils/formatters.js`              | Currency formatting                                             |
| `src/utils/exportCsv.js`               | CSV escaping and browser download                               |
| `src/styles.css`                       | Readable responsive styles, preserving the original design      |

## How to make changes

- **Change displayed records:** use the API or the dashboard. `src/data/mockData.js` is retained for reference and is no longer imported by the application.
- **Change a screen:** edit its file under `pages/`; the overview and analytics compose reusable dashboard components in `App.jsx`.
- **Change product appearance:** edit `ProductCard.jsx` or `ProductArt.jsx`.
- **Change the product form:** edit `components/dialogs/ProductForm.jsx`.
- **Change the sidebar:** edit `components/layout/Sidebar.jsx`.
- **Change colors or breakpoints:** edit `styles.css`.
- **Add a screen:** create a page, add a sidebar entry, and render the page in `App.jsx`.

Shared data stays in App so product edits remain visible when navigating. Components receive their values and callbacks through props; they are defined at module scope instead of inside App. Small local interactions can have local state as they are added.

## Existing behavior

- Responsive sidebar and mobile menu
- Overview and analytics with sample sales charts
- API orders with search, status filtering, pagination, ordered-item details, and status-only updates
- Product creation, editing, deletion, stock labels, and search
- Customer search and profile dialogs
- Editable store name, sample notifications, and help dialog
- CSV downloads (product rows on Products; order rows on other export-enabled views)
- Demo logout and return to dashboard

Product changes, order statuses, and settings persist in MongoDB through the API. Logout only displays the existing signed-out screen; it is not authentication. Customers are derived from order history. Charts use paid or delivered USD orders, excluding cancelled orders. Traffic analytics are explicitly unavailable. Existing product images are shown with local SVG artwork as a fallback.

CSV helpers quote commas, quotes, and newlines, add a UTF-8 marker, and guard against formula-like text in spreadsheet cells.

## API integration

1. In `F:\react-admin-api`, keep your existing `.env` with `MONGO_URI` and `PORT=4000`, then run `npm start`.
2. In this project, run `npm run dev -- --port 5176` and open `http://127.0.0.1:5176`.
3. The default API base is `http://localhost:4000/api`. To use a different server, copy `.env.example` to `.env.local`, set `VITE_API_URL` (including `/api`), and restart Vite. This is a public API URL, never a secret.
4. If changing the browser origin, include it in the API's comma-separated `CORS_ORIGINS` setting.

`src/services/api.js` handles requests and translates the existing API's MongoDB `_id`, `sales`, nested `customer`, and item snapshots into the dashboard's existing view fields. `src/hooks/useDashboardData.js` owns fetching and saved records. No bearer tokens, cookies, or login flow are added. Requests show loading, retry, and error states; failed writes do not appear as successful changes.

- Products: `GET/POST /api/products`, `PUT/DELETE /api/products/:id`. Create and edit use multipart form data. A JPEG, PNG, or WebP image up to 3 MB is required on create and optional on edit.
- Orders: `GET /api/orders?page=1&limit=100`, `GET /api/orders/:id`, `PUT /api/orders/:id` with **only** `{ "status": "processing" }`. All list pages are fetched so dashboard search and exports cover the full result. Existing statuses are preserved: `pending`, `processing`, `shipped`, `delivered`, `cancelled`; the UI displays `delivered` as Completed.
- Customers: `GET /api/customers`; grouped by customer email from orders, with spending separated by currency and cancelled order totals excluded. First order is shown instead of an invented registration date.
- Settings: `GET/PUT /api/settings`; saves store name, contact email, and USD currency.

Order creation remains the checkout system's responsibility. Empty order/customer lists are displayed when the database contains no orders. No sample records are silently inserted. Order prices come from stored order snapshots, so later catalog price changes do not alter existing orders. Status changes do not charge payments, refund orders, change stock, or contact a shipping carrier.

Revenue is the sum of paid or delivered, non-cancelled USD orders in the selected calendar period. Category sales use item subtotals and the current catalog category (Other if the product is missing). Average order uses the same revenue-eligible orders. Comparisons use the same elapsed part of the previous period. Top products use the API's existing `sales` field. Traffic and conversion metrics are not invented.

Run `npm test` for API adapter, pagination, status-write, failure, and reporting checks, and `npm run build` for the production build.

## Production deployment

This checkout is linked to the existing Vercel `ecommercedashboard` project, serving `https://ecommercedashboard-amber.vercel.app`. Production `VITE_API_URL` is `https://react-admin-api-two.vercel.app/api`. Development continues to use localhost:4000. Deploy this checkout for future dashboard updates.

## Demo login and logout

Every fresh page load starts on the responsive login page. Enter any valid email address and a made-up password of at least six characters (for example `admin@example.com` / `demo123`) to open the dashboard. This is only a UI flow: credentials are never sent to an API, stored, or checked against an account. The dashboard API remains without authentication or authorization.

App keeps the presentation flag in memory and renders the existing dashboard in the same file. Login UI lives under `pages/LoginPage.jsx`, `components/auth/`, and scoped `styles/login.css`. Logout unmounts the dashboard, clears its UI state, and returns to a fresh login form. API-backed products and orders remain saved in the database. No API calls are made until entering the workspace.

## Updating an admin account

In Settings, the Admin account form can update the signed-in admin's email and/or password. A current password is required. New passwords must be at least 15 characters and at most 72 UTF-8 bytes; confirmation is checked in the browser. Leaving the new password blank preserves it. The API rejects duplicate emails and all fields other than email, currentPassword, and newPassword.

`PATCH /api/admin/me` requires an active admin bearer token. Successful updates atomically increment a private session version, invalidating previously issued tokens on all devices, and return to login. Sign in again with the updated credentials. Update your private local credentials notes yourself after making a change; the application never writes passwords to files.
