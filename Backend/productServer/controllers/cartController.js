const pool = require("../config/db");

/* GET CART */
exports.getCart = async (req, res) => {
  try {
    const { organizationId } = req.user;

    const cartResult = await pool.query(
      `SELECT * FROM carts WHERE organization_id = $1`,
      [organizationId]
    );

    if (!cartResult.rows.length) {
      return res.json({ items: [] });
    }

    const cart = cartResult.rows[0];

    const itemsResult = await pool.query(
      `SELECT ci.*, p.name, p.price, p.image_url
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1`,
      [cart.id]
    );

    res.json({
      cartId: cart.id,
      items: itemsResult.rows,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { organizationId, id: userId } = req.user;
    const { productId, quantity } = req.body;

    // 1. Get or create cart
    let cartResult = await pool.query(
      `SELECT * FROM carts WHERE organization_id = $1`,
      [organizationId]
    );

    let cart;

    if (!cartResult.rows.length) {
      const newCart = await pool.query(
        `INSERT INTO carts (organization_id, created_by)
         VALUES ($1, $2)
         RETURNING *`,
        [organizationId, userId]
      );
      cart = newCart.rows[0];
    } else {
      cart = cartResult.rows[0];
    }

    // 2. Check if item exists
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

exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    await pool.query(
      `UPDATE cart_items
       SET quantity = $1
       WHERE id = $2`,
      [quantity, itemId]
    );

    res.json({ message: "Cart updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    await pool.query(
      `DELETE FROM cart_items WHERE id = $1`,
      [itemId]
    );

    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const { organizationId } = req.user;

    const cartResult = await pool.query(
      `SELECT id FROM carts WHERE organization_id = $1`,
      [organizationId]
    );

    if (!cartResult.rows.length) {
      return res.json({ message: "Cart already empty" });
    }

    await pool.query(
      `DELETE FROM cart_items WHERE cart_id = $1`,
      [cartResult.rows[0].id]
    );

    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};