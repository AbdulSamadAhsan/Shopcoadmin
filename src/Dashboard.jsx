import React from "react";
import { Check } from "lucide-react";
import { useState } from "react";
import { initialProducts, orders as initialOrders } from "./data/mockData";
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

export default function Dashboard({ onLogout }) {
  const [page, setPage] = useState("Overview");
  const [mobile, setMobile] = useState(false);
  const [period, setPeriod] = useState("This month");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All orders");
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [modal, setModal] = useState(null);
  const [notifications, setNotifications] = useState(false);
  const [pagination, setPagination] = useState(1);
  const [chart, setChart] = useState("Revenue");
  const [storeName, setStoreName] = useState("Studio Store");
  const [savedName, setSavedName] = useState("Studio Store");
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
      `${order.id} ${order.name} ${order.product}`
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
        : [
            ["Order", "Customer", "Status", "Total"],
            ...filteredOrders.map((order) => [
              order.id,
              order.name,
              order.status,
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
        savedName={savedName}
        setModal={setModal}
        onLogout={logout}
      />
      <main>
        <Header
          page={page}
          setMobile={setMobile}
          notifications={notifications}
          setNotifications={setNotifications}
        />
        <div className="content">
          <PageHeading
            page={page}
            setModal={setModal}
            exportData={exportData}
            period={period}
            setPeriod={setPeriod}
          />
          {["Overview", "Analytics"].includes(page) && (
            <>
              <Stats period={period} />
              <div className="charts-grid">
                <Revenue chart={chart} setChart={setChart} period={period} />
                <Sales />
              </div>
              {page === "Overview" ? (
                <div className="bottom-grid">
                  <OrderTable {...orderTableProps} compact />
                  <TopProducts products={products} navigate={navigate} />
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
              count={page === "Products" ? products.length : orders.length}
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
            <CustomersPage query={query} setModal={setModal} />
          )}
          {page === "Settings" && (
            <SettingsPage
              storeName={storeName}
              setStoreName={setStoreName}
              setSavedName={setSavedName}
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
        setProducts={setProducts}
        onSaveOrder={(updated) => {
          setOrders((current) => current.map((order) => order.id === updated.id && ["Completed", "Processing", "Pending", "Cancelled"].includes(updated.status) ? { ...order, status: updated.status } : order));
          setPagination(1);
        }}
        notify={notify}
      />
    </div>
  );
}
