const pool = require("../config/db");

exports.getOrganizations = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        id,
        name,
        business_type
      FROM organizations
      ORDER BY name ASC
      `
    );

    return res.json({
      success: true,
      organizations: result.rows,
    });
  } catch (err) {
    console.error("getOrganizations error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getVendorOrganizations = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        o.id AS organization_id,
        o.name AS organization_name,
        o.business_type AS organization_type,

        vo.id AS onboarding_id,
        vo.status AS onboarding_status,

        vbd.business_name,
        vbd.business_type,
        vbd.registered_name,
        vbd.city,
        vbd.state,
        vbd.gst_verified
      FROM vendor_onboarding vo
      JOIN organizations o 
        ON o.id = vo.organization_id
      LEFT JOIN vendor_business_details vbd 
        ON vbd.onboarding_id = vo.id
      WHERE vo.organization_id IS NOT NULL
      ORDER BY COALESCE(vbd.business_name, o.name) ASC
      `
    );

    return res.json({
      success: true,
      vendors: result.rows,
    });
  } catch (err) {
    console.error("getVendorOrganizations error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};