import React from "react";

const products = [
  {
    id: 1,
    title: "Wireless Earbuds TWS Pro Bulk",
    price: "₹580/unit",
    min: "Min. 50 units",
    company: "TechLink India",
    tag: "Trending",
    image: "data:image/jpeg;base64,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",
  },
  {
    id: 2,
    title: "Lithium Power Bank 20000mAh OEM",
    price: "₹750/unit",
    min: "Min. 25 units",
    company: "EnergyTech Co.",
    tag: "Hot Deal",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5",
  },
  {
    id: 3,
    title: "Cotton T-Shirts Round-Neck Wholesale",
    price: "₹110/unit",
    min: "Min. 100 units",
    company: "FabricWorld Co.",
    tag: "Trending",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
  },
  {
    id: 4,
    title: "Polo T-Shirts Corporate Bulk",
    price: "₹210/unit",
    min: "Min. 50 units",
    company: "PoloPlus India",
    tag: "Trending",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990",
  },
  {
    id: 5,
    title: "SS Bolt Set Stainless Steel Kit",
    price: "₹980/unit",
    min: "Min. 20 units",
    company: "BoltCraft Co.",
    tag: "Trending",
    image: "https://images.unsplash.com/photo-1581092335397-9583eb92d232",
  },
  {
    id: 6,
    title: "Hand Sanitizer 500ml Bulk Pack",
    price: "₹78/unit",
    min: "Min. 100 units",
    company: "HealthPlus",
    tag: "Trending",
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831",
  },
  {
    id: 7,
    title: "Office Chair Ergonomic Mesh",
    price: "₹3600/unit",
    min: "Min. 10 units",
    company: "ComfortSeats",
    tag: "Trending",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
  },
  {
    id: 8,
    title: "Body Lotion 300ml Wholesale",
    price: "₹95/unit",
    min: "Min. 200 units",
    company: "GlowCare",
    tag: "Trending",
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc",
  },
  {
    id: 9,
    title: "Hybrid Wheat Seeds Certified 50kg",
    price: "₹2700/unit",
    min: "Min. 5 units",
    company: "AgroFarm",
    tag: "Trending",
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9",
  },
  {
    id: 10,
    title: "Car Floor Mats Universal",
    price: "₹320/unit",
    min: "Min. 30 units",
    company: "AutoZone",
    tag: "Trending",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2",
  },
];

export default function TrendingProducts() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen px-35">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold border-l-4 border-orange-500 pl-2">
          Trending Products
        </h2>
        <span className="text-orange-500 text-sm cursor-pointer hover:underline">
          View all deals →
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {products.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 cursor-pointer group overflow-hidden transform hover:-translate-y-2 h-80 flex flex-col"
          >
            <div className="relative h-55 overflow-hidden">
              <img
                src={item.image}
                alt=""
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition"></div>
              <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                {item.tag}
              </span>
              {/* Hover Button */}
              {/* <button className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition shadow">
                View Details
              </button> */}
            </div>
            <div className="p-3 flex flex-col justify-between flex-1">
              <div>
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-orange-600 font-semibold mt-1">
                  {item.price}
                </p>
                <p className="text-xs text-gray-500">{item.min}</p>
              </div>
              <div className="flex items-center mt-2 text-xs text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                {item.company}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
