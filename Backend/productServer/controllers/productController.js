const pool = require("../config/db");
const uploadToCloudinary = require("../services/uploadToCloudinary");


const slugify = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

// Shared helper — parses JSON arrays or passes through existing arrays
const safeParseArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};


exports.createProduct = async (req, res) => {
  const client = await pool.connect();

  try {

    const {
      name,
      sku,
      description,
      category,
      subCategory,
      price,
      mrp,
      stock,
      moq,
      unit,
      organizationId,
      specifications,
      bulkPricing,
      variants,
      brand,
      warranty,
      returnPolicy,
      returnDays,
      codAvailable,
      isOriginal,
      gstInvoiceAvailable,
      securePaymentAvailable,
      returnExchangeAvailable,
      fastDeliveryAvailable,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name required",
      });
    }

    const resolvedOrganizationId =
      organizationId || req.user?.organization_id;

    if (!resolvedOrganizationId) {
      return res.status(400).json({
        success: false,
        message: "organizationId required",
      });
    }

    await client.query("BEGIN");

    const productResult = await client.query(
      `INSERT INTO products (
        organization_id,
        name,
        description,
        price,
        mrp,
        moq,
        stock,
        is_active,
        slug,
        sku,
        unit,
        brand,
        warranty,
        return_policy,
        return_days,
        cod_available,
        is_original,
        gst_invoice_available,
        secure_payment_available,
        return_exchange_available,
        fast_delivery_available
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,true,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19,$20
      )
      RETURNING *`,
      [
        resolvedOrganizationId,
        name,
        description || null,
        Number(price) || 0,
        Number(mrp) || 0,
        Number(moq) || 1,
        Number(stock) || 0,
        slugify(name),
        sku || null,
        unit || null,
        brand || null,
        warranty || null,
        returnPolicy || null,
        Number(returnDays) || 7,
        codAvailable === "false" ? false : true,
        isOriginal === "false" ? false : true,
        gstInvoiceAvailable === "false" ? false : true,
        securePaymentAvailable === "false" ? false : true,
        returnExchangeAvailable === "false" ? false : true,
        fastDeliveryAvailable === "false" ? false : true,
      ]
    );

    const product = productResult.rows[0];

    const images = req.files?.images || [];
    const videos = req.files?.videos || [];

    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      if (!file?.path) continue;

      const uploaded = await uploadToCloudinary(file.path, "products/images");

      await client.query(
        `INSERT INTO product_images
         (product_id, image_url, media_type, public_id, sort_order, is_primary)
         VALUES ($1,$2,'image',$3,$4,$5)`,
        [product.id, uploaded.url, uploaded.public_id, i, i === 0]
      );
    }

    for (let i = 0; i < videos.length; i++) {
      const file = videos[i];
      if (!file?.path) continue;

      const uploaded = await uploadToCloudinary(file.path, "products/videos");

      await client.query(
        `INSERT INTO product_images
         (product_id, image_url, media_type, public_id, sort_order, is_primary)
         VALUES ($1,$2,'video',$3,$4,false)`,
        [product.id, uploaded.url, uploaded.public_id, i]
      );
    }

    const specs = safeParseArray(specifications);

    for (const s of specs) {
      if (!s?.name || !s?.value) continue;

      await client.query(
        `INSERT INTO product_specifications (product_id, key, value)
         VALUES ($1,$2,$3)`,
        [product.id, s.name, s.value]
      );
    }

    const parsedVariants = safeParseArray(variants);

    for (const v of parsedVariants) {
      if (!v?.variant_type || !v?.variant_value) continue;

      await client.query(
        `INSERT INTO product_variants (
          product_id,
          variant_type,
          variant_value,
          variant_name,
          sku,
          price,
          mrp,
          stock,
          is_active
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,true)`,
        [
          product.id,
          v.variant_type,
          v.variant_value,
          `${v.variant_type} - ${v.variant_value}`,
          v.sku || null,
          Number(v.price) || 0,
          Number(v.mrp) || 0,
          Number(v.stock) || 0,
        ]
      );
    }

    const pricing = safeParseArray(bulkPricing);

    for (const b of pricing) {
      await client.query(
        `INSERT INTO product_pricing_tiers
         (product_id, min_quantity, max_quantity, price)
         VALUES ($1,$2,$3,$4)`,
        [
          product.id,
          Number(b.minQty || 0),
          Number(b.maxQty || 0),
          Number(b.pricePerUnit || 0),
        ]
      );
    }

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("CREATE PRODUCT ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  } finally {
    client.release();
  }
};

exports.updateProduct = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    // multer already parsed multipart — body fields are in req.body
    const {
      name,
      sku,
      description,
      category,
      subCategory,
      price,
      mrp,
      moq,
      stock,
      unit,
      brand,
      warranty,
      returnPolicy,
      returnDays,
      codAvailable,
      isOriginal,
      gstInvoiceAvailable,
      securePaymentAvailable,
      returnExchangeAvailable,
      fastDeliveryAvailable,
      specifications,
      variants,
      bulkPricing,
    } = req.body || {};

    if (!name?.trim()) {
      return res.status(400).json({ success: false, message: "Product name required" });
    }

    await client.query("BEGIN");

    // ── 1. Update core product row ────────────────────────────
    const productResult = await client.query(
      `UPDATE products
       SET name                      = $1,
           sku                       = $2,
           description               = $3,
           price                     = $4,
           mrp                       = $5,
           moq                       = $6,
           stock                     = $7,
           unit                      = $8,
           brand                     = $9,
           warranty                  = $10,
           return_policy             = $11,
           return_days               = $12,
           cod_available             = $13,
           is_original               = $14,
           gst_invoice_available     = $15,
           secure_payment_available  = $16,
           return_exchange_available = $17,
           fast_delivery_available   = $18,
           slug                      = $19,
           updated_at                = NOW()
       WHERE id = $20
       RETURNING *`,
      [
        name,
        sku || null,
        description || null,
        Number(price) || 0,
        Number(mrp) || 0,
        Number(moq) || 1,
        Number(stock) || 0,
        unit || null,
        brand || null,
        warranty || null,
        returnPolicy || null,
        Number(returnDays) || 7,
        codAvailable === "false" ? false : true,
        isOriginal === "false" ? false : true,
        gstInvoiceAvailable === "false" ? false : true,
        securePaymentAvailable === "false" ? false : true,
        returnExchangeAvailable === "false" ? false : true,
        fastDeliveryAvailable === "false" ? false : true,
        slugify(name),
        id,
      ]
    );

    if (!productResult.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const product = productResult.rows[0];

    // ── 2. Upload NEW images (if any provided) ────────────────
    const newImages = req.files?.images || [];
    const newVideos = req.files?.videos || [];

    if (newImages.length > 0) {
      // Get current image count for sort_order
      const countRes = await client.query(
        `SELECT COUNT(*) FROM product_images WHERE product_id = $1 AND media_type = 'image'`,
        [product.id]
      );
      let offset = parseInt(countRes.rows[0].count, 10);

      for (let i = 0; i < newImages.length; i++) {
        const file = newImages[i];
        if (!file?.path) continue;
        const uploaded = await uploadToCloudinary(file.path, "products/images");
        await client.query(
          `INSERT INTO product_images (product_id, image_url, media_type, public_id, sort_order, is_primary)
           VALUES ($1,$2,'image',$3,$4,$5)`,
          [product.id, uploaded.url, uploaded.public_id, offset + i, offset === 0 && i === 0]
        );
      }
    }

    if (newVideos.length > 0) {
      for (let i = 0; i < newVideos.length; i++) {
        const file = newVideos[i];
        if (!file?.path) continue;
        const uploaded = await uploadToCloudinary(file.path, "products/videos");
        await client.query(
          `INSERT INTO product_images (product_id, image_url, media_type, public_id, sort_order, is_primary)
           VALUES ($1,$2,'video',$3,$4,false)`,
          [product.id, uploaded.url, uploaded.public_id, i]
        );
      }
    }

    // ── 3. Replace specifications ─────────────────────────────
    if (specifications !== undefined) {
      await client.query(`DELETE FROM product_specifications WHERE product_id = $1`, [product.id]);
      const specs = safeParseArray(specifications);
      for (const s of specs) {
        if (!s?.name || !s?.value) continue;
        await client.query(
          `INSERT INTO product_specifications (product_id, key, value) VALUES ($1,$2,$3)`,
          [product.id, s.name, s.value]
        );
      }
    }

    // ── 4. Replace variants ───────────────────────────────────
    if (variants !== undefined) {
      await client.query(`DELETE FROM product_variants WHERE product_id = $1`, [product.id]);
      const parsedVariants = safeParseArray(variants);
      for (const v of parsedVariants) {
        if (!v?.variant_type || !v?.variant_value) continue;
        await client.query(
          `INSERT INTO product_variants
             (product_id, variant_type, variant_value, variant_name, sku, price, mrp, stock, is_active)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,true)`,
          [
            product.id,
            v.variant_type,
            v.variant_value,
            `${v.variant_type} - ${v.variant_value}`,
            v.sku || null,
            Number(v.price) || 0,
            Number(v.mrp) || 0,
            Number(v.stock) || 0,
          ]
        );
      }
    }

    // ── 5. Replace bulk pricing ───────────────────────────────
    if (bulkPricing !== undefined) {
      await client.query(`DELETE FROM product_pricing_tiers WHERE product_id = $1`, [product.id]);
      const pricing = safeParseArray(bulkPricing);
      for (const b of pricing) {
        if (!b?.minQty && !b?.min_qty) continue;
        await client.query(
          `INSERT INTO product_pricing_tiers (product_id, min_quantity, max_quantity, price)
           VALUES ($1,$2,$3,$4)`,
          [
            product.id,
            Number(b.minQty || b.min_qty || 0),
            Number(b.maxQty || b.max_qty || 0),
            Number(b.pricePerUnit || b.price_per_unit || 0),
          ]
        );
      }
    }

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("updateProduct error:", err);
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM products WHERE id = $1 RETURNING id, name`,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ success: true, message: "Product deleted", id: result.rows[0].id });
  } catch (err) {
    console.error("deleteProduct error:", err);
    res.status(500).json({ message: err.message });
  }
};

// exports.getProducts = async (req, res) => {
//   try {
//     const result = await pool.query(
//       `SELECT * FROM products
//        WHERE is_active = true
//        ORDER BY created_at DESC`
//     );

//     res.json({
//       products: result.rows,
//     });
//   } catch (err) {
//     console.error("getProducts error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };
exports.getProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,

        COALESCE(
          (
            SELECT pi.image_url
            FROM product_images pi
            WHERE pi.product_id = p.id
              AND pi.media_type = 'image'
            ORDER BY pi.is_primary DESC, pi.sort_order ASC
            LIMIT 1
          ),
          null
        ) AS image_url,

        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', c.id,
              'name', c.name,
              'slug', c.slug
            )
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'
        ) AS categories,

        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', pi.id,
              'image_url', pi.image_url,
              'sort_order', pi.sort_order,
              'is_primary', pi.is_primary
            )
          ) FILTER (WHERE pi.media_type = 'image'),
          '[]'
        ) AS images,

        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', pi.id,
              'video_url', pi.image_url,
              'sort_order', pi.sort_order
            )
          ) FILTER (WHERE pi.media_type = 'video'),
          '[]'
        ) AS videos,

        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'key', ps.key,
              'value', ps.value
            )
          ) FILTER (WHERE ps.id IS NOT NULL),
          '[]'
        ) AS specifications,

        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'minQty', ppt.min_quantity,
              'maxQty', ppt.max_quantity,
              'price', ppt.price
            )
          ) FILTER (WHERE ppt.id IS NOT NULL),
          '[]'
        ) AS bulkPricing,

        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', pv.id,
              'type', pv.variant_type,
              'value', pv.variant_value,
              'price', pv.price,
              'mrp', pv.mrp,
              'stock', pv.stock,
              'image_url', pv.image_url
            )
          ) FILTER (WHERE pv.id IS NOT NULL),
          '[]'
        ) AS variants

      FROM products p

      LEFT JOIN product_categories pc 
        ON pc.product_id = p.id

      LEFT JOIN categories c 
        ON c.id = pc.category_id

      LEFT JOIN product_images pi 
        ON pi.product_id = p.id

      LEFT JOIN product_specifications ps 
        ON ps.product_id = p.id

      LEFT JOIN product_pricing_tiers ppt 
        ON ppt.product_id = p.id

      LEFT JOIN product_variants pv 
        ON pv.product_id = p.id

      WHERE p.is_active = true

      GROUP BY p.id

      ORDER BY p.created_at DESC
    `);

    return res.json({
      success: true,
      products: result.rows,
    });
  } catch (err) {
    console.error("getProducts error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getFlashDeals = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,

        COALESCE(
          (
            SELECT pi.image_url
            FROM product_images pi
            WHERE pi.product_id = p.id
              AND pi.media_type = 'image'
            ORDER BY pi.is_primary DESC, pi.sort_order ASC
            LIMIT 1
          ),
          null
        ) AS image_url,

        CASE 
          WHEN p.mrp > p.price AND p.mrp > 0
          THEN ROUND(((p.mrp - p.price) / p.mrp) * 100)
          ELSE 0
        END AS discount_percentage,

        CASE 
          WHEN p.mrp > p.price
          THEN p.mrp - p.price
          ELSE 0
        END AS savings

      FROM products p
      WHERE 
        p.is_active = true
        AND p.is_flash_deal = true
        AND p.stock > 0
        AND p.flash_deal_end IS NOT NULL
        AND p.flash_deal_end > NOW()

      ORDER BY p.created_at DESC
    `);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      products: result.rows,
    });
  } catch (err) {
    console.error("getFlashDeals error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.addProductToFlashDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, mrp, flashDealEnd } = req.body;

    if (!price || !mrp || !flashDealEnd) {
      return res.status(400).json({
        success: false,
        message: "price, mrp and flashDealEnd are required",
      });
    }

    const result = await pool.query(
      `
      UPDATE products
      SET 
        price = $1,
        mrp = $2,
        is_flash_deal = true,
        flash_deal_end = $3,
        updated_at = NOW()
      WHERE id = $4
      RETURNING *,
        CASE 
          WHEN mrp > price AND mrp > 0
          THEN ROUND(((mrp - price) / mrp) * 100)
          ELSE 0
        END AS discount_percentage,
        CASE 
          WHEN mrp > price
          THEN mrp - price
          ELSE 0
        END AS savings
      `,
      [Number(price), Number(mrp), flashDealEnd, id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product added to flash deal successfully",
      product: result.rows[0],
    });
  } catch (err) {
    console.error("addProductToFlashDeal error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.updateProductFlashDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, mrp, flashDealEnd } = req.body;

    const result = await pool.query(
      `
      UPDATE products
      SET 
        price = COALESCE($1, price),
        mrp = COALESCE($2, mrp),
        flash_deal_end = COALESCE($3, flash_deal_end),
        is_flash_deal = true,
        updated_at = NOW()
      WHERE id = $4
      RETURNING *,
        CASE 
          WHEN mrp > price AND mrp > 0
          THEN ROUND(((mrp - price) / mrp) * 100)
          ELSE 0
        END AS discount_percentage,
        CASE 
          WHEN mrp > price
          THEN mrp - price
          ELSE 0
        END AS savings
      `,
      [
        price !== undefined ? Number(price) : null,
        mrp !== undefined ? Number(mrp) : null,
        flashDealEnd || null,
        id,
      ]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Flash deal updated successfully",
      product: result.rows[0],
    });
  } catch (err) {
    console.error("updateProductFlashDeal error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.removeProductFromFlashDeal = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE products
      SET 
        is_flash_deal = false,
        flash_deal_end = null,
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Flash deal removed successfully",
      product: result.rows[0],
    });
  } catch (err) {
    console.error("removeProductFromFlashDeal error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getSingleProduct = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const userId = req.user?.id || null;
    const sessionId = req.headers["x-session-id"] || null;
    const ipAddress = req.ip;

    await client.query("BEGIN");

    const productResult = await client.query(
      `
      SELECT
        p.*,
        o.name AS organization_name
      FROM products p
      LEFT JOIN organizations o
        ON p.organization_id = o.id
      WHERE p.id = $1
        AND p.is_active = true
      `,
      [id]
    );

    if (!productResult.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Product not found" });
    }

    const product = productResult.rows[0];

    const [
      imagesResult,
      specsResult,
      pricingResult,
      categoriesResult,
      reviewsResult,
    ] = await Promise.all([
      client.query(
        `
        SELECT
          id,
          image_url,
          media_type,
          public_id,
          sort_order,
          is_primary
        FROM product_images
        WHERE product_id = $1
        ORDER BY is_primary DESC, sort_order ASC
        `,
        [id]
      ),

      client.query(
        `SELECT key, value FROM product_specifications WHERE product_id = $1`,
        [id]
      ),

      client.query(
        `
        SELECT min_quantity, price, label 
        FROM product_pricing_tiers 
        WHERE product_id = $1 
        ORDER BY min_quantity ASC
        `,
        [id]
      ),

      client.query(
        `
        SELECT c.id, c.name, c.slug, c.parent_id
        FROM product_categories pc
        JOIN categories c ON pc.category_id = c.id
        WHERE pc.product_id = $1
        `,
        [id]
      ),

      client.query(
        `
        SELECT 
          r.id,
          r.rating,
          r.comment,
          r.created_at,
          r.image_urls,
          r.video_urls,
          u.full_name
        FROM reviews r
        LEFT JOIN users u ON u.id = r.user_id
        WHERE r.product_id = $1
        ORDER BY r.created_at DESC
        `,
        [id]
      ),
    ]);

    const existingView = await client.query(
      `
      SELECT 1 FROM product_events
      WHERE product_id = $1
        AND event_type = 'view'
        AND (
          (user_id IS NOT NULL AND user_id = $2)
          OR (session_id IS NOT NULL AND session_id = $3)
          OR (ip_address = $4)
        )
        AND created_at > NOW() - INTERVAL '10 minutes'
      LIMIT 1
      `,
      [id, userId, sessionId, ipAddress]
    );

    if (existingView.rows.length === 0) {
      await client.query(
        `
        UPDATE products
        SET views_count = views_count + 1,
            views_last_7_days = views_last_7_days + 1
        WHERE id = $1
        `,
        [id]
      );

      await client.query(
        `
        INSERT INTO product_events 
        (product_id, event_type, user_id, session_id, ip_address)
        VALUES ($1, 'view', $2, $3, $4)
        `,
        [id, userId, sessionId, ipAddress]
      );
    }

    await client.query("COMMIT");

    const images = imagesResult.rows.filter(
      (item) => item.media_type === "image"
    );

    const videos = imagesResult.rows.filter(
      (item) => item.media_type === "video"
    );

    const image_url =
      images.find((img) => img.is_primary)?.image_url ||
      images[0]?.image_url ||
      null;

    return res.json({
      ...product,
      image_url,
      images,
      videos,
      specifications: specsResult.rows,
      pricingTiers: pricingResult.rows,
      categories: categoriesResult.rows,
      reviews: reviewsResult.rows,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("getSingleProduct error:", err);
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;

    const result = await pool.query(
      `
      SELECT DISTINCT ON (p.id)
        p.id,
        p.name,
        p.slug,
        p.description,
        p.price,
        p.mrp,
        p.moq,
        p.stock,
        p.unit,
        p.weight,
        p.dispatch_time_days,
        p.created_at,
        c.id AS category_id,
        c.slug AS category_slug,
        NULL::text AS subcategory_slug,
        pi.image_url
      FROM products p
      JOIN product_categories pc ON pc.product_id = p.id
      JOIN categories c ON c.id = pc.category_id
      LEFT JOIN product_images pi ON pi.product_id = p.id
      WHERE c.slug = $1
        AND p.is_active = true
      ORDER BY p.id, p.created_at DESC;
      `,
      [categorySlug]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error("getProductsByCategory error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProductsByCategoryAndSubcategory = async (req, res) => {
  try {
    const { categorySlug, subcategorySlug } = req.params;

    const result = await pool.query(
      `
      SELECT DISTINCT ON (p.id)
        p.id,
        p.name,
        p.slug,
        p.description,
        p.price,
        p.mrp,
        p.moq,
        p.stock,
        p.unit,
        p.weight,
        p.dispatch_time_days,
        p.created_at,
        parent.id AS category_id,
        parent.slug AS category_slug,
        sub.id AS subcategory_id,
        sub.slug AS subcategory_slug,
        pi.image_url
      FROM products p
      JOIN product_categories pc ON pc.product_id = p.id
      JOIN categories sub ON sub.id = pc.category_id
      JOIN categories parent ON parent.id = sub.parent_id
      LEFT JOIN product_images pi ON pi.product_id = p.id
      WHERE parent.slug = $1
        AND sub.slug = $2
        AND p.is_active = true
      ORDER BY p.id, p.created_at DESC;
      `,
      [categorySlug, subcategorySlug]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error("getProductsByCategoryAndSubcategory error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTrendingProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const result = await pool.query(
      `SELECT p.*, pi.image_url,
        -- ✅ FIX: BETTER SCORING
        (p.sales_last_7_days * 10 + p.views_last_7_days * 0.2) AS score
       FROM products p
       
       -- ✅ FIX: PREVENT DUPLICATES
       LEFT JOIN LATERAL (
         SELECT image_url
         FROM product_images
         WHERE product_id = p.id
         LIMIT 1
       ) pi ON true

       WHERE p.is_active = true
       ORDER BY score DESC
       LIMIT $1`,
      [limit]
    );

    res.json({ success: true, data: result.rows });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNewArrivals = async (req, res) => {
  try {
    // sanitize inputs
    const limit = Math.min(parseInt(req.query.limit) || 30, 50); // max 50
    const days = parseInt(req.query.days) || 30;

    // query (SAFE + NO SYNTAX ISSUES)
    const result = await pool.query(
      `SELECT p.*, pi.image_url
       FROM products p

       LEFT JOIN LATERAL (
         SELECT image_url
         FROM product_images
         WHERE product_id = p.id
         LIMIT 1
       ) pi ON true

       WHERE p.is_active = true
       AND p.created_at >= NOW() - ($1 * INTERVAL '1 day')

       ORDER BY p.created_at DESC
       LIMIT $2`,
      [days, limit]
    );

    return res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });

  } catch (err) {
    console.error("❌ getNewArrivals error:", err.message);
    console.error(err.stack);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch new arrivals",
    });
  }
};

exports.getVendorProducts = async (req, res) => {
  try {
    const { organizationId } = req.params;

    // ==========================================
    // VALIDATION
    // ==========================================
    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "organizationId is required",
      });
    }

    // ==========================================
    // QUERY (FIXED USING LATERAL SUBQUERIES)
    // ==========================================
    const result = await pool.query(
      `
      SELECT 
        p.id,
        p.organization_id,
        p.name,
        p.description,
        p.price,
        p.mrp,
        p.moq,
        p.stock,
        p.slug,
        p.sku,
        p.unit,
        p.is_active,
        p.is_featured,
        p.is_top_product,
        p.avg_rating,
        p.total_reviews,
        p.views_count,
        p.sales_count,
        p.created_at,
        p.updated_at,

        -- =========================
        -- STATUS
        -- =========================
        CASE
  WHEN p.is_active = false THEN 'Inactive'
  WHEN p.stock <= 0 THEN 'Out of Stock'
  WHEN p.stock <= 10 THEN 'Low Stock'
  ELSE 'In Stock'
END AS status,

        -- =========================
        -- CATEGORIES (SAFE)
        -- =========================
        COALESCE(cat.categories, '[]') AS categories,

        -- =========================
        -- IMAGES (SAFE)
        -- =========================
        COALESCE(img.images, '[]') AS images,
        -- =========================
        -- VIDEOS (SAFE)
        -- =========================
        COALESCE(vid.videos, '[]') AS videos,

        -- =========================
        -- SPECIFICATIONS
        -- =========================
        COALESCE(spec.specifications, '[]') AS specifications,

        -- =========================
        -- BULK PRICING
        -- =========================
        COALESCE(price.bulkPricing, '[]') AS bulkPricing,

        -- =========================
        -- VARIANTS
        -- =========================
        COALESCE(variant.variants, '[]') AS variants

      FROM products p

      -- =========================
      -- CATEGORY
      -- =========================
      LEFT JOIN LATERAL (
        SELECT json_agg(
          jsonb_build_object(
            'id', c.id,
            'name', c.name,
            'slug', c.slug
          )
        ) AS categories
        FROM product_categories pc
        JOIN categories c ON c.id = pc.category_id
        WHERE pc.product_id = p.id
      ) cat ON true

      -- =========================
      -- IMAGES
      -- =========================
      LEFT JOIN LATERAL (
        SELECT json_agg(
          jsonb_build_object(
            'id', pi.id,
            'image_url', pi.image_url,
            'public_id', pi.public_id,
            'media_type', pi.media_type,
            'sort_order', pi.sort_order,
            'is_primary', pi.is_primary
          )
          ORDER BY pi.sort_order
        ) AS images
        FROM product_images pi
        WHERE pi.product_id = p.id
          AND pi.media_type = 'image'
      ) img ON true

      -- =========================
      -- VIDEOS
      -- =========================
      LEFT JOIN LATERAL (
        SELECT json_agg(
          jsonb_build_object(
            'id', pi.id,
            'video_url', pi.image_url,
            'public_id', pi.public_id,
            'sort_order', pi.sort_order
          )
          ORDER BY pi.sort_order
        ) AS videos
        FROM product_images pi
        WHERE pi.product_id = p.id
          AND pi.media_type = 'video'
      ) vid ON true

      -- =========================
      -- SPECIFICATIONS
      -- =========================
      LEFT JOIN LATERAL (
        SELECT json_agg(
          jsonb_build_object(
            'id', ps.id,
            'key', ps.key,
            'value', ps.value
          )
        ) AS specifications
        FROM product_specifications ps
        WHERE ps.product_id = p.id
      ) spec ON true

      -- =========================
      -- BULK PRICING
      -- =========================
      LEFT JOIN LATERAL (
        SELECT json_agg(
          jsonb_build_object(
            'id', ppt.id,
            'minQty', ppt.min_quantity,
            'maxQty', ppt.max_quantity,
            'price', ppt.price
          )
        ) AS bulkPricing
        FROM product_pricing_tiers ppt
        WHERE ppt.product_id = p.id
      ) price ON true

      -- =========================
      -- VARIANTS
      -- =========================
      LEFT JOIN LATERAL (
        SELECT json_agg(
          jsonb_build_object(
            'id', pv.id,
            'type', pv.variant_type,
            'value', pv.variant_value,
            'variant_name', pv.variant_name,
            'sku', pv.sku,
            'price', pv.price,
            'mrp', pv.mrp,
            'stock', pv.stock,
            'unit', pv.unit,
            'image_url', pv.image_url,
            'is_active', pv.is_active
          )
        ) AS variants
        FROM product_variants pv
        WHERE pv.product_id = p.id
      ) variant ON true

      WHERE p.organization_id = $1
      ORDER BY p.created_at DESC
      `,
      [organizationId]
    );

    // ==========================================
    // NORMALIZE RESPONSE
    // ==========================================
    const products = result.rows.map((product) => ({
      ...product,

      category:
        product.categories?.[0]?.name || "Uncategorized",

      image:
        product.images?.find((img) => img.is_primary)?.image_url ||
        product.images?.[0]?.image_url ||
        null,
    }));

    // ==========================================
    // RESPONSE
    // ==========================================
    return res.status(200).json({
      success: true,
      count: products.length,
      organizationId,
      products,
    });
  } catch (err) {
    console.error("❌ getVendorProducts error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.getVendorInventory = async (req, res) => {
  try {
    const { organizationId } = req.params;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "organizationId is required",
      });
    }

    const result = await pool.query(
      `
      SELECT 
        p.id,
        p.organization_id,
        p.name,
        p.sku,
        p.price,
        p.mrp,
        p.stock,
        p.moq,
        p.unit,
        p.is_active,
        p.created_at,

        COALESCE(
          (
            SELECT pi.image_url
            FROM product_images pi
            WHERE pi.product_id = p.id
              AND pi.media_type = 'image'
            ORDER BY pi.is_primary DESC, pi.sort_order ASC
            LIMIT 1
          ),
          null
        ) AS image,

        CASE
          WHEN p.stock <= 0 THEN 'Out of Stock'
          WHEN p.stock <= 10 THEN 'Low Stock'
          WHEN p.is_active = false THEN 'Inactive'
          ELSE 'In Stock'
        END AS status

      FROM products p
      WHERE p.organization_id = $1
      ORDER BY p.created_at DESC
      `,
      [organizationId]
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      products: result.rows,
    });
  } catch (err) {
    console.error("getVendorInventory error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};