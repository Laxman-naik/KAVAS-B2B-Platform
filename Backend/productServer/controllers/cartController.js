const pool = require("../config/db");

const isUUID = (value) =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );

exports.getCart = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const result = await pool.query(
      `SELECT 
          u.full_name AS user_name,
          ci.id AS item_id,
          ci.quantity,
          ci.price,
          ci.image_url,
          ci.variant_id,
          ci.moq,
          p.id AS product_id,
          p.name AS product_name
       FROM carts c
       JOIN users u ON c.user_id = u.id
       LEFT JOIN cart_items ci ON ci.cart_id = c.id
       LEFT JOIN products p ON ci.product_id = p.id
       WHERE c.user_id = $1`,
      [userId]
    );

    if (!result.rows.length) {
      return res.json({ cart: null });
    }

    const cart = {
      user: result.rows[0].user_name,
      items: [],
      totalAmount: 0,
    };

    for (const row of result.rows) {
      if (row.item_id) {
        const price = Number(row.price || 0);
        const total = price * row.quantity;

        cart.items.push({
          id: row.item_id,
          productId: row.product_id,
          name: row.product_name,
          quantity: row.quantity,
          price,
          total,
          image_url: row.image_url,
          moq: row.moq,
          variant_id: row.variant_id,
        });

        cart.totalAmount += total;
      }
    }

    res.json({ cart });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { id: userId } = req.user;
    let { productId, quantity, variantId } = req.body;

    quantity = Number(quantity);

    if (!productId || !Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const productResult = await pool.query(
      `SELECT id, organization_id, price FROM products WHERE id = $1`,
      [productId]
    );

    if (!productResult.rows.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = productResult.rows[0];

    let cartResult = await pool.query(
      `SELECT * FROM carts WHERE user_id = $1`,
      [userId]
    );

    let cart;

    if (!cartResult.rows.length) {
      const newCart = await pool.query(
        `INSERT INTO carts (user_id)
         VALUES ($1)
         RETURNING *`,
        [userId]
      );
      cart = newCart.rows[0];
    } else {
      cart = cartResult.rows[0];
    }

    const existingItem = await pool.query(
      `SELECT * FROM cart_items
       WHERE cart_id = $1 
       AND product_id = $2
       AND (variant_id = $3 OR ($3 IS NULL AND variant_id IS NULL))`,
      [cart.id, productId, variantId || null]
    );

    if (existingItem.rows.length) {
      await pool.query(
        `UPDATE cart_items
         SET quantity = quantity + $1,
             price = COALESCE(price, $3)
         WHERE id = $2`,
        [quantity, existingItem.rows[0].id, product.price]
      );
    } else {
      await pool.query(
        `INSERT INTO cart_items 
        (cart_id, product_id, quantity, variant_id, price, organization_id)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          cart.id,
          productId,
          quantity,
          variantId || null,
          product.price, 
          product.organization_id 
        ]
      );
    }

    res.json({ message: "Added to cart" });

  } catch (err) {
    console.error("AddToCart Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { itemId } = req.params;
    let { quantity } = req.body;

    if (!isUUID(itemId)) {
      return res.status(400).json({ message: "Invalid itemId" });
    }

    quantity = Number(quantity);

    if (!Number.isInteger(quantity) || quantity < 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const itemResult = await pool.query(
      `SELECT ci.*, p.stock, p.price AS product_price
       FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       LEFT JOIN products p ON ci.product_id = p.id
       WHERE ci.id = $1 AND c.user_id = $2`,
      [itemId, userId]
    );

    if (!itemResult.rows.length) {
      return res.status(404).json({
        message: "Item not found or not owned by user",
      });
    }

    const item = itemResult.rows[0];

    if (quantity === 0) {
      await pool.query(
        `DELETE FROM cart_items WHERE id = $1`,
        [itemId]
      );

      return res.json({ message: "Item removed" });
    }

    if (item.stock !== null && quantity > item.stock) {
      return res.status(400).json({
        message: `Only ${item.stock} items available`,
      });
    }

    const result = await pool.query(
      `UPDATE cart_items
       SET quantity = $1,
           price = COALESCE(price, $3)
       WHERE id = $2
       RETURNING id, product_id, quantity, price`,
      [quantity, itemId, item.product_price]
    );

    res.json({
      message: "Cart updated",
      item: result.rows[0],
    });

  } catch (err) {
    console.error("UpdateCartItem Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { itemId } = req.params;

    if (!isUUID(itemId)) {
      return res.status(400).json({ message: "Invalid itemId" });
    }

    const itemCheck = await pool.query(
      `SELECT ci.id
       FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       WHERE ci.id = $1 AND c.user_id = $2`,
      [itemId, userId]
    );

    if (!itemCheck.rows.length) {
      return res.status(404).json({
        message: "Item not found or not owned by user",
      });
    }

    await pool.query(
      `DELETE FROM cart_items WHERE id = $1`,
      [itemId]
    );

    res.json({ message: "Item removed" });

  } catch (err) {
    console.error("RemoveCartItem Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

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
    console.error("ClearCart Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};