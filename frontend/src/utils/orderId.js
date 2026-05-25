export const formatOrderId = (orderId) =>
  String(orderId || "")
    .slice(-8)
    .toUpperCase();
