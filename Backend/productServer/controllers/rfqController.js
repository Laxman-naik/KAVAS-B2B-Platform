const pool = require("../config/db");

exports.createRFQ = async (req, res) => {
  try {
    const { buyer_org_id, product_id, title, description, quantity, budget } =
      req.body || {};

    if (!buyer_org_id) {
      return res.status(400).json({
        success: false,
        message: "buyer_org_id is required",
      });
    }

    if (!String(title || "").trim()) {
      return res.status(400).json({
        success: false,
        message: "RFQ title is required",
      });
    }

    if (!quantity || Number(quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid quantity is required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO rfqs
      (buyer_org_id, product_id, title, description, quantity, budget)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [
        buyer_org_id,
        product_id || null,
        title,
        description || null,
        quantity,
        budget || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "RFQ created successfully",
      rfq: result.rows[0],
    });
  } catch (err) {
    console.error("createRFQ error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getRFQs = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        r.*,
        p.name AS product_name,
        p.price AS product_price,
        o.name AS buyer_organization
      FROM rfqs r
      LEFT JOIN products p ON p.id = r.product_id
      LEFT JOIN organizations o ON o.id = r.buyer_org_id
      ORDER BY r.created_at DESC
      `
    );

    return res.json({
      success: true,
      rfqs: result.rows,
    });
  } catch (err) {
    console.error("getRFQs error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getSingleRFQ = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT 
        r.*,
        p.name AS product_name,
        p.price AS product_price,
        p.description AS product_description,
        o.name AS buyer_organization
      FROM rfqs r
      LEFT JOIN products p ON p.id = r.product_id
      LEFT JOIN organizations o ON o.id = r.buyer_org_id
      WHERE r.id = $1
      `,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "RFQ not found",
      });
    }

    return res.json({
      success: true,
      rfq: result.rows[0],
    });
  } catch (err) {
    console.error("getSingleRFQ error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getBuyerRFQs = async (req, res) => {
  try {
    const { buyerOrgId } = req.params;

    const result = await pool.query(
      `
      SELECT 
        r.*,
        p.name AS product_name,
        p.price AS product_price
      FROM rfqs r
      LEFT JOIN products p ON p.id = r.product_id
      WHERE r.buyer_org_id = $1
      ORDER BY r.created_at DESC
      `,
      [buyerOrgId]
    );

    return res.json({
      success: true,
      rfqs: result.rows,
    });
  } catch (err) {
    console.error("getBuyerRFQs error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateRFQStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["open", "closed", "cancelled", "quoted"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid RFQ status",
      });
    }

    const result = await pool.query(
      `
      UPDATE rfqs
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "RFQ not found",
      });
    }

    return res.json({
      success: true,
      message: "RFQ status updated successfully",
      rfq: result.rows[0],
    });
  } catch (err) {
    console.error("updateRFQStatus error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteRFQ = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM rfqs
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "RFQ not found",
      });
    }

    return res.json({
      success: true,
      message: "RFQ deleted successfully",
    });
  } catch (err) {
    console.error("deleteRFQ error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};