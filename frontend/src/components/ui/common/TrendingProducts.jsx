import React from "react";

const products = [
  {
    id: 1,
    title: "Wireless Earbuds TWS Pro Bulk",
    price: "₹580/unit",
    min: "Min. 50 units",
    company: "TechLink India",
    tag: "Trending",
    image: "https://images.unsplash.com/photo-1585386959984-a41552231658",
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
    <div className="p-6 bg-gray-100 min-h-screen px-15">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold border-l-4 border-orange-500 pl-2">
          Trending Products
        </h2>
        <span className="text-orange-500 text-sm cursor-pointer hover:underline">
          View all deals →
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {products.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 cursor-pointer group overflow-hidden transform hover:-translate-y-2 h-80 flex flex-col"
          >
            {/* Image */}
            <div className="relative h-55 overflow-hidden">
              <img
                src={item.image}
                alt=""
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition"></div>

              {/* Tag */}
              <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                {item.tag}
              </span>

              {/* Hover Button */}
              {/* <button className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition shadow">
                View Details
              </button> */}
            </div>

            {/* Content */}
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