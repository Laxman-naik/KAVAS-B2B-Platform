const pool = require("../config/db");

exports.createProduct = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      name,
      slug,
      organizationId,
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
      isTopProduct,
      parentProductId,

      // 🔥 new fields
      categories = [],        // [categoryId]
      images = [],            // [{ image_url }]
      specifications = [],    // [{ key, value }]
      pricingTiers = [],      // [{ min_quantity, price, label }]
    } = req.body;

    await client.query("BEGIN");

    // 1️⃣ Insert product
    const productResult = await client.query(
      `INSERT INTO products (
        name, slug, organization_id, price, mrp, moq, stock,
        unit, weight, dispatch_time_days, description,
        is_active, is_featured, is_top_product, parent_product_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING *`,
      [
        name,
        slug,
        organizationId,
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
        isTopProduct ?? false,
        parentProductId || null,
      ]
    );

    const product = productResult.rows[0];

    // 2️⃣ Insert categories
    for (const categoryId of categories) {
      await client.query(
        `INSERT INTO product_categories (product_id, category_id)
         VALUES ($1, $2)`,
        [product.id, categoryId]
      );
    }

    // 3️⃣ Insert images
    for (const img of images) {
      await client.query(
        `INSERT INTO product_images (product_id, image_url)
         VALUES ($1, $2)`,
        [product.id, img.image_url]
      );
    }

    // 4️⃣ Insert specifications
    for (const spec of specifications) {
      await client.query(
        `INSERT INTO product_specifications (product_id, key, value)
         VALUES ($1, $2, $3)`,
        [product.id, spec.key, spec.value]
      );
    }

    // 5️⃣ Insert pricing tiers
    for (const tier of pricingTiers) {
      await client.query(
        `INSERT INTO product_pricing_tiers (product_id, min_quantity, price, label)
         VALUES ($1, $2, $3, $4)`,
        [product.id, tier.min_quantity, tier.price, tier.label]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Product created successfully",
      product,
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);

    if (err.code === "23505") {
      return res.status(400).json({ message: "Duplicate entry" });
    }

    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, slug, subcategoryId, organizationId, isTopProduct, parentProductId, price,  mrp,
      minOrderQty, stock, unit, weight, dispatchTimeDays, description, imageUrl, isActive, isFeatured, } = req.body;

    const result = await pool.query(
      `UPDATE products SET  name=$1, slug=$2,, subcategory_id=$4, organization_id=$5, is_top_product=$6, parent_product_id=$7, price=$8,  mrp=$9,
        min_order_qty=$10, stock=$11, unit=$12, weight=$13, dispatch_time_days=$14, description=$15, image_url=$16, is_active=$17, is_featured=$18, updated_at=CURRENT_TIMESTAMP
      WHERE id=$19
      RETURNING *`,
      [name, slug, subcategoryId, organizationId, isTopProduct, parentProductId, price,
         mrp, minOrderQty, stock, unit, weight, dispatchTimeDays, description, imageUrl, isActive, isFeatured, id,]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE products SET is_active=false WHERE id=$1 RETURNING *`,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deactivated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT * FROM products
       WHERE is_active = true
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Get main product
    const productResult = await pool.query(
      `SELECT * FROM products 
       WHERE id = $1 AND is_active = true`,
      [id]
    );

    if (!productResult.rows.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = productResult.rows[0];

    // Get images
    const imagesResult = await pool.query(
      `SELECT image_url FROM product_images WHERE product_id = $1`,
      [id]
    );

    // Get specifications
    const specsResult = await pool.query(
      `SELECT key, value FROM product_specifications WHERE product_id = $1`,
      [id]
    );

    // Get pricing tiers
    const pricingResult = await pool.query(
      `SELECT min_quantity, price, label 
       FROM product_pricing_tiers 
       WHERE product_id = $1
       ORDER BY min_quantity ASC`,
      [id]
    );

    // Get categories
    const categoriesResult = await pool.query(
      `SELECT c.id, c.name 
       FROM product_categories pc
       JOIN categories c ON pc.category_id = c.id
       WHERE pc.product_id = $1`,
      [id]
    );

    // Final response
    res.json({
      ...product,
      images: imagesResult.rows,
      specifications: specsResult.rows,
      pricingTiers: pricingResult.rows,
      categories: categoriesResult.rows,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};