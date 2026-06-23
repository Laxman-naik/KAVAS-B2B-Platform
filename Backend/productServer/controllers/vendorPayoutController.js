const pool = require("../config/db");

/* ================= GET VENDOR ID ================= */
const getVendorId = async (user) => {
  console.log("VENDOR TOKEN USER:", user);

  const possibleId =
    user?.id ||
    user?.vendor_id ||
    user?.vendorId ||
    user?.organization_id ||
    user?.organizationId;

  const result = await pool.query(
    `SELECT id
     FROM vendorprofile
     WHERE id = $1
        OR email = $2
     LIMIT 1`,
    [possibleId, user?.email]
  );

  return result.rows[0]?.id;
};

/* ================= REQUEST PAYOUT ================= */
exports.requestPayout = async (req, res) => {
  try {
    const vendorId = await getVendorId(req.user);

    if (!vendorId) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    const { payout_amount, remarks } = req.body;

    if (!payout_amount || Number(payout_amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid payout amount is required",
      });
    }

    const result = await pool.query(
      `INSERT INTO vendor_payouts (
        vendor_id,
        payout_amount,
        payout_method,
        payout_status,
        remarks,
        payout_date,
        created_at,
        updated_at
      )
      VALUES ($1, $2, 'BANK_TRANSFER', 'PENDING', $3, NOW(), NOW(), NOW())
      RETURNING *`,
      [vendorId, payout_amount, remarks || null]
    );

    return res.status(201).json({
      success: true,
      message: "Payout request submitted successfully",
      payout: result.rows[0],
    });
  } catch (err) {
    console.error("Request payout error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= GET MY PAYOUTS ================= */
exports.getMyPayouts = async (req, res) => {
  try {
    const vendorId = await getVendorId(req.user);

    if (!vendorId) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    const result = await pool.query(
      `SELECT *
       FROM vendor_payouts
       WHERE vendor_id = $1
       ORDER BY created_at DESC`,
      [vendorId]
    );

    return res.status(200).json({
      success: true,
      payouts: result.rows,
    });
  } catch (err) {
    console.error("Get my payouts error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= PAYOUT SUMMARY ================= */
exports.getPayoutSummary = async (req, res) => {
  try {
    const vendorId = await getVendorId(req.user);

    if (!vendorId) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    const result = await pool.query(
      `SELECT
        COALESCE(SUM(CASE WHEN payout_status = 'PENDING' THEN payout_amount ELSE 0 END), 0) AS pending_amount,
        COALESCE(SUM(CASE WHEN payout_status = 'APPROVED' THEN payout_amount ELSE 0 END), 0) AS approved_amount,
        COALESCE(SUM(CASE WHEN payout_status = 'PAID' THEN payout_amount ELSE 0 END), 0) AS paid_amount,
        COALESCE(SUM(CASE WHEN payout_status = 'REJECTED' THEN payout_amount ELSE 0 END), 0) AS rejected_amount,
        COALESCE(SUM(payout_amount), 0) AS total_requested
       FROM vendor_payouts
       WHERE vendor_id = $1`,
      [vendorId]
    );

    return res.status(200).json({
      success: true,
      summary: result.rows[0],
    });
  } catch (err) {
    console.error("Get payout summary error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};