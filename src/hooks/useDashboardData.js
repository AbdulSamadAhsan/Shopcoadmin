import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";

export default function useDashboardData() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const reload = useCallback(async (signal) => {
    setLoading(true);
    setError("");
    const results = await Promise.allSettled([api.products(signal), api.orders(signal), api.customers(signal), api.settings(signal)]);
    if (signal?.aborted) return;
    const setters = [setProducts, setOrders, setCustomers, setSettings];
    const names = ["Products", "Orders", "Customers", "Settings"];
    const errors = [];
    results.forEach((result, index) => {
      if (result.status === "fulfilled") setters[index](result.value);
      else errors.push(`${names[index]}: ${result.reason.message}`);
    });
    setError(errors.join(" "));
    setLoading(false);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    reload(controller.signal);
    return () => controller.abort();
  }, [reload]);
  async function saveProduct(id, data) {
    const product = await api.saveProduct(id, data);
    setProducts(current => id ? current.map(item => item.id === id ? product : item) : [product, ...current]);
    return product;
  }
  async function deleteProduct(id) {
    await api.deleteProduct(id);
    setProducts(current => current.filter(item => item.id !== id));
  }
  async function updateStatus(id, status) {
    const order = await api.updateStatus(id, status);
    setOrders(current => current.map(item => item.id === id ? order : item));
    // Totals exclude cancelled orders, so refresh customer spending after status changes.
    try { setCustomers(await api.customers()); }
    catch (error) { setError(`Order saved. Customer totals could not refresh: ${error.message}`); }
    return order;
  }
  async function saveSettings(data) {
    const saved = await api.saveSettings(data);
    setSettings(saved);
    return saved;
  }
  return { products, orders, customers, settings, loading, error, reload, saveProduct, deleteProduct, updateStatus, saveSettings };
}
