const pool = require("../config/db");

const calculateSummary = (items) => {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const gst = subtotal * 0.18;
  const shipping = 0;
  const discount = 0;
  const total = subtotal + gst + shipping - discount;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    gst: Number(gst.toFixed(2)),
    shipping,
    discount,
    total: Number(total.toFixed(2)),
  };
};

const getOrCreateCart = async (userId) => {
  const existingCart = await pool.query(
    `SELECT * FROM carts WHERE user_id = $1 LIMIT 1`,
    [userId]
  );

  if (existingCart.rows.length > 0) {
    return existingCart.rows[0];
  }

  const newCart = await pool.query(
    `INSERT INTO carts (user_id, created_at, updated_at)
     VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     RETURNING *`,
    [userId]
  );

  return newCart.rows[0];
};

const getCartItems = async (cartId) => {
  const result = await pool.query(
    `SELECT
      id,
      cart_id,
      product_id,
      name,
      image,
      price,
      moq,
      quantity,
      size,
      color,
      delivery_date,
      created_at,
      updated_at
     FROM cart_items
     WHERE cart_id = $1
     ORDER BY id DESC`,
    [cartId]
  );

  return result.rows;
};

const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    const items = await getCartItems(cart.id);
    const summary = calculateSummary(items);

    return res.status(200).json({
      success: true,
      cart: {
        ...cart,
        items,
        summary,
      },
    });
  } catch (error) {
    console.error("getCart error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
      error: error.message,
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const {
      productId,
      name,
      image,
      price,
      moq = 1,
      quantity,
      size = null,
      color = null,
      deliveryDate = null,
    } = req.body;

    if (!productId || !name) {
      return res.status(400).json({
        success: false,
        message: "productId and name are required",
      });
    }

    const cart = await getOrCreateCart(req.user.id);

    const normalizedMoq = Math.max(1, Number(moq) || 1);
    const normalizedQty = Math.max(
      Number(quantity) || normalizedMoq,
      normalizedMoq
    );

    const existingItemResult = await pool.query(
      `SELECT *
       FROM cart_items
       WHERE cart_id = $1
         AND product_id = $2
         AND ((size = $3) OR (size IS NULL AND $3 IS NULL))
         AND ((color = $4) OR (color IS NULL AND $4 IS NULL))
         AND ((delivery_date = $5) OR (delivery_date IS NULL AND $5 IS NULL))
       LIMIT 1`,
      [cart.id, productId, size, color, deliveryDate]
    );

    let item;

    if (existingItemResult.rows.length > 0) {
      const updated = await pool.query(
        `UPDATE cart_items
         SET quantity = quantity + 1,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        [existingItemResult.rows[0].id]
      );
      item = updated.rows[0];
    } else {
      const inserted = await pool.query(
        `INSERT INTO cart_items
          (cart_id, product_id, name, image, price, moq, quantity, size, color, delivery_date, created_at, updated_at)
         VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING *`,
        [
          cart.id,
          productId,
          name,
          image || null,
          price || 0,
          normalizedMoq,
          normalizedQty,
          size,
          color,
          deliveryDate,
        ]
      );
      item = inserted.rows[0];
    }

    await pool.query(
      `UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [cart.id]
    );

    const items = await getCartItems(cart.id);
    const summary = calculateSummary(items);

    return res.status(200).json({
      success: true,
      message: "Item added to cart",
      item,
      cart: {
        ...cart,
        items,
        summary,
      },
    });
  } catch (error) {
    console.error("addToCart error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
      error: error.message,
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await getOrCreateCart(req.user.id);

    const itemResult = await pool.query(
      `SELECT * FROM cart_items WHERE id = $1 AND cart_id = $2 LIMIT 1`,
      [itemId, cart.id]
    );

    if (itemResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    const item = itemResult.rows[0];
    const moq = Math.max(1, Number(item.moq) || 1);
    const parsedQty = Number(quantity);
    const finalQty = Number.isNaN(parsedQty)
      ? moq
      : Math.max(moq, Math.floor(parsedQty));

    const updated = await pool.query(
      `UPDATE cart_items
       SET quantity = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [finalQty, itemId]
    );

    await pool.query(
      `UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [cart.id]
    );

    const items = await getCartItems(cart.id);
    const summary = calculateSummary(items);

    return res.status(200).json({
      success: true,
      message: "Cart item updated",
      item: updated.rows[0],
      cart: {
        ...cart,
        items,
        summary,
      },
    });
  } catch (error) {
    console.error("updateCartItem error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update cart item",
      error: error.message,
    });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const cart = await getOrCreateCart(req.user.id);

    const deleted = await pool.query(
      `DELETE FROM cart_items
       WHERE id = $1 AND cart_id = $2
       RETURNING *`,
      [itemId, cart.id]
    );

    if (deleted.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    await pool.query(
      `UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [cart.id]
    );

    const items = await getCartItems(cart.id);
    const summary = calculateSummary(items);

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: {
        ...cart,
        items,
        summary,
      },
    });
  } catch (error) {
    console.error("removeCartItem error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove cart item",
      error: error.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);

    await pool.query(`DELETE FROM cart_items WHERE cart_id = $1`, [cart.id]);

    await pool.query(
      `UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [cart.id]
    );

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("clearCart error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error.message,
    });
  }
};

const getCartCount = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);

    const result = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM cart_items
       WHERE cart_id = $1`,
      [cart.id]
    );

    return res.status(200).json({
      success: true,
      count: result.rows[0].count,
    });
  } catch (error) {
    console.error("getCartCount error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get cart count",
      error: error.message,
    });
  }
};

const getCartSummary = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    const items = await getCartItems(cart.id);
    const summary = calculateSummary(items);

    return res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error("getCartSummary error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get cart summary",
      error: error.message,
    });
  }
};

const mergeCart = async (req, res) => {
  try {
    const { items = [] } = req.body;
    const cart = await getOrCreateCart(req.user.id);

    for (const item of items) {
      const {
        productId,
        name,
        image = null,
        price = 0,
        moq = 1,
        quantity,
        size = null,
        color = null,
        deliveryDate = null,
      } = item;

      if (!productId || !name) continue;

      const normalizedMoq = Math.max(1, Number(moq) || 1);
      const normalizedQty = Math.max(
        Number(quantity) || normalizedMoq,
        normalizedMoq
      );

      const existingItemResult = await pool.query(
        `SELECT *
         FROM cart_items
         WHERE cart_id = $1
           AND product_id = $2
           AND ((size = $3) OR (size IS NULL AND $3 IS NULL))
           AND ((color = $4) OR (color IS NULL AND $4 IS NULL))
           AND ((delivery_date = $5) OR (delivery_date IS NULL AND $5 IS NULL))
         LIMIT 1`,
        [cart.id, productId, size, color, deliveryDate]
      );

      if (existingItemResult.rows.length > 0) {
        await pool.query(
          `UPDATE cart_items
           SET quantity = quantity + $1,
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $2`,
          [normalizedQty, existingItemResult.rows[0].id]
        );
      } else {
        await pool.query(
          `INSERT INTO cart_items
            (cart_id, product_id, name, image, price, moq, quantity, size, color, delivery_date, created_at, updated_at)
           VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          [
            cart.id,
            productId,
            name,
            image,
            price,
            normalizedMoq,
            normalizedQty,
            size,
            color,
            deliveryDate,
          ]
        );
      }
    }

    await pool.query(
      `UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [cart.id]
    );

    const finalItems = await getCartItems(cart.id);
    const summary = calculateSummary(finalItems);

    return res.status(200).json({
      success: true,
      message: "Cart merged successfully",
      cart: {
        ...cart,
        items: finalItems,
        summary,
      },
    });
  } catch (error) {
    console.error("mergeCart error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to merge cart",
      error: error.message,
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getCartCount,
  getCartSummary,
  mergeCart,
};