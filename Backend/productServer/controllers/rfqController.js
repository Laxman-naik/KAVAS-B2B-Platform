const pool = require("../config/db");

exports.createRFQ = async (req, res) => {
  try {
    const {
      buyer_org_id,
      product_id,
      title,
      description,
      quantity,
      budget,
      vendor_org_ids = [],
    } = req.body;

    console.log("RFQ REQUEST BODY:", req.body);

    if (!buyer_org_id || !title || !quantity) {
      return res.status(400).json({
        success: false,
        message: "buyer_org_id, title and quantity are required",
      });
    }

    const rfqResult = await pool.query(
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

    const rfq = rfqResult.rows[0];

    if (Array.isArray(vendor_org_ids) && vendor_org_ids.length > 0) {
      for (const vendorId of vendor_org_ids) {
        await pool.query(
          `
          INSERT INTO rfq_vendors
          (rfq_id, vendor_org_id)
          VALUES ($1,$2)
          `,
          [rfq.id, vendorId]
        );
      }
    }

    return res.status(201).json({
      success: true,
      message: "RFQ created successfully",
      rfq,
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

          r.title,
          r.description,
          r.quantity,
          r.budget,
          r.created_at AS rfq_created_at,
          r.product_id,

          p.name AS product_name,
          p.price AS product_price,

          o.name AS buyer_organization

      FROM rfq_vendors rv

      INNER JOIN rfqs r
          ON rv.rfq_id = r.id

      LEFT JOIN products p
          ON p.id = r.product_id

      LEFT JOIN organizations o
          ON o.id = r.buyer_org_id

      WHERE rv.vendor_org_id = $1

      ORDER BY r.created_at DESC
      `,
      [vendorOrgId]
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

// exports.getBuyerRFQs = async (req, res) => {
//   try {
//     const { buyerOrgId } = req.params;

//     const result = await pool.query(
//       `
//       SELECT 
//         r.*,
//         p.name AS product_name,
//         p.price AS product_price
//       FROM rfqs r
//       LEFT JOIN products p ON p.id = r.product_id
//       WHERE r.buyer_org_id = $1
//       ORDER BY r.created_at DESC
//       `,
//       [buyerOrgId]
//     );

//     return res.json({
//       success: true,
//       rfqs: result.rows,
//     });
//   } catch (err) {
//     console.error("getBuyerRFQs error:", err);
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
exports.getBuyerRFQs = async (req, res) => {
  try {
    const { buyerOrgId } = req.params;

    const result = await pool.query(
      `
      SELECT
          r.id,
          r.title,
          r.description,
          r.quantity,
          r.budget,
          r.status,
          r.created_at,

          p.name AS product_name,

          COUNT(q.id) AS quotes_received,

          COUNT(rv.id) AS vendors_invited

      FROM rfqs r

      LEFT JOIN products p
          ON p.id = r.product_id

      LEFT JOIN rfq_quotes q
          ON q.rfq_id = r.id

      LEFT JOIN rfq_vendors rv
          ON rv.rfq_id = r.id

      WHERE r.buyer_org_id = $1

      GROUP BY
          r.id,
          p.name

      ORDER BY r.created_at DESC
      `,
      [buyerOrgId]
    );

    return res.json({
      success: true,
      rfqs: result.rows,
    });

  } catch (err) {

    console.error(err);

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

exports.assignVendorsToRFQ = async (req, res) => {
  try {
    const { rfqId } = req.params;
    const { vendor_org_ids } = req.body || {};

    if (!Array.isArray(vendor_org_ids) || vendor_org_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "vendor_org_ids array is required",
      });
    }

    const assignedVendors = [];

    for (const vendorOrgId of vendor_org_ids) {
      const result = await pool.query(
        `
        INSERT INTO rfq_vendors
        (rfq_id, vendor_org_id, status)
        VALUES ($1, $2, 'invited')
        RETURNING *
        `,
        [rfqId, vendorOrgId]
      );

      assignedVendors.push(result.rows[0]);
    }

    return res.status(201).json({
      success: true,
      message: "Vendors assigned successfully",
      assigned_vendors: assignedVendors,
    });
  } catch (err) {
    console.error("assignVendorsToRFQ error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getRFQQuotes = async (req, res) => {
  try {
    const { rfqId } = req.params;

    // RFQ Details
    const rfqResult = await pool.query(
      `
      SELECT
        r.*,
        o.name AS buyer_organization,
        p.name AS product_name
      FROM rfqs r
      LEFT JOIN organizations o
        ON o.id = r.buyer_org_id
      LEFT JOIN products p
        ON p.id = r.product_id
      WHERE r.id = $1
      `,
      [rfqId]
    );

    if (!rfqResult.rows.length) {
      return res.status(404).json({
        success: false,
        message: "RFQ not found",
      });
    }

    // Quotes
    const quoteResult = await pool.query(
      `
      SELECT
        q.*,
        o.name AS vendor_name,
        o.business_type AS vendor_type
      FROM rfq_quotes q
      LEFT JOIN organizations o
        ON o.id = q.vendor_org_id
      WHERE q.rfq_id = $1
      ORDER BY q.total_price ASC
      `,
      [rfqId]
    );

    const quotes = quoteResult.rows;

    let lowestPrice = null;
    let fastestDelivery = null;

    if (quotes.length > 0) {
      lowestPrice = Math.min(
        ...quotes.map((q) => Number(q.total_price))
      );

      fastestDelivery = Math.min(
        ...quotes.map((q) => Number(q.delivery_days || 0))
      );
    }

    return res.json({
      success: true,
      rfq: rfqResult.rows[0],
      statistics: {
        totalQuotes: quotes.length,
        lowestPrice,
        fastestDelivery,
      },
      quotes,
    });
  } catch (err) {
    console.error("getRFQQuotes error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.acceptQuote = async (req, res) => {
  const client = await pool.connect();

  try {
    const { quoteId } = req.params;

    await client.query("BEGIN");

    const quoteResult = await client.query(
      `SELECT * FROM rfq_quotes WHERE id = $1`,
      [quoteId]
    );

    if (!quoteResult.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    const quote = quoteResult.rows[0];

    const rfqResult = await client.query(
      `SELECT * FROM rfqs WHERE id = $1`,
      [quote.rfq_id]
    );

    if (!rfqResult.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "RFQ not found",
      });
    }

    const rfq = rfqResult.rows[0];

    await client.query(
      `UPDATE rfq_quotes SET status = 'accepted' WHERE id = $1`,
      [quoteId]
    );

    await client.query(
      `
      UPDATE rfq_quotes
      SET status = 'rejected'
      WHERE rfq_id = $1 AND id <> $2
      `,
      [quote.rfq_id, quoteId]
    );

    await client.query(
      `UPDATE rfqs SET status = 'closed' WHERE id = $1`,
      [quote.rfq_id]
    );

    const existingOrder = await client.query(
      `SELECT id FROM orders WHERE quote_id = $1`,
      [quoteId]
    );

    let order = existingOrder.rows[0];

    if (!order) {
      const orderResult = await client.query(
        `
        INSERT INTO orders
        (
          supplier_org_id,
          total_amount,
          status,
          delivery_status,
          rfq_id,
          quote_id
        )
        VALUES ($1, $2, 'pending', 'pending', $3, $4)
        RETURNING *
        `,
        [
          quote.vendor_org_id,
          quote.total_price,
          quote.rfq_id,
          quote.id,
        ]
      );

      order = orderResult.rows[0];

      await client.query(
        `
        INSERT INTO order_items
        (
          order_id,
          product_id,
          quantity,
          price,
          organization_name
        )
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
          order.id,
          rfq.product_id || null,
          quote.quantity,
          quote.unit_price,
          "RFQ Order",
        ]
      );

      await client.query(
        `
        INSERT INTO order_status_history
        (order_id, status)
        VALUES ($1, 'pending')
        `,
        [order.id]
      );
    }

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "Quote accepted successfully",
      order,
      redirect: "/buyer/orders",
    });
  } catch (err) {
    await client.query("ROLLBACK");

    console.error("acceptQuote error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  } finally {
    client.release();
  }
};