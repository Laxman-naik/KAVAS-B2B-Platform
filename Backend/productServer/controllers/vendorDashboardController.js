const db = require("../config/db");

exports.getVendorDashboard = async (req, res) => {
  try {
    const organizationId = req.user.organization_id;

    if (!organizationId) {
      return res.status(400).json({
        message: "Organization ID missing",
      });
    }

    const ordersResult = await db.query(
      `
      SELECT *
      FROM orders
      WHERE supplier_org_id = $1
      ORDER BY created_at DESC
      `,
      [organizationId]
    );

    const productsResult = await db.query(
      `
      SELECT *
      FROM products
      WHERE organization_id = $1
      ORDER BY created_at DESC
      `,
      [organizationId]
    );

    const orders = ordersResult.rows;
    const products = productsResult.rows;

    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.total_amount || 0),
      0
    );

    return res.status(200).json({
      orders,
      products,
      stats: {
        totalRevenue,
        totalOrders: orders.length,
        pendingOrders: orders.filter((o) => o.status === "pending").length,
        processingOrders: orders.filter((o) => o.status === "processing").length,
        shippedOrders: orders.filter((o) => o.delivery_status === "shipped").length,
        deliveredOrders: orders.filter((o) => o.delivery_status === "delivered").length,
        productsListed: products.length,
      },
    });
  } catch (err) {
    console.error("VENDOR DASHBOARD ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};