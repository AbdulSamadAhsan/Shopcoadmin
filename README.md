# Commerce Studio — React admin dashboard

A responsive e-commerce admin dashboard using JavaScript, React and CSS. All records are dummy data. No API, backend, TypeScript, authentication service, or real transactions.

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
| `src/pages/`                           | Login, products, customers, and settings screens           |
| `src/Dashboard.jsx` | Dashboard navigation and shared session state |
| `src/components/auth/` | Login form and decorative brand panel |
| `src/styles/login.css` | Scoped responsive login styles |
| `src/utils/validateLogin.js` | Pure login field validation |
| `src/components/layout/`               | Sidebar, header, page heading, footer                           |
| `src/components/dashboard/`            | KPI cards, revenue chart, category sales, top products, traffic |
| `src/components/orders/OrderTable.jsx` | Order rows, filters, pagination, detail actions                 |
| `src/components/products/`             | Reusable product card and SVG artwork                           |
| `src/components/dialogs/`              | Shared dialog shell and individual dialog contents              |
| `src/components/common/`               | Shared search toolbar                                           |
| `src/data/mockData.js`                 | Initial products, sample customers and orders                   |
| `src/hooks/useToast.js`                | Notification state, timeout replacement and cleanup             |
| `src/utils/formatters.js`              | Currency formatting                                             |
| `src/utils/exportCsv.js`               | CSV escaping and browser download                               |
| `src/styles.css`                       | Readable responsive styles, preserving the original design      |

## How to make changes

- **Change sample records:** edit `src/data/mockData.js`.
- **Change a screen:** edit its file under `pages/`; the overview and analytics compose reusable dashboard components in `Dashboard.jsx`.
- **Change product appearance:** edit `ProductCard.jsx` or `ProductArt.jsx`.
- **Change the product form:** edit `components/dialogs/ProductForm.jsx`.
- **Change the sidebar:** edit `components/layout/Sidebar.jsx`.
- **Change colors or breakpoints:** edit `styles.css`.
- **Add a screen:** create a page, add a sidebar entry, and render the page in `Dashboard.jsx`.

Shared dashboard data stays in Dashboard so product edits remain visible when navigating. Components receive their values and callbacks through props; they are defined at module scope instead of inside Dashboard. Small local interactions can have local state as they are added.

## Existing behavior

- Responsive sidebar and mobile menu
- Overview and analytics with sample sales charts
- Searchable orders with status filtering, pagination, and order details
- Product creation, editing, deletion, stock labels, and search
- Customer search and profile dialogs
- Editable store name, sample notifications, and help dialog
- CSV downloads (product rows on Products; order rows on other export-enabled views)
- Responsive login page with email/password validation and password visibility toggle
- Demo logout returns to login

All changes reset when the page reloads. Every fresh load shows login. Logout returns to login and resets the dashboard session. Chart values and customer totals are sample presentation data, not a reporting engine. Currency is USD. Product artwork is local SVG.

CSV helpers quote commas, quotes, and newlines, add a UTF-8 marker, and guard against formula-like text in spreadsheet cells.

## Demo login

Start on the login page, enter any valid email address and a made-up password with at least 6 characters, and select **Sign in to dashboard**. For example: `admin@example.com` and `demo123`. Do not enter a real password.

- `App.jsx` owns the in-memory login flag. It starts as `false`.
- `LoginPage.jsx` assembles the page; `LoginBrandPanel.jsx` provides the illustration.
- `LoginForm.jsx` owns field values, errors, and password visibility.
- `validateLogin.js` validates the fields before calling `onLogin`.
- `Dashboard.jsx` receives `onLogout`; signing out unmounts the dashboard and clears its state.

No credentials are checked against a server, saved to storage, logged, or sent to an API. This is a front-end demo flow, not secure authentication or access control. A future backend must authenticate users and enforce authorization independently.

## Windows setup

Extract the ZIP into `F:\` to create `F:\ecommercedashboard`. Double-click `setup-and-run.cmd` to install dependencies and open the app on port 5174. Requires Node.js 22.12 or newer and internet access for the first install. If port 5174 is in use, close that server first.

## Vercel

Import this repository in Vercel with the project root as the root directory. The included `vercel.json` selects Vite, builds with `npm run build`, and serves `dist`. No environment variables are needed. This app is a demo; login does not provide real authentication.
