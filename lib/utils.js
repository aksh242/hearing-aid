export function calculateDiscount(customer, totalAmount) {
  const discountRate = customer && customer.has_insurance ? 0.3 : 0;
  return Math.round(totalAmount * discountRate);
}

export function formatINR(number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(number);
}

export function requireAdmin(req, res) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  const expected = process.env.ADMIN_TOKEN || "change-me-secret-token";
  if (!token || token !== expected) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}
