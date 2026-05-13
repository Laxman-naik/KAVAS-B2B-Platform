// const pool = require("../config/db");

// /* ================= SUMMARY ================= */
// const calculateSummary = (items) => {
//   const subtotal = items.reduce(
//     (sum, item) => sum + Number(item.price) * Number(item.quantity),
//     0
//   );

//   const gst = subtotal * 0.18;

//   return {
//     subtotal: Number(subtotal.toFixed(2)),
//     gst: Number(gst.toFixed(2)),
//     shipping: 0,
//     discount: 0,
//     total: Number((subtotal + gst).toFixed(2)),
//   };
// };

// /* ================= CART HELPERS ================= */
// const getOrCreateCart = async (userId) => {
//   const existing = await pool.query(
//     `SELECT * FROM carts WHERE user_id=$1`,
//     [userId]
//   );

//   if (existing.rows.length) return existing.rows[0];

//   const created = await pool.query(
//     `INSERT INTO carts (user_id, created_at, updated_at)
//      VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
//      RETURNING *`,
//     [userId]
//   );

//   return created.rows[0];
// };

// const getCartItems = async (cartId) => {
//   const result = await pool.query(
//     `SELECT
//       ci.id,
//       ci.cart_id,
//       ci.product_id,
//       ci.variant_id,
//       ci.quantity,
//       ci.moq,
//       ci.image_url,
//       ci.added_at,
//       p.name,
//       p.price
//      FROM cart_items ci
//      JOIN products p ON ci.product_id = p.id
//      WHERE ci.cart_id=$1
//      ORDER BY ci.added_at DESC`,
//     [cartId]
//   );

//   return result.rows;
// };

// /* ================= GET CART ================= */
// exports.getCart = async (req, res) => {
//   try {
//     const userId = req.user?.id;

//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const cart = await getOrCreateCart(userId);
//     const items = await getCartItems(cart.id);

//     res.json({
//       success: true,
//       cart: {
//         ...cart,
//         items,
//         summary: calculateSummary(items),
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* ================= ADD TO CART ================= */
// exports.addToCart = async (req, res) => {
//   try {
//     const userId = req.user?.id;

//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const {
//       productId,
//       variantId = null,
//       quantity = 1,
//       image_url = null,
//     } = req.body;

//     if (!productId) {
//       return res.status(400).json({ message: "productId required" });
//     }

//     // 🔴 1. FETCH PRODUCT (SOURCE OF TRUTH)
//     const productRes = await pool.query(
//       `SELECT 
//         id,
//         name,
//         price,
//         mrp,
//         moq,
//         organization_id,
//         image_url,
//         unit
//        FROM products
//        WHERE id = $1 AND is_active = true`,
//       [productId]
//     );

//     if (!productRes.rows.length) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     const product = productRes.rows[0];

//     // 🔴 2. VALIDATE PRODUCT DATA
//     if (!product.price || product.price <= 0) {
//       throw new Error("Invalid product price in DB");
//     }

//     if (!product.organization_id) {
//       throw new Error("Product missing organization_id");
//     }

//     const price = Number(product.price);
//     const moq = Number(product.moq) || 1;
//     const normalizedQty = Math.max(Number(quantity), moq);

//     const cart = await getOrCreateCart(userId);

//     // 🔴 3. CHECK EXISTING ITEM
//     const existing = await pool.query(
//       `SELECT * FROM cart_items
//        WHERE cart_id=$1 AND product_id=$2`,
//       [cart.id, productId]
//     );

//     if (existing.rows.length) {
//       await pool.query(
//         `UPDATE cart_items
//          SET quantity = quantity + $1
//          WHERE id=$2`,
//         [normalizedQty, existing.rows[0].id]
//       );
//     } else {
//       // 🔴 4. INSERT SNAPSHOT (THIS IS THE KEY FIX)
//       await pool.query(
//         `INSERT INTO cart_items
//         (cart_id, product_id, variant_id, quantity,
//          price, mrp, moq, image_url,
//          organization_id, product_name, unit, added_at)
//         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,CURRENT_TIMESTAMP)`,
//         [
//           cart.id,
//           productId,
//           variantId,
//           normalizedQty,
//           price,                        // ✅ DB price
//           product.mrp,                 // ✅ snapshot
//           moq,
//           image_url || product.image_url,
//           product.organization_id,     // ✅ critical
//           product.name,
//           product.unit,
//         ]
//       );
//     }

//     const items = await getCartItems(cart.id);

//     res.json({
//       success: true,
//       message: "Added to cart",
//       cart: {
//         ...cart,
//         items,
//         summary: calculateSummary(items),
//       },
//     });

//   } catch (err) {
//     console.error("Add to cart error:", err.message);
//     res.status(500).json({ message: err.message });
//   }
// };

// /* ================= UPDATE ITEM ================= */
// exports.updateCartItem = async (req, res) => {
//   try {
//     const userId = req.user?.id;

//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const { itemId } = req.params;
//     const { quantity } = req.body;

//     const cart = await getOrCreateCart(userId);

//     const updated = await pool.query(
//       `UPDATE cart_items
//        SET quantity=$1
//        WHERE id=$2 AND cart_id=$3
//        RETURNING *`,
//       [Math.max(1, Number(quantity)), itemId, cart.id]
//     );

//     if (!updated.rows.length) {
//       return res.status(404).json({ message: "Item not found" });
//     }

//     const items = await getCartItems(cart.id);

//     res.json({
//       success: true,
//       cart: {
//         ...cart,
//         items,
//         summary: calculateSummary(items),
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* ================= REMOVE ITEM ================= */
// exports.removeCartItem = async (req, res) => {
//   try {
//     const userId = req.user?.id;

//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const { itemId } = req.params;

//     const cart = await getOrCreateCart(userId);

//     await pool.query(
//       `DELETE FROM cart_items
//        WHERE id=$1 AND cart_id=$2`,
//       [itemId, cart.id]
//     );

//     res.json({ success: true, message: "Item removed" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* ================= CLEAR CART ================= */
//  exports.clearCart = async (req, res) => {
//   try {
//     const userId = req.user?.id;

//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     await pool.query(
//       "DELETE FROM carts WHERE user_id = $1",
//       [userId]
//     );

//     return res.status(200).json({
//       message: "Cart cleared successfully",
//     });

//   } catch (err) {
//     console.error("CLEAR CART ERROR:", err);

//     return res.status(500).json({
//       message: "Cart clear failed",
//       error: err.message,
//     });
//   }
// };

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

  if (existing.rows.length) {
    return existing.rows[0];
  }

  const created = await pool.query(
    `INSERT INTO carts (user_id, created_at, updated_at)
     VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     RETURNING *`,
    [userId]
  );

  return created.rows[0];
};

/* ================= GET CART ITEMS ================= */
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
      ci.price,
      ci.mrp,
      ci.product_name AS name,
      ci.unit,
      ci.added_at
     FROM cart_items ci
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
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const cart = await getOrCreateCart(userId);
    const items = await getCartItems(cart.id);

    return res.status(200).json({
      success: true,
      cart: {
        ...cart,
        items,
        summary: calculateSummary(items),
      },
    });
  } catch (err) {
    console.error("GET CART ERROR:", err);

    return res.status(500).json({
      message: err.message,
    });
  }
};

/* ================= ADD TO CART ================= */
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const {
      productId,
      variantId = null,
      quantity = 1,
      image_url = null,
    } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "productId required",
      });
    }

    /* ================= FETCH PRODUCT ================= */
    const productRes = await pool.query(
      `SELECT 
          p.id,
          p.name,
          p.price,
          p.mrp,
          p.moq,
          p.organization_id,
          p.unit,
          pi.image_url
       FROM products p
       LEFT JOIN LATERAL (
          SELECT image_url
          FROM product_images
          WHERE product_id = p.id
          ORDER BY is_primary DESC, sort_order ASC
          LIMIT 1
       ) pi ON true
       WHERE p.id = $1
         AND p.is_active = true`,
      [productId]
    );

    if (!productRes.rows.length) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const product = productRes.rows[0];

    /* ================= VALIDATIONS ================= */
    if (!product.price || Number(product.price) <= 0) {
      return res.status(400).json({
        message: "Invalid product price",
      });
    }

    if (!product.organization_id) {
      return res.status(400).json({
        message: "Product missing organization_id",
      });
    }

    const price = Number(product.price);
    const moq = Number(product.moq) || 1;
    const normalizedQty = Math.max(Number(quantity), moq);

    /* ================= GET CART ================= */
    const cart = await getOrCreateCart(userId);

    /* ================= CHECK EXISTING ITEM ================= */
    const existing = await pool.query(
      `SELECT * 
       FROM cart_items
       WHERE cart_id=$1 
         AND product_id=$2
         AND (
           variant_id = $3
           OR (variant_id IS NULL AND $3 IS NULL)
         )`,
      [cart.id, productId, variantId]
    );

    if (existing.rows.length) {
      /* ================= UPDATE EXISTING ================= */
      await pool.query(
        `UPDATE cart_items
         SET quantity = quantity + $1
         WHERE id=$2`,
        [normalizedQty, existing.rows[0].id]
      );
    } else {
      /* ================= INSERT NEW ITEM ================= */
      await pool.query(
        `INSERT INTO cart_items
        (
          cart_id,
          product_id,
          variant_id,
          quantity,
          price,
          mrp,
          moq,
          image_url,
          organization_id,
          product_name,
          unit,
          added_at
        )
        VALUES
        (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,CURRENT_TIMESTAMP
        )`,
        [
          cart.id,
          productId,
          variantId,
          normalizedQty,
          price,
          product.mrp,
          moq,
          image_url || product.image_url || null,
          product.organization_id,
          product.name,
          product.unit,
        ]
      );
    }

    /* ================= RETURN UPDATED CART ================= */
    const items = await getCartItems(cart.id);

    return res.status(200).json({
      success: true,
      message: "Added to cart",
      cart: {
        ...cart,
        items,
        summary: calculateSummary(items),
      },
    });
  } catch (err) {
    console.error("ADD TO CART ERROR:", err);

    return res.status(500).json({
      message: err.message,
    });
  }
};

/* ================= UPDATE ITEM ================= */
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await getOrCreateCart(userId);

    const updated = await pool.query(
      `UPDATE cart_items
       SET quantity=$1
       WHERE id=$2 
         AND cart_id=$3
       RETURNING *`,
      [Math.max(1, Number(quantity)), itemId, cart.id]
    );

    if (!updated.rows.length) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    const items = await getCartItems(cart.id);

    return res.status(200).json({
      success: true,
      cart: {
        ...cart,
        items,
        summary: calculateSummary(items),
      },
    });
  } catch (err) {
    console.error("UPDATE CART ITEM ERROR:", err);

    return res.status(500).json({
      message: err.message,
    });
  }
};

/* ================= REMOVE ITEM ================= */
exports.removeCartItem = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { itemId } = req.params;

    const cart = await getOrCreateCart(userId);

    await pool.query(
      `DELETE FROM cart_items
       WHERE id=$1 
         AND cart_id=$2`,
      [itemId, cart.id]
    );

    const items = await getCartItems(cart.id);

    return res.status(200).json({
      success: true,
      message: "Item removed",
      cart: {
        ...cart,
        items,
        summary: calculateSummary(items),
      },
    });
  } catch (err) {
    console.error("REMOVE CART ITEM ERROR:", err);

    return res.status(500).json({
      message: err.message,
    });
  }
};

/* ================= CLEAR CART ================= */
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const cart = await getOrCreateCart(userId);

    await pool.query(
      `DELETE FROM cart_items
       WHERE cart_id=$1`,
      [cart.id]
    );

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (err) {
    console.error("CLEAR CART ERROR:", err);

    return res.status(500).json({
      message: err.message,
    });
  }
};