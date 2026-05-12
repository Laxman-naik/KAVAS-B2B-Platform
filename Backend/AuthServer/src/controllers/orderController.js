const getOrderStats = async (req, res) => {
  try {
    res.status(200).json({
      totalOrders: 12,
      pendingOrders: 3,
      deliveredOrders: 9,
      totalSpent: 25450,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order stats",
    });
  }
};

const getRecentOrders = async (req, res) => {
  try {
    res.status(200).json([
      {
        id: "#KAVAS1234",
        date: "15 May 2024",
        amount: 2450,
        status: "Delivered",
      },
    ]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch recent orders",
    });
  }
};

module.exports = {
  getOrderStats,
  getRecentOrders,
};