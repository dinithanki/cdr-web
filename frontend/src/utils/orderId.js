export const formatOrderId = (orderId) =>
  String(orderId || "")
    .slice(-6)
    .toUpperCase();
