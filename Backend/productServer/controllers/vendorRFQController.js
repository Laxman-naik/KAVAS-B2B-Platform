const pool = require("../config/db");

exports.getVendorRFQs = async (req, res) => {
  try {
    const vendorOrgId = req.headers["vendor-id"];

    if (!vendorOrgId) {
      return res.status(400).json({
        success: false,
        message: "vendor-id header is required",
      });
    }

    const result = await pool.query(
      `
      SELECT 
        rv.id,
        rv.rfq_id,
        rv.vendor_org_id,
        rv.status,
        rv.created_at,

        r.title,
        r.description,
        r.quantity,
        r.budget,
        r.created_at AS rfq_created_at,

        p.name AS product_name,
        p.price AS product_price,

        o.name AS buyer_organization
      FROM rfq_vendors rv
      JOIN rfqs r ON r.id = rv.rfq_id
      LEFT JOIN products p ON p.id = r.product_id
      LEFT JOIN organizations o ON o.id = r.buyer_org_id
      WHERE rv.vendor_org_id = $1
      ORDER BY rv.created_at DESC
      `,
      [vendorOrgId]
    );

    return res.json({
      success: true,
      rfqs: result.rows,
    });
  } catch (err) {
    console.error("getVendorRFQs error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateVendorRFQStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["invited", "quoted", "declined"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor RFQ status",
      });
    }

    const result = await pool.query(
      `
      UPDATE rfq_vendors
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Vendor RFQ not found",
      });
    }

    return res.json({
      success: true,
      message: "Vendor RFQ status updated",
      rfq: result.rows[0],
    });
  } catch (err) {
    console.error("updateVendorRFQStatus error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.submitQuote = async (req, res) => {
  try {
    const {
      rfq_id,
      vendor_org_id,
      unit_price,
      total_price,
      quantity,
      delivery_days,
      payment_terms,
      notes,
    } = req.body;

    if (!rfq_id || !vendor_org_id || !unit_price || !total_price) {
      return res.status(400).json({
        success: false,
        message: "rfq_id, vendor_org_id, unit_price and total_price are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO rfq_quotes
      (
        rfq_id,
        vendor_org_id,
        unit_price,
        total_price,
        quantity,
        delivery_days,
        payment_terms,
        notes
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
      `,
      [
        rfq_id,
        vendor_org_id,
        unit_price,
        total_price,
        quantity || null,
        delivery_days || null,
        payment_terms || null,
        notes || null,
      ]
    );

    await pool.query(
      `
      UPDATE rfq_vendors
      SET status = 'quoted'
      WHERE rfq_id = $1 AND vendor_org_id = $2
      `,
      [rfq_id, vendor_org_id]
    );

    await pool.query(
      `
      UPDATE rfqs
      SET status = 'quoted'
      WHERE id = $1
      `,
      [rfq_id]
    );

    return res.status(201).json({
      success: true,
      message: "Quote submitted successfully",
      quote: result.rows[0],
    });
  } catch (err) {
    console.error("submitQuote error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getVendorQuotes = async (req, res) => {
  try {
    const vendorOrgId = req.headers["vendor-id"];

    if (!vendorOrgId) {
      return res.status(400).json({
        success: false,
        message: "vendor-id header is required",
      });
    }

    const result = await pool.query(
      `
      SELECT 
        q.*,
        r.title AS rfq_title,
        r.description AS rfq_description,
        r.quantity AS rfq_quantity,
        r.budget AS rfq_budget,
        p.name AS product_name,
        o.name AS buyer_organization
      FROM rfq_quotes q
      JOIN rfqs r ON r.id = q.rfq_id
      LEFT JOIN products p ON p.id = r.product_id
      LEFT JOIN organizations o ON o.id = r.buyer_org_id
      WHERE q.vendor_org_id = $1
      ORDER BY q.created_at DESC
      `,
      [vendorOrgId]
    );

    return res.json({
      success: true,
      quotes: result.rows,
    });
  } catch (err) {
    console.error("getVendorQuotes error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateQuoteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const vendorOrgId = req.headers["vendor-id"];

    if (!vendorOrgId) {
      return res.status(400).json({
        success: false,
        message: "vendor-id header is required",
      });
    }

    const allowedStatus = ["submitted", "accepted", "rejected", "withdrawn"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quote status",
      });
    }

    const result = await pool.query(
      `
      UPDATE rfq_quotes
      SET status = $1
      WHERE id = $2 AND vendor_org_id = $3
      RETURNING *
      `,
      [status, id, vendorOrgId]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Quote not found for this vendor",
      });
    }

    return res.json({
      success: true,
      message: "Quote status updated",
      quote: result.rows[0],
    });
  } catch (err) {
    console.error("updateQuoteStatus error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};