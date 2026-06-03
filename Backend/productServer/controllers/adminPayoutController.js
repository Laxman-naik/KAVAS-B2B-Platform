const pool = require("../config/db");

/* ================= GET ALL PAYOUTS ================= */
exports.getAllPayouts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        vp.*,
        v.email AS vendor_email,
        v.phone AS vendor_phone,
        vbd.bank_name,
        vbd.account_holder_name,
        vbd.account_number,
        vbd.ifsc_code,
        vbd.branch_name,
        vbd.account_type,
        vbus.business_name
      FROM vendor_payouts vp
      JOIN vendorprofile v ON vp.vendor_id = v.id
      LEFT JOIN vendor_onboarding vo ON vo.vendor_id = v.id
      LEFT JOIN vendor_bank_details vbd ON vbd.onboarding_id = vo.id
      LEFT JOIN vendor_business_details vbus ON vbus.onboarding_id = vo.id
      ORDER BY vp.created_at DESC`
    );

    return res.json({
      success: true,
      payouts: result.rows,
    });
  } catch (err) {
    console.error("Get all payouts error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= APPROVE PAYOUT ================= */
exports.approvePayout = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_note } = req.body;

    const result = await pool.query(
      `UPDATE vendor_payouts
       SET payout_status = 'APPROVED',
           admin_note = $2,
           approved_at = NOW(),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, admin_note || null]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Payout request not found",
      });
    }

    return res.json({
      success: true,
      message: "Payout approved successfully",
      payout: result.rows[0],
    });
  } catch (err) {
    console.error("Approve payout error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= REJECT PAYOUT ================= */
exports.rejectPayout = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_note } = req.body;

    const result = await pool.query(
      `UPDATE vendor_payouts
       SET payout_status = 'REJECTED',
           admin_note = $2,
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, admin_note || null]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Payout request not found",
      });
    }

    return res.json({
      success: true,
      message: "Payout rejected successfully",
      payout: result.rows[0],
    });
  } catch (err) {
    console.error("Reject payout error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= MARK PAID ================= */
exports.markPayoutPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { reference_number, admin_note } = req.body;

    if (!reference_number) {
      return res.status(400).json({
        success: false,
        message: "Reference number is required",
      });
    }

    const result = await pool.query(
      `UPDATE vendor_payouts
       SET payout_status = 'PAID',
           reference_number = $2,
           admin_note = COALESCE($3, admin_note),
           paid_at = NOW(),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, reference_number, admin_note || null]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Payout request not found",
      });
    }

    return res.json({
      success: true,
      message: "Payout marked as paid successfully",
      payout: result.rows[0],
    });
  } catch (err) {
    console.error("Mark payout paid error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};