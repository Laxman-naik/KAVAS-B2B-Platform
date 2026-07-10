const db = require("../config/db");

exports.getVendorPaymentHistory = async (req, res) => {
  try {
    const organizationId = req.user.organization_id;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "Vendor organization ID missing",
      });
    }

    const result = await db.query(
      `
      SELECT
        o.id AS order_id,
        o.total_amount,
        o.status AS order_status,
        o.delivery_status,
        o.paid_at,
        o.created_at,
        o.tracking_number,
        o.courier_name,

        CASE
          WHEN o.paid_at IS NOT NULL THEN 'PAID'
          ELSE 'PENDING'
        END AS payment_status

      FROM orders o
      WHERE o.supplier_org_id = $1
      ORDER BY o.created_at DESC
      `,
      [organizationId]
    );

    return res.status(200).json({
      success: true,
      transactions: result.rows,
    });
  } catch (error) {
    console.error("GET VENDOR PAYMENT HISTORY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendor payment history",
      error: error.message,
    });
  }
};