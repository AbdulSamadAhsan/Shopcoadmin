import React from "react";
import { Check } from "lucide-react";
import { useState } from "react";
import useDashboardData from "./hooks/useDashboardData";
import { getAnalytics } from "./utils/analytics";
import { downloadCsv } from "./utils/exportCsv";
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
import LoginPage from "./pages/LoginPage";
// Presentation-only sign-in: no credentials or session flags are persisted.
export default function App() {
  const [enteredWorkspace, setEnteredWorkspace] = useState(false);
  return enteredWorkspace
    ? <Dashboard onLogout={() => setEnteredWorkspace(false)} />
    : <LoginPage onLogin={() => setEnteredWorkspace(true)} />;
}

function Dashboard({ onLogout }) {
  const [page, setPage] = useState("Overview");
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
  function navigate(nextPage) {
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
    downloadCsv(rows, `commerce-${page.toLowerCase()}.csv`);
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
        setModal={setModal}
        onLogout={logout}
      />
      <main>
        <Header
          page={page}
          setMobile={setMobile}
          notifications={notifications}
          setNotifications={setNotifications}
          orders={orders}
          products={products}
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
