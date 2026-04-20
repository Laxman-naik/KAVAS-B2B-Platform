const pool = require("../config/db");

/* ================= SUMMARY ================= */
const calculateSummary = (items) => {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const gst = subtotal * 0.18;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    gst: Number(gst.toFixed(2)),
    shipping: 0,
    discount: 0,
    total: Number((subtotal + gst).toFixed(2)),
  };
};

/* ================= CART HELPERS ================= */
const getOrCreateCart = async (userId) => {
  const existing = await pool.query(
    `SELECT * FROM carts WHERE user_id=$1`,
    [userId]
  );

  if (existing.rows.length) return existing.rows[0];

  const created = await pool.query(
    `INSERT INTO carts (user_id, created_at, updated_at)
     VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     RETURNING *`,
    [userId]
  );

  return created.rows[0];
};

const getCartItems = async (cartId) => {
  const result = await pool.query(
    `SELECT
      ci.id,
      ci.cart_id,
      ci.product_id,
      ci.variant_id,
      ci.quantity,
      ci.moq,
      ci.image_url,
      ci.added_at,
      p.name,
      p.price
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     WHERE ci.cart_id=$1
     ORDER BY ci.added_at DESC`,
    [cartId]
  );

  return result.rows;
};

/* ================= GET CART ================= */
exports.getCart = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await getOrCreateCart(userId);
    const items = await getCartItems(cart.id);

    res.json({
      success: true,
      cart: {
        ...cart,
        items,
        summary: calculateSummary(items),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= ADD TO CART ================= */
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      productId,
      variantId,
      price,
      moq,
      quantity,
      image_url,
    } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId required" });
    }

    const cart = await getOrCreateCart(userId);

    const normalizedQty = Math.max(Number(quantity), Number(moq) || 1);

    const existing = await pool.query(
      `SELECT * FROM cart_items
       WHERE cart_id=$1 AND product_id=$2`,
      [cart.id, productId]
    );

    if (existing.rows.length) {
      await pool.query(
        `UPDATE cart_items
         SET quantity = quantity + $1
         WHERE id=$2`,
        [normalizedQty, existing.rows[0].id]
      );
    } else {
      await pool.query(
        `INSERT INTO cart_items
        (cart_id, product_id, variant_id, quantity, price, moq, image_url, added_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,CURRENT_TIMESTAMP)`,
        [cart.id, productId, variantId, normalizedQty, price, moq, image_url]
      );
    }

    const items = await getCartItems(cart.id);

    res.json({
      success: true,
      message: "Added to cart",
      cart: {
        ...cart,
        items,
        summary: calculateSummary(items),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE ITEM ================= */
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await getOrCreateCart(userId);

    const updated = await pool.query(
      `UPDATE cart_items
       SET quantity=$1
       WHERE id=$2 AND cart_id=$3
       RETURNING *`,
      [Math.max(1, Number(quantity)), itemId, cart.id]
    );

    if (!updated.rows.length) {
      return res.status(404).json({ message: "Item not found" });
    }

    const items = await getCartItems(cart.id);

    res.json({
      success: true,
      cart: {
        ...cart,
        items,
        summary: calculateSummary(items),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= REMOVE ITEM ================= */
exports.removeCartItem = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { itemId } = req.params;

    const cart = await getOrCreateCart(userId);

    await pool.query(
      `DELETE FROM cart_items
       WHERE id=$1 AND cart_id=$2`,
      [itemId, cart.id]
    );

    res.json({ success: true, message: "Item removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= CLEAR CART ================= */
 exports.clearCart = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await pool.query(
      "DELETE FROM carts WHERE user_id = $1",
      [userId]
    );

    return res.status(200).json({
      message: "Cart cleared successfully",
    });

  } catch (err) {
    console.error("CLEAR CART ERROR:", err);

    return res.status(500).json({
      message: "Cart clear failed",
      error: err.message,
    });
  }
};