import Link from "next/link";

const newProducts = [
  {
    id: "1",
    title: "Laptop Cooling Pad USB Wholesale",
    price: "₹420/unit",
    min: "Min. 30 units",
    company: "GadgetHub Pvt.",
    brand: "GadgetHub",
    tag: "New",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
  },
  {
    id: "2",
    title: "Over-Ear Headphones Noise Cancel",
    price: "₹1,100/unit",
    min: "Min. 20 units",
    company: "SoundWave India",
    brand: "SoundWave",
    tag: "New",
    image: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd",
  },
  {
    id: "3",
    title: "Denim Jeans Regular Fit Bulk",
    price: "₹320/unit",
    min: "Min. 50 units",
    company: "DenimKing India",
    brand: "DenimKing",
    tag: "New",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d",
  },
  {
    id: "4",
    title: "Woolen Muffler Winter Wholesale",
    price: "₹72/unit",
    min: "Min. 200 units",
    company: "WoolCraft Surat",
    brand: "WoolCraft",
    tag: "New",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
  },
  {
    id: "5",
    title: "Adjustable Wrench Set Professional",
    price: "₹380/unit",
    min: "Min. 30 units",
    company: "ToolMaster India",
    brand: "ToolMaster",
    tag: "New",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837",
  },
  {
    id: "6",
    title: "Antibacterial Soap Bar 144pcs",
    price: "₹22/unit",
    min: "Min. 144 units",
    company: "CleanCare",
    brand: "CleanCare",
    tag: "New",
    image: "https://images.unsplash.com/photo-1585238342028-4b2cfcab8d6d",
  },
  {
    id: "7",
    title: "IPA Solvent 99.9% Industrial 25L",
    price: "₹3,100/unit",
    min: "Min. 5 units",
    company: "ChemTech",
    brand: "ChemTech",
    tag: "New",
    image: "https://images.unsplash.com/photo-1581091215367-59ab6b5b6f6d",
  },
  {
    id: "8",
    title: "Corrugated Box 12×10×8 Wholesale",
    price: "₹21/unit",
    min: "Min. 500 units",
    company: "PackPro",
    brand: "PackPro",
    tag: "New",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
  },
  {
    id: "9",
    title: "Fresh Onions Farm Bulk",
    price: "₹44/unit",
    min: "Min. 500 units",
    company: "AgroFresh",
    brand: "AgroFresh",
    tag: "New",
    image: "https://images.unsplash.com/photo-1582515073490-dc0a3a1f3e02",
  },
  {
    id: "10",
    title: "Industrial Pump Centrifugal 2HP",
    price: "₹9,800/unit",
    min: "Min. 2 units",
    company: "PumpTech",
    brand: "PumpTech",
    tag: "New",
    image: "https://images.unsplash.com/photo-1616627988364-0d5d6f6e0f64",
  },
];

export default function NewArrivals() {
  return (
    <div className="bg-gray-50">
      <div className="p-6 min-h-screen max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">
              NEW
            </span>
            <h2 className="text-xl font-semibold">New Arrivals</h2>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">

          {newProducts.map((item) => (
            <Link key={item.id} href={`/newproducts/${item.id}`}>

              <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 cursor-pointer group overflow-hidden transform hover:-translate-y-2 h-80 flex flex-col">

                {/* IMAGE */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.image}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />

                  <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    New
                  </span>
                </div>

                {/* CONTENT */}
                <div className="p-3 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-sm font-medium line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-orange-600 font-semibold mt-1">
                      {item.price}
                    </p>

                    <p className="text-xs text-gray-500">{item.min}</p>
                  </div>

                  <div className="flex items-center mt-2 text-xs text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    {item.brand}
                  </div>
                </div>

              </div>

            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}