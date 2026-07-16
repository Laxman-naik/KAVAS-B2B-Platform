const db = require("../config/db");

exports.getAdminDashboard = async (req, res) => {
  try {

    const [
      usersResult,
      vendorsResult,
      productsResult,
      ordersResult,
      pendingOrdersResult,
      shippedOrdersResult,
      deliveredOrdersResult,
      revenueResult,
      rfqResult,
      recentOrders,
      recentUsers,
      recentVendors,
      recentRFQs,
      recentTransactions,
    ] = await Promise.all([

      db.query(`
        SELECT COUNT(*)::int total_users
        FROM users
      `),

      db.query(`
        SELECT COUNT(*)::int total_vendors
        FROM vendors
      `),

      db.query(`
        SELECT COUNT(*)::int total_products
        FROM products
      `),

      db.query(`
        SELECT COUNT(*)::int total_orders
        FROM orders
      `),

      db.query(`
        SELECT COUNT(*)::int pending_orders
        FROM orders
        WHERE LOWER(status)='pending'
      `),

      db.query(`
        SELECT COUNT(*)::int processing_orders
        FROM orders
        WHERE LOWER(status)='shipped'
      `),

      db.query(`
        SELECT COUNT(*)::int delivered_orders
        FROM orders
        WHERE LOWER(status)='delivered'
      `),

      db.query(`
        SELECT COALESCE(SUM(total_amount),0) total_revenue
        FROM orders
      `),

      db.query(`
        SELECT COUNT(*)::int pending_rfqs
        FROM rfqs
        WHERE LOWER(status)='pending'
      `),

      db.query(`
        SELECT
            o.id,
            o.total_amount,
            o.status,
            o.created_at,
            u.full_name buyer_name
        FROM orders o
        LEFT JOIN users u
        ON o.user_id=u.id
        ORDER BY o.created_at DESC
        LIMIT 10
      `),

      db.query(`
        SELECT
            id,
            full_name,
            email,
            role,
            created_at
        FROM users
        ORDER BY created_at DESC
        LIMIT 5
      `),

      db.query(`
        SELECT
            v.id,
            u.full_name,
            u.email,
            v.status,
            v.is_live,
            v.created_at
        FROM vendors v
        LEFT JOIN users u
        ON u.id=v.user_id
        ORDER BY v.created_at DESC
        LIMIT 5
      `),

      db.query(`
        SELECT
            id,
            title,
            quantity,
            budget,
            status,
            created_at
        FROM rfqs
        ORDER BY created_at DESC
        LIMIT 5
      `),

      db.query(`
        SELECT
            id,
            order_id,
            amount,
            status,
            payment_method,
            razorpay_payment_id,
            created_at
        FROM transactions
        ORDER BY created_at DESC
        LIMIT 5
      `),

    ]);

    res.json({

      success: true,

      stats: {

        totalUsers: usersResult.rows[0].total_users,

        totalVendors: vendorsResult.rows[0].total_vendors,

        totalProducts: productsResult.rows[0].total_products,

        totalOrders: ordersResult.rows[0].total_orders,

        pendingOrders: pendingOrdersResult.rows[0].pending_orders,

        processingOrders: shippedOrdersResult.rows[0].processing_orders,

        deliveredOrders: deliveredOrdersResult.rows[0].delivered_orders,

        totalRevenue: revenueResult.rows[0].total_revenue,

        pendingRFQs: rfqResult.rows[0].pending_rfqs,

      },

      recentOrders: recentOrders.rows,

      recentUsers: recentUsers.rows,

      recentVendors: recentVendors.rows,

      recentRFQs: recentRFQs.rows,

      recentTransactions: recentTransactions.rows,

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      success:false,

      message:err.message

    });

  }
};