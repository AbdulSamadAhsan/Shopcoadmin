function range(period, now) {
  let start, end, previousStart;
  if (period === "This week") {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    start.setDate(start.getDate() - (start.getDay() + 6) % 7);
    end = new Date(start); end.setDate(end.getDate() + 7);
    previousStart = new Date(start); previousStart.setDate(previousStart.getDate() - 7);
  } else {
    const offset = period === "Last month" ? -1 : 0;
    start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 1);
    previousStart = new Date(now.getFullYear(), now.getMonth() + offset - 1, 1);
  }
  return { start, end, previousStart };
}
const revenueEligible = order => order.apiStatus === "delivered";
export function getSoldQuantities(orders) {
  const quantities = new Map();
  for (const order of orders) {
    if (order.apiStatus !== "delivered") continue;
    for (const item of order.lineItems || []) {
      if (!item.productId || !Number.isSafeInteger(item.quantity) || item.quantity < 1) continue;
      quantities.set(item.productId, (quantities.get(item.productId) || 0) + item.quantity);
    }
  }
  return quantities;
}
const sum = orders => orders.reduce((value, order) => value + order.amount, 0);
const growth = (current, previous) => previous ? (current - previous) / previous * 100 : null;
export function getAnalytics(orders, products, period, now = new Date()) {
  const { start, end, previousStart } = range(period, now);
  const current = orders.filter(order => new Date(order.createdAt) >= start && new Date(order.createdAt) < end && new Date(order.createdAt) <= now);
  // Compare month-to-date/week-to-date with the same elapsed part of the previous period.
  const cutoff = new Date(Math.min(start.getTime(), previousStart.getTime() + (Math.min(now.getTime(), end.getTime()) - start.getTime())));
  const previous = orders.filter(order => new Date(order.createdAt) >= previousStart && new Date(order.createdAt) < cutoff);
  const earned = current.filter(order => revenueEligible(order) && order.currency === "USD");
  const previousEarned = previous.filter(order => revenueEligible(order) && order.currency === "USD");
  const customers = new Set(current.map(order => order.email)).size;
  const previousCustomers = new Set(previous.map(order => order.email)).size;
  const categories = new Map();
  const dates = [];
  for (let date = new Date(start); date < end; date.setDate(date.getDate() + 1)) dates.push(new Date(date));
  const dayIndex = (date, origin) => Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()) - origin) / 86400000);
  const daily = dates.map(date => ({ date, revenue: 0, orders: 0, previousRevenue: 0, previousOrders: 0 }));
  for (const order of current) {
    const day = daily[dayIndex(new Date(order.createdAt), start)];
    if (day) { day.orders++; if (earned.includes(order)) day.revenue += order.amount; }
  }
  for (const order of previous) {
    const day = daily[dayIndex(new Date(order.createdAt), previousStart)];
    if (day) { day.previousOrders++; if (previousEarned.includes(order)) day.previousRevenue += order.amount; }
  }
  for (const order of earned) for (const item of order.lineItems) {
    const category = products.find(product => product.id === item.productId)?.category || "Other";
    categories.set(category, (categories.get(category) || 0) + item.unitPrice * item.quantity);
  }
  return {
    revenue: sum(earned), revenueOrderCount: earned.length, orderCount: current.length, customers,
    revenueGrowth: growth(sum(earned), sum(previousEarned)), orderGrowth: growth(current.length, previous.length), customerGrowth: growth(customers, previousCustomers),
    daily, categories: [...categories].map(([name, amount]) => ({ name, amount })),
    excludesOtherCurrencies: current.some(order => order.currency !== "USD"),
  };
}
