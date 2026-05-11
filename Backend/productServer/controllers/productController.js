const pool = require("../config/db");

const slugify = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

const normalizeImages = (images) => {
  if (!Array.isArray(images)) return [];
  return images
    .map((img) => {
      if (typeof img === "string") return { image_url: img };
      if (img && typeof img === "object" && typeof img.image_url === "string") {
        return { image_url: img.image_url };
      }
      return null;
    })
    .filter(Boolean);
};

exports.createProduct = async (req, res) => {
  const client = await pool.connect();

  try {
    // =====================================================
    // HELPERS
    // =====================================================

    const safeParse = (value, fallback = []) => {
      try {
        if (Array.isArray(value)) return value;

        return JSON.parse(
          value || JSON.stringify(fallback)
        );
      } catch {
        return fallback;
      }
    };

    const slugifyText = (text) =>
      String(text || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    // =====================================================
    // BODY
    // =====================================================

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
      images,
      videos,
    } = req.body || {};

    if (!String(name || "").trim()) {
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

    // =====================================================
    // TRANSACTION START
    // =====================================================

    await client.query("BEGIN");

    // =====================================================
    // CATEGORY LOGIC
    // =====================================================

    let parentCategoryId = null;
    let subCategoryId = null;

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (category?.trim()) {
      if (uuidRegex.test(category)) {
        parentCategoryId = category;
      } else {
        const existing = await client.query(
          `SELECT id FROM categories WHERE LOWER(name)=LOWER($1) LIMIT 1`,
          [category]
        );

        if (existing.rows.length) {
          parentCategoryId = existing.rows[0].id;
        } else {
          const created = await client.query(
            `INSERT INTO categories (name,slug,parent_id)
             VALUES ($1,$2,NULL) RETURNING id`,
            [category, slugifyText(category)]
          );

          parentCategoryId = created.rows[0].id;
        }
      }
    }

    if (subCategory?.trim()) {
      const existingSub = await client.query(
        `SELECT id FROM categories WHERE LOWER(name)=LOWER($1) LIMIT 1`,
        [subCategory]
      );

      if (existingSub.rows.length) {
        subCategoryId = existingSub.rows[0].id;
      } else {
        const createdSub = await client.query(
          `INSERT INTO categories (name,slug,parent_id)
           VALUES ($1,$2,$3) RETURNING id`,
          [subCategory, slugifyText(subCategory), parentCategoryId]
        );

        subCategoryId = createdSub.rows[0].id;
      }
    }

    // =====================================================
    // PRODUCT INSERT
    // =====================================================

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
        unit
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,true,$8,$9,$10)
      RETURNING *`,
      [
        resolvedOrganizationId,
        name,
        description || null,
        price || 0,
        mrp || 0,
        moq || 1,
        stock || 0,
        slugifyText(name),
        sku || null,
        unit || null,
      ]
    );

    const product = productResult.rows[0];

    // =====================================================
    // PRODUCT CATEGORY MAP
    // =====================================================

    const categories = [];

    if (parentCategoryId) {
      await client.query(
        `INSERT INTO product_categories (product_id,category_id)
         VALUES ($1,$2)`,
        [product.id, parentCategoryId]
      );

      categories.push(parentCategoryId);
    }

    if (subCategoryId) {
      await client.query(
        `INSERT INTO product_categories (product_id,category_id)
         VALUES ($1,$2)`,
        [product.id, subCategoryId]
      );

      categories.push(subCategoryId);
    }

    // =====================================================
    // IMAGES
    // =====================================================

    const parsedImages = safeParse(images);
    const imageList = [];

    for (let i = 0; i < parsedImages.length; i++) {
      await client.query(
        `INSERT INTO product_images
        (product_id,image_url,media_type,sort_order,is_primary)
        VALUES ($1,$2,'image',$3,$4)`,
        [product.id, parsedImages[i], i, i === 0]
      );

      imageList.push({
        image_url: parsedImages[i],
        sort_order: i,
        is_primary: i === 0,
      });
    }

    // =====================================================
    // VIDEOS
    // =====================================================

    const parsedVideos = safeParse(videos);
    const videoList = [];

    for (let i = 0; i < parsedVideos.length; i++) {
      await client.query(
        `INSERT INTO product_images
        (product_id,image_url,media_type,sort_order,is_primary)
        VALUES ($1,$2,'video',$3,false)`,
        [product.id, parsedVideos[i], i]
      );

      videoList.push({
        video_url: parsedVideos[i],
        sort_order: i,
      });
    }

    // =====================================================
    // SPECIFICATIONS
    // =====================================================

    const parsedSpecs = safeParse(specifications);
    const specsList = [];

    for (const spec of parsedSpecs) {
      if (!spec?.name || !spec?.value) continue;

      await client.query(
        `INSERT INTO product_specifications
        (product_id,key,value)
        VALUES ($1,$2,$3)`,
        [product.id, spec.name, spec.value]
      );

      specsList.push(spec);
    }

    // =====================================================
    // BULK PRICING
    // =====================================================

    const parsedPricing = safeParse(bulkPricing);
    const pricingList = [];

    for (const tier of parsedPricing) {
      await client.query(
        `INSERT INTO product_pricing_tiers
        (product_id,min_quantity,max_quantity,price)
        VALUES ($1,$2,$3,$4)`,
        [
          product.id,
          tier.minQty || 1,
          tier.maxQty || null,
          tier.pricePerUnit || 0,
        ]
      );

      pricingList.push(tier);
    }

    // =====================================================
    // VARIANTS
    // =====================================================

    const parsedVariants = safeParse(variants);
    const variantList = [];

    for (const v of parsedVariants) {
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
          unit,
          image_url,
          is_active
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,true)`,
        [
          product.id,
          v.variant_type || null,
          v.variant_value || null,
          `${v.variant_type || ""} - ${v.variant_value || ""}`,
          v.sku || null,
          v.price || 0,
          v.mrp || 0,
          v.stock || 0,
          v.unit || null,
          v.image_url || null,
        ]
      );

      variantList.push(v);
    }

    // =====================================================
    // COMMIT
    // =====================================================

    await client.query("COMMIT");

    // =====================================================
    // FINAL RESPONSE (FIXED)
    // =====================================================

    return res.status(201).json({
      success: true,
      message: "Product created successfully",

      product: {
        ...product,

        categories,
        images: imageList,
        videos: videoList,
        specifications: specsList,
        bulkPricing: pricingList,
        variants: variantList,
      },
    });
  } catch (err) {
    await client.query("ROLLBACK");

    console.error("createProduct error:", err);

    if (err.code === "23505") {
      return res.status(400).json({
        success: false,
        message: "Duplicate SKU found",
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  } finally {
    client.release();
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      slug,
      organizationId,
      isTopProduct,
      parentProductId,
      price,
      mrp,
      minOrderQty,
      stock,
      unit,
      weight,
      dispatchTimeDays,
      description,
      isActive,
      isFeatured,
    } = req.body;

    const result = await pool.query(
      `UPDATE products
       SET name = $1,
           slug = $2,
           organization_id = $3,
           is_top_product = $4,
           parent_product_id = $5,
           price = $6,
           mrp = $7,
           moq = $8,
           stock = $9,
           unit = $10,
           weight = $11,
           dispatch_time_days = $12,
           description = $13,
           is_active = $14,
           is_featured = $15
       WHERE id = $16
       RETURNING *`,
      [
        name,
        slug,
        organizationId,
        isTopProduct ?? false,
        parentProductId || null,
        price,
        mrp,
        minOrderQty,
        stock,
        unit,
        weight,
        dispatchTimeDays,
        description,
        isActive ?? true,
        isFeatured ?? false,
        id,
      ]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("updateProduct error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE products SET is_active = false WHERE id = $1 RETURNING *`,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deactivated" });
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

        -- categories
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

        -- images
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

        -- videos
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

        -- specifications
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'key', ps.key,
              'value', ps.value
            )
          ) FILTER (WHERE ps.id IS NOT NULL),
          '[]'
        ) AS specifications,

        -- pricing tiers
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

        -- variants
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

exports.getSingleProduct = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const userId = req.user?.id || null;

    // ✅ FIX: session + ip tracking
    const sessionId = req.headers["x-session-id"] || null;
    const ipAddress = req.ip;

    await client.query("BEGIN");

    const productResult = await client.query(
      `SELECT * FROM products 
       WHERE id = $1 AND is_active = true`,
      [id]
    );

    if (!productResult.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Product not found" });
    }

    const product = productResult.rows[0];

    // fetch related data
    const [imagesResult, specsResult, pricingResult, categoriesResult] =
      await Promise.all([
        client.query(`SELECT image_url FROM product_images WHERE product_id = $1`, [id]),
        client.query(`SELECT key, value FROM product_specifications WHERE product_id = $1`, [id]),
        client.query(`SELECT min_quantity, price, label FROM product_pricing_tiers WHERE product_id = $1 ORDER BY min_quantity ASC`, [id]),
        client.query(
          `SELECT c.id, c.name, c.slug, c.parent_id
           FROM product_categories pc
           JOIN categories c ON pc.category_id = c.id
           WHERE pc.product_id = $1`,
          [id]
        ),
      ]);

    // ✅ FIX: STRONG THROTTLING (user OR session OR IP)
    const existingView = await client.query(
      `SELECT 1 FROM product_events
       WHERE product_id = $1
       AND event_type = 'view'
       AND (
         (user_id IS NOT NULL AND user_id = $2)
         OR (session_id IS NOT NULL AND session_id = $3)
         OR (ip_address = $4)
       )
       AND created_at > NOW() - INTERVAL '10 minutes'
       LIMIT 1`,
      [id, userId, sessionId, ipAddress]
    );

    if (existingView.rows.length === 0) {
      // update counters
      await client.query(
        `UPDATE products
         SET views_count = views_count + 1,
             views_last_7_days = views_last_7_days + 1
         WHERE id = $1`,
        [id]
      );

      // insert event
      await client.query(
        `INSERT INTO product_events 
         (product_id, event_type, user_id, session_id, ip_address)
         VALUES ($1, 'view', $2, $3, $4)`,
        [id, userId, sessionId, ipAddress]
      );
    }

    await client.query("COMMIT");

    res.json({
      ...product,
      images: imagesResult.rows,
      specifications: specsResult.rows,
      pricingTiers: pricingResult.rows,
      categories: categoriesResult.rows,
    });

  } catch (err) {
    await client.query("ROLLBACK");
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