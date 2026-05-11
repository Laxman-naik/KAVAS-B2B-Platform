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

// exports.createProduct = async (req, res) => {
//   const client = await pool.connect();

//   try {
//     const {
//       name,
//       sku,
//       slug,
//       organizationId,
//       price,
//       mrp,
//       minOrderQty,
//       moq,
//       stock,
//       unit,
//       weight,
//       dispatchTimeDays,
//       description,
//       isActive,
//       status,
//       gst,
//       isFeatured,
//       isTopProduct,
//       parentProductId,
//       categories = [],
//       category,
//       images = [],
//       specifications = [],
//       pricingTiers = [],
//     } = req.body;

//     if (!String(name || "").trim()) {
//       return res.status(400).json({ message: "name is required" });
//     }

//     const resolvedOrganizationId =
//       organizationId ?? req.user?.organization_id ?? req.user?.organizationId;

//     if (!resolvedOrganizationId) {
//       return res.status(400).json({ message: "organizationId is required" });
//     }

//     const resolvedSlug = String(slug || "").trim() || slugify(name);
//     const resolvedMoq = minOrderQty ?? moq;
//     const resolvedIsActive =
//       typeof isActive === "boolean"
//         ? isActive
//         : !String(status || "").trim()
//           ? true
//           : String(status)
//               .trim()
//               .toLowerCase() === "active";

//     const normalizedImages = normalizeImages(images);
//     const mergedSpecifications = Array.isArray(specifications)
//       ? [...specifications]
//       : [];

//     if (String(sku || "").trim()) {
//       mergedSpecifications.push({ key: "sku", value: String(sku).trim() });
//     }
//     if (gst !== undefined && gst !== null && String(gst).trim() !== "") {
//       mergedSpecifications.push({ key: "gst", value: String(gst).trim() });
//     }

//     await client.query("BEGIN");

//     let resolvedCategoryIds = Array.isArray(categories) ? [...categories] : [];

//     if (
//       resolvedCategoryIds.length === 0 &&
//       typeof category === "string" &&
//       category.trim()
//     ) {
//       const categoryName = category.trim();
//       const categorySlug = slugify(categoryName);

//       const categoryResult = await client.query(
//         `SELECT id FROM categories WHERE name = $1 OR slug = $2 LIMIT 1`,
//         [categoryName, categorySlug]
//       );

//       if (categoryResult.rows.length) {
//         resolvedCategoryIds = [categoryResult.rows[0].id];
//       }
//     }

//     const productResult = await client.query(
//       `INSERT INTO products (
//         name, slug, organization_id, price, mrp, moq, stock,
//         unit, weight, dispatch_time_days, description,
//         is_active, is_featured, is_top_product, parent_product_id
//       )
//       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
//       RETURNING *`,
//       [
//         name,
//         resolvedSlug,
//         resolvedOrganizationId,
//         price,
//         mrp,
//         resolvedMoq,
//         stock,
//         unit,
//         weight,
//         dispatchTimeDays,
//         description,
//         resolvedIsActive,
//         isFeatured ?? false,
//         isTopProduct ?? false,
//         parentProductId || null,
//       ]
//     );

//     const product = productResult.rows[0];

//     for (const categoryId of resolvedCategoryIds) {
//       await client.query(
//         `INSERT INTO product_categories (product_id, category_id)
//          VALUES ($1, $2)`,
//         [product.id, categoryId]
//       );
//     }

//     for (const img of normalizedImages) {
//       await client.query(
//         `INSERT INTO product_images (product_id, image_url)
//          VALUES ($1, $2)`,
//         [product.id, img.image_url]
//       );
//     }

//     for (const spec of mergedSpecifications) {
//       await client.query(
//         `INSERT INTO product_specifications (product_id, key, value)
//          VALUES ($1, $2, $3)`,
//         [product.id, spec.key, spec.value]
//       );
//     }

//     for (const tier of pricingTiers) {
//       await client.query(
//         `INSERT INTO product_pricing_tiers (product_id, min_quantity, price, label)
//          VALUES ($1, $2, $3, $4)`,
//         [product.id, tier.min_quantity, tier.price, tier.label]
//       );
//     }

//     await client.query("COMMIT");

//     res.status(201).json({
//       message: "Product created successfully",
//       product,
//     });
//   } catch (err) {
//     await client.query("ROLLBACK");
//     console.error("createProduct error:", err);

//     if (err.code === "23505") {
//       return res.status(400).json({ message: "Duplicate entry" });
//     }

//     res.status(500).json({ message: err.message });
//   } finally {
//     client.release();
//   }
// };
exports.createProduct = async (req, res) => {
  const client = await pool.connect();

  try {
    // SAFE JSON PARSER
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

    const {
      name,
      sku,
      slug,
      organizationId,
      price,
      mrp,
      minOrderQty,
      moq,
      stock,
      unit,
      weight,
      dispatchTimeDays,
      description,
      isActive,
      status,
      gst,
      isFeatured,
      isTopProduct,
      parentProductId,
      category,
    } = req.body;

    // PARSE FORM-DATA ARRAYS
    const categories = safeParse(
      req.body.categories
    );

    const specifications = safeParse(
      req.body.specifications
    );

    const pricingTiers = safeParse(
      req.body.pricingTiers
    );

    // VALIDATION
    if (!String(name || "").trim()) {
      return res.status(400).json({
        message: "name is required",
      });
    }

    // ORGANIZATION
    const resolvedOrganizationId =
      organizationId ??
      req.user?.organization_id ??
      req.user?.organizationId;

    if (!resolvedOrganizationId) {
      return res.status(400).json({
        message: "organizationId is required",
      });
    }

    // SLUG
    const resolvedSlug =
      String(slug || "").trim() ||
      slugify(name);

    // MOQ
    const resolvedMoq =
      minOrderQty ?? moq;

    // ACTIVE STATUS
    const resolvedIsActive =
      typeof isActive === "boolean"
        ? isActive
        : !String(status || "").trim()
        ? true
        : String(status)
            .trim()
            .toLowerCase() === "active";

    // CLOUDINARY FILES
    const uploadedMedia = (
      req.files || []
    ).map((file, index) => ({
      image_url: file.path,
      media_type:
        file.mimetype.startsWith("video")
          ? "video"
          : "image",
      public_id: file.filename,
      sort_order: index,
      is_primary: index === 0,
    }));

    // SPECIFICATIONS
    const mergedSpecifications =
      Array.isArray(specifications)
        ? [...specifications]
        : [];

    // ADD SKU SPEC
    const hasSku =
      mergedSpecifications.some(
        (s) =>
          s.key?.toLowerCase() === "sku"
      );

    if (
      !hasSku &&
      String(sku || "").trim()
    ) {
      mergedSpecifications.push({
        key: "sku",
        value: String(sku).trim(),
      });
    }

    // ADD GST SPEC
    const hasGst =
      mergedSpecifications.some(
        (s) =>
          s.key?.toLowerCase() === "gst"
      );

    if (
      !hasGst &&
      gst !== undefined &&
      gst !== null &&
      String(gst).trim() !== ""
    ) {
      mergedSpecifications.push({
        key: "gst",
        value: String(gst).trim(),
      });
    }

    await client.query("BEGIN");

    // CATEGORY IDS
    let resolvedCategoryIds =
      Array.isArray(categories)
        ? [...categories]
        : [];

    // CATEGORY FALLBACK
    if (
      resolvedCategoryIds.length === 0 &&
      typeof category === "string" &&
      category.trim()
    ) {
      const categoryName =
        category.trim();

      const categorySlug =
        slugify(categoryName);

      const categoryResult =
        await client.query(
          `SELECT id
           FROM categories
           WHERE name = $1
           OR slug = $2
           LIMIT 1`,
          [categoryName, categorySlug]
        );

      if (
        categoryResult.rows.length
      ) {
        resolvedCategoryIds = [
          categoryResult.rows[0].id,
        ];
      }
    }

    // PRIMARY IMAGE
    const primaryImage =
      uploadedMedia.find(
        (m) =>
          m.media_type === "image"
      )?.image_url || null;

    // INSERT PRODUCT
    const productResult =
      await client.query(
        `INSERT INTO products (
          name,
          slug,
          organization_id,
          price,
          mrp,
          moq,
          stock,
          unit,
          weight,
          dispatch_time_days,
          description,
          is_active,
          is_featured,
          is_top_product,
          parent_product_id,
          image_url,
          sku
        )
        VALUES (
          $1,$2,$3,$4,$5,
          $6,$7,$8,$9,$10,
          $11,$12,$13,$14,$15,
          $16,$17
        )
        RETURNING *`,
        [
          name,
          resolvedSlug,
          resolvedOrganizationId,
          price,
          mrp,
          resolvedMoq,
          stock,
          unit,
          weight,
          dispatchTimeDays,
          description,
          resolvedIsActive,
          isFeatured ?? false,
          isTopProduct ?? false,
          parentProductId || null,
          primaryImage,
          sku || null,
        ]
      );

    const product =
      productResult.rows[0];

    // PRODUCT CATEGORIES
    for (const categoryId of resolvedCategoryIds) {
      await client.query(
        `INSERT INTO product_categories (
          product_id,
          category_id
        )
        VALUES ($1, $2)`,
        [product.id, categoryId]
      );
    }

    // PRODUCT MEDIA
    for (const media of uploadedMedia) {
      await client.query(
        `INSERT INTO product_images (
          product_id,
          image_url,
          media_type,
          public_id,
          sort_order,
          is_primary
        )
        VALUES ($1,$2,$3,$4,$5,$6)`,
        [
          product.id,
          media.image_url,
          media.media_type,
          media.public_id,
          media.sort_order,
          media.is_primary,
        ]
      );
    }

    // SPECIFICATIONS
    for (const spec of mergedSpecifications) {
      await client.query(
        `INSERT INTO product_specifications (
          product_id,
          key,
          value
        )
        VALUES ($1,$2,$3)`,
        [
          product.id,
          spec.key,
          spec.value,
        ]
      );
    }

    // PRICING TIERS
    for (const tier of pricingTiers) {
      await client.query(
        `INSERT INTO product_pricing_tiers (
          product_id,
          min_quantity,
          price,
          label
        )
        VALUES ($1,$2,$3,$4)`,
        [
          product.id,
          tier.min_quantity,
          tier.price,
          tier.label,
        ]
      );
    }

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message:
        "Product created successfully",
      product,
      media: uploadedMedia,
    });

  } catch (err) {
    await client.query("ROLLBACK");

    console.error(
      "createProduct error:",
      err
    );

    if (err.code === "23505") {
      return res.status(400).json({
        message: "Duplicate entry",
      });
    }

    return res.status(500).json({
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

exports.getProducts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM products
       WHERE is_active = true
       ORDER BY created_at DESC`
    );

    res.json({
      products: result.rows,
    });
  } catch (err) {
    console.error("getProducts error:", err);
    res.status(500).json({ message: err.message });
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