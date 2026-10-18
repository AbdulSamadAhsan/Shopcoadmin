import React from "react";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import useDashboardData from "./hooks/useDashboardData";
import { getAnalytics } from "./utils/analytics";
import { downloadCsv } from "./utils/exportCsv";
import { pageFromHash, pageHash } from "./utils/navigation";
import useToast from "./hooks/useToast";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import PageHeading from "./components/layout/PageHeading";
import Footer from "./components/layout/Footer";
import SearchToolbar from "./components/common/SearchToolbar";
import Stats from "./components/dashboard/Stats";
import Revenue from "./components/dashboard/Revenue";
import Sales from "./components/dashboard/Sales";
import TopProducts from "./components/dashboard/TopProducts";
import TrafficSources from "./components/dashboard/TrafficSources";
import OrderTable from "./components/orders/OrderTable";
import DashboardDialog from "./components/dialogs/DashboardDialog";
import ProductsPage from "./pages/ProductsPage";
import CustomersPage from "./pages/CustomersPage";
import SettingsPage from "./pages/SettingsPage";
import CouponsPage from "./pages/CouponsPage";
import LoginPage from "./pages/LoginPage";
import { api, clearSession, restoreSession } from "./services/api";
export default function App() {
  const [admin, setAdmin] = useState(restoreSession);
  const [sessionNotice, setSessionNotice] = useState("");
  useEffect(() => {
    const expired = () => setAdmin(null);
    window.addEventListener("admin-session-expired", expired);
    return () => window.removeEventListener("admin-session-expired", expired);
  }, []);
  return admin
    ? <Dashboard onAccountUpdated={() => { clearSession(); setAdmin(null); setSessionNotice("Account updated. Sign in with your updated credentials."); }} admin={admin} onLogout={() => { clearSession(); setAdmin(null); }} />
    : <LoginPage notice={sessionNotice} onLogin={async (email, password) => { const account = await api.login(email, password); setAdmin(account); setSessionNotice(""); }} />;
}

function Dashboard({ onLogout, admin, onAccountUpdated }) {
  const [page, setPage] = useState(() => pageFromHash(window.location.hash));
  const [mobile, setMobile] = useState(false);
  const [period, setPeriod] = useState("This month");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All orders");
  const data = useDashboardData();
  const { products, orders, customers, settings } = data;
  const analytics = getAnalytics(orders, products, period);
  const [modal, setModal] = useState(null);
  const [notifications, setNotifications] = useState(false);
  const [pagination, setPagination] = useState(1);
  const [chart, setChart] = useState("Revenue");

  const { toast, notify, clearToast } = useToast();
  useEffect(() => {
    const syncPage = () => {
      const nextPage = pageFromHash(window.location.hash);
      setPage(nextPage);
      setQuery(""); setPagination(1); setMobile(false); setModal(null); setNotifications(false);
      if (window.location.hash !== pageHash(nextPage)) window.history.replaceState(null, "", pageHash(nextPage));
    };
    syncPage();
    window.addEventListener("hashchange", syncPage);
    return () => window.removeEventListener("hashchange", syncPage);
  }, []);
  function navigate(nextPage) {
    window.location.hash = pageHash(nextPage);
    setPage(nextPage);
    setQuery("");
    setPagination(1);
    setMobile(false);
  }
  function logout() {
    onLogout();
    setMobile(false);
    setNotifications(false);
    setModal(null);
    clearToast();
  }
  const filteredOrders = orders.filter(
    (order) =>
      (status === "All orders" || order.status === status) &&
      `${order.id} ${order.orderNumber} ${order.name} ${order.email} ${order.product}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  function exportData() {
    const rows =
      page === "Products"
        ? [
            ["Product", "Category", "Price", "Stock"],
            ...products.map((product) => [
              product.name,
              product.category,
              product.price,
              product.stock,
            ]),
          ]
        : page === "Customers" ? [
            ["Customer", "Email", "Orders", "Currency", "Total spent"],
            ...customers.flatMap(customer => Object.entries(customer.totalsByCurrency).length ? Object.entries(customer.totalsByCurrency).map(([currency, amount]) => [customer.name, customer.email, customer.orders, currency, amount]) : [[customer.name, customer.email, customer.orders, "USD", 0]]),
          ] : [
            ["Order", "Customer", "Status", "Currency", "Total"],
            ...filteredOrders.map((order) => [
              order.orderNumber,
              order.name,
              order.status,
              order.currency,
              order.amount,
            ]),
          ];
    downloadCsv(rows, `shopco-${page.toLowerCase()}.csv`);
    notify("Your CSV export is ready");
  }
  const orderTableProps = {
    filtered: filteredOrders,
    pagination,
    setPagination,
    status,
    setStatus,
    navigate,
    setModal,
  };
  return (
    <div className="app">
      {mobile && <div className="scrim" onClick={() => setMobile(false)} />}
      <Sidebar
        mobile={mobile}
        setMobile={setMobile}
        page={page}
        navigate={navigate}
        savedName={settings?.storeName || "Store"}
        orderCount={orders.length}
        admin={admin}
        setModal={setModal}
      />
      <main>
        <Header
          onLogout={logout}
          page={page}
          setMobile={setMobile}
          notifications={notifications}
          setNotifications={setNotifications}
          orders={orders}
          products={products}
          admin={admin}
        />
        <div className="content">
          {data.loading && <div className="api-message" role="status">Loading store data...</div>}
          {data.error && <div className="api-message" role="alert">{data.error}<button disabled={data.loading} onClick={() => data.reload()}>Retry</button></div>}
          <PageHeading
            page={page}
            setModal={setModal}
            exportData={exportData}
            period={period}
            setPeriod={setPeriod}
          />
          {["Overview", "Analytics"].includes(page) && (
            <>
              <Stats analytics={analytics} />
              <div className="charts-grid">
                <Revenue chart={chart} setChart={setChart} period={period} analytics={analytics} />
                <Sales analytics={analytics} />
              </div>
              {page === "Overview" ? (
                <div className="bottom-grid">
                  <OrderTable {...orderTableProps} compact />
                  <TopProducts products={[...products].sort((a, b) => b.sold - a.sold)} navigate={navigate} />
                </div>
              ) : (
                <TrafficSources />
              )}
            </>
          )}
          {["Orders", "Products", "Customers"].includes(page) && (
            <SearchToolbar
              page={page}
              query={query}
              setQuery={setQuery}
              setPagination={setPagination}
              count={page === "Products" ? products.length : page === "Customers" ? customers.length : orders.length}
            />
          )}
          {page === "Orders" && <OrderTable {...orderTableProps} />}
          {page === "Coupons" && <CouponsPage notify={notify} />}
          {page === "Products" && (
            <ProductsPage
              products={products}
              query={query}
              setModal={setModal}
            />
          )}
          {page === "Customers" && (
            <CustomersPage query={query} setModal={setModal} customers={customers} />
          )}
          {page === "Settings" && (
            <SettingsPage
              admin={admin}
              onAccountUpdated={onAccountUpdated}
              settings={settings}
              saveSettings={data.saveSettings}
              notify={notify}
            />
          )}
          <Footer />
        </div>
      </main>
      {toast && (
        <div className="toast" role="status">
          <Check size={18} />
          {toast}
        </div>
      )}
      <DashboardDialog
        products={products}
        modal={modal}
        setModal={setModal}
        saveProduct={data.saveProduct}
        deleteProduct={data.deleteProduct}
        updateStatus={async (id, status) => { const order = await data.updateStatus(id, status); setPagination(1); return order; }}
        notify={notify}
      />
    </div>
  );
}
