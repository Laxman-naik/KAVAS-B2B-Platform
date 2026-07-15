const db = require("../config/db");

exports.getAnalytics = async (req, res) => {
  try {
    const stats = await db.query(`
      SELECT title, value, change_value, positive
      FROM analytics_stats
      ORDER BY id
    `);

    const revenue = await db.query(`
      SELECT name, value, percent
      FROM revenue_category
      ORDER BY id
    `);

    const buyers = await db.query(`
      SELECT company_name, orders, spend
      FROM top_buyers
      ORDER BY orders DESC
    `);

    res.status(200).json({
      stats: stats.rows,
      revenue: revenue.rows,
      buyers: buyers.rows,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};