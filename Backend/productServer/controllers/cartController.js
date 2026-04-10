const pool = require("../config/db");

/* ================= GET ALL CARTS (GROUPED BY ORG) ================= */
exports.getCart = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const cartsResult = await pool.query(
      `SELECT * FROM carts WHERE user_id = $1`,
      [userId]
    );

    if (!cartsResult.rows.length) {
      return res.json({ carts: [] });
    }

    const carts = [];

    for (const cart of cartsResult.rows) {
      const itemsResult = await pool.query(
        `SELECT ci.*, p.name, p.price, p.image_url
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.cart_id = $1`,
        [cart.id]
      );

      carts.push({
        cartId: cart.id,
        organizationId: cart.organization_id,
        items: itemsResult.rows,
      });
    }

    res.json({ carts });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= ADD TO CART ================= */
exports.addToCart = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // 1. Get product (IMPORTANT)
    const productResult = await pool.query(
      `SELECT id, organization_id FROM products WHERE id = $1`,
      [productId]
    );

    if (!productResult.rows.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = productResult.rows[0];

    // 2. Get or create cart (user + org)
    let cartResult = await pool.query(
      `SELECT * FROM carts 
       WHERE user_id = $1 AND organization_id = $2`,
      [userId, product.organization_id]
    );

    let cart;

    if (!cartResult.rows.length) {
      const newCart = await pool.query(
        `INSERT INTO carts (user_id, organization_id)
         VALUES ($1, $2)
         RETURNING *`,
        [userId, product.organization_id]
      );
      cart = newCart.rows[0];
    } else {
      cart = cartResult.rows[0];
    }

    // 3. Insert or update item
    const existingItem = await pool.query(
      `SELECT * FROM cart_items
       WHERE cart_id = $1 AND product_id = $2`,
      [cart.id, productId]
    );

    if (existingItem.rows.length) {
      await pool.query(
        `UPDATE cart_items
         SET quantity = quantity + $1
         WHERE id = $2`,
        [quantity, existingItem.rows[0].id]
      );
    } else {
      await pool.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity)
         VALUES ($1, $2, $3)`,
        [cart.id, productId, quantity]
      );
    }

    res.json({ message: "Added to cart" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE ITEM ================= */
exports.updateCartItem = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const result = await pool.query(
      `UPDATE cart_items ci
       SET quantity = $1
       FROM carts c
       WHERE ci.id = $2
       AND ci.cart_id = c.id
       AND c.user_id = $3
       RETURNING ci.*`,
      [quantity, itemId, userId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Cart updated" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= REMOVE ITEM ================= */
exports.removeCartItem = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { itemId } = req.params;

    const result = await pool.query(
      `DELETE FROM cart_items ci
       USING carts c
       WHERE ci.id = $1
       AND ci.cart_id = c.id
       AND c.user_id = $2
       RETURNING ci.id`,
      [itemId, userId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item removed" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= CLEAR ALL CARTS ================= */
exports.clearCart = async (req, res) => {
  try {
    const { id: userId } = req.user;

    await pool.query(
      `DELETE FROM cart_items
       WHERE cart_id IN (
         SELECT id FROM carts WHERE user_id = $1
       )`,
      [userId]
    );

    res.json({ message: "All carts cleared" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};