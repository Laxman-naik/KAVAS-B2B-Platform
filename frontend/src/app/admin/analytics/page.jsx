import React from "react";
import { motion } from "framer-motion";

const stats = [
  { title: "GMV THIS MONTH", value: "₹1.24Cr", growth: "+22%" },
  { title: "AVG ORDER VALUE", value: "₹18,430", growth: "+5%" },
  { title: "REPEAT BUYERS", value: "68.2%", growth: "+3.1%" },
  { title: "PLATFORM COMMISSION", value: "₹14.7L", growth: "+11%" },
];

const categories = [
  { name: "Textiles", value: 72, color: "bg-orange-500" },
  { name: "Apparel", value: 58, color: "bg-purple-500" },
  { name: "Electronics", value: 41, color: "bg-blue-500" },
  { name: "FMCG", value: 33, color: "bg-green-500" },
  { name: "Hardware", value: 18, color: "bg-red-500" },
];

const states = [
  { name: "Maharashtra", value: 65, color: "bg-orange-500" },
  { name: "Gujarat", value: 54, color: "bg-blue-500" },
  { name: "Karnataka", value: 43, color: "bg-green-500" },
  { name: "Tamil Nadu", value: 38, color: "bg-purple-500" },
  { name: "Delhi", value: 31, color: "bg-red-500" },
];

const vendors = [
  { name: "Rajesh Textiles", gmv: "₹28.4L", orders: 284, rating: 4.8 },
  { name: "Shree Garments", gmv: "₹21.1L", orders: 196, rating: 4.6 },
  { name: "Modi Fabrics", gmv: "₹18.7L", orders: 142, rating: 4.5 },
];

const buyers = [
  { name: "Aggarwal Stores", spend: "₹42.3L", orders: 84 },
  { name: "Global Goods", spend: "₹38.4L", orders: 76 },
  { name: "Bharat Traders", spend: "₹31.8L", orders: 67 },
];

const Card = ({ children }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="bg-white rounded-2xl shadow p-5 transition"
  >
    {children}
  </motion.div>
);

export default function Dashboard() {
  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, i) => (
          <Card key={i}>
            <p className="text-gray-500 text-sm">{item.title}</p>
            <h2 className="text-2xl font-bold mt-2">{item.value}</h2>
            <p className="text-green-500 text-sm mt-1">{item.growth}</p>
          </Card>
        ))}
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <Card>
          <h3 className="font-semibold mb-4">Top Categories by Revenue</h3>
          {categories.map((c, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>{c.name}</span>
                <span>{c.value}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.value}%` }}
                  transition={{ duration: 1 }}
                  className={`h-2 rounded-full ${c.color}`}
                />
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <h3 className="font-semibold mb-4">Top States by Orders</h3>
          {states.map((s, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>{s.name}</span>
                <span>{s.value}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${s.value}%` }}
                  transition={{ duration: 1 }}
                  className={`h-2 rounded-full ${s.color}`}
                />
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <Card>
          <h3 className="font-semibold mb-4">Vendor Performance</h3>
          <table className="w-full text-sm">
            <thead className="text-gray-500">
              <tr>
                <th className="text-left">Vendor</th>
                <th>GMV</th>
                <th>Orders</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="py-2">{v.name}</td>
                  <td>{v.gmv}</td>
                  <td>{v.orders}</td>
                  <td>⭐ {v.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4">Top Buyers</h3>
          <table className="w-full text-sm">
            <thead className="text-gray-500">
              <tr>
                <th className="text-left">Buyer</th>
                <th>Spend</th>
                <th>Orders</th>
              </tr>
            </thead>
            <tbody>
              {buyers.map((b, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="py-2">{b.name}</td>
                  <td>{b.spend}</td>
                  <td>{b.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}