const adminOrderService = require("../services/adminOrderService");

exports.getAllOrders = async (req, res) => {
  try {
    console.log("====== ADMIN ORDER API CALLED ======");

    const orders = await adminOrderService.getAllOrders();

    console.log("Orders from DB:", orders.length);
    console.log(orders);

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};