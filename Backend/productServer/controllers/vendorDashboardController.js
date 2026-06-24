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
      SELECT
        o.*,

        u.full_name AS buyer_name,
        u.email AS buyer_email,
        u.phone AS buyer_phone,

        org.name AS business_name,

        COALESCE(
          json_agg(
            json_build_object(
              'item_id', oi.id,
              'product_id', oi.product_id,
              'product_name', p.name,
              'quantity', oi.quantity,
              'price', oi.price,
              'organization_name', oi.organization_name
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) AS items,

        COALESCE(SUM(oi.quantity), 0) AS units,
        COUNT(oi.id) AS item_count

      FROM orders o

      LEFT JOIN users u
        ON u.id = o.user_id

      LEFT JOIN organizations org
        ON org.id = o.supplier_org_id

      LEFT JOIN order_items oi
        ON oi.order_id = o.id

      LEFT JOIN products p
        ON p.id = oi.product_id

      WHERE o.supplier_org_id = $1

      GROUP BY
        o.id,
        u.full_name,
        u.email,
        u.phone,
        org.name

      ORDER BY o.created_at DESC
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

    const getStatus = (order) =>
      String(order.delivery_status || order.status || "pending").toLowerCase();

    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.total_amount || 0),
      0
    );

    const totalOrders = orders.length;

    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const previousRevenue = Math.max(totalRevenue - 10000, 1);
    const previousOrders = Math.max(totalOrders - 5, 1);
    const previousAvgOrderValue = Math.max(avgOrderValue - 500, 1);

    const revenueGrowth =
      totalRevenue > 0
        ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
        : 0;

    const ordersGrowth =
      totalOrders > 0
        ? ((totalOrders - previousOrders) / previousOrders) * 100
        : 0;

    const productsGrowth = products.length;

    const avgOrderGrowth =
      avgOrderValue > 0
        ? ((avgOrderValue - previousAvgOrderValue) / previousAvgOrderValue) * 100
        : 0;

    return res.status(200).json({
      orders,
      products,
      stats: {
        totalRevenue,
        totalOrders,
        pendingOrders: orders.filter((o) => getStatus(o) === "pending").length,
        processingOrders: orders.filter((o) => getStatus(o) === "processing")
          .length,
        shippedOrders: orders.filter((o) => getStatus(o) === "shipped").length,
        deliveredOrders: orders.filter((o) => getStatus(o) === "delivered")
          .length,
        productsListed: products.length,
        avgOrderValue,

        revenue_growth: `${revenueGrowth.toFixed(1)}%`,
        orders_growth: `${ordersGrowth.toFixed(1)}%`,
        products_growth: productsGrowth,
        avg_order_growth: `${avgOrderGrowth.toFixed(1)}%`,
      },
    });
  } catch (err) {
    console.error("VENDOR DASHBOARD ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};