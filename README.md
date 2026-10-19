# SHOP.CO Administration Dashboard

React e-commerce admin dashboard for products, orders, customers, coupons, and store analytics.

[Live deployment](https://ecommercedashboard-amber.vercel.app)

## Overview

- Product, order, customer, and coupon pages
- Admin sign-in and account settings
- Revenue and sales visualizations
- CSV export utilities
- Tests for analytics, navigation, and API helpers

## Stack

React, Vite.

## Run locally

```bash
git clone https://github.com/AbdulSamadAhsan/Shopcoadmin.git
cd Shopcoadmin
npm install
```

Copy `.env.example` to `.env` and configure the values for your local environment before starting. Use your own database credentials and freshly generated secrets.

Set `VITE_API_URL` to your [administration API](https://github.com/AbdulSamadAhsan/react-admin-api), for example `http://localhost:5000/api`. Protected dashboard requests require a valid admin account and bearer token.

```bash
npm run dev
```

Use the local URL printed by the development server.

## Available checks

| Command | Script |
| --- | --- |
| `npm run build` | `vite build` |
| `npm run preview` | `vite preview --host 0.0.0.0` |
| `npm run test` | `node --test tests/*.test.js` |

These commands are defined by the project; documentation updates do not imply they have been run.

## Author

[Syed Abdul Samad Ahsan](https://github.com/AbdulSamadAhsan)
