import Link from "next/link";
import { products } from "@/data/products";

export default function TrendingProducts() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        <div className="flex justify-between">
          <h2 className="text-xl font-semibold border-l-4 border-orange-500 pl-2">
            Trending Products
          </h2>
          <Link href="/trendingviewall" className="text-orange-500 text-sm cursor-pointer hover:underline">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((item) => (
            <Link
              key={item.id}
              href={`/products/${item.id}`}
              className="bg-white rounded-xl shadow hover:shadow-xl transition group overflow-hidden"
            >
              <div className="h-56 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition"
                />
              </div>

              <div className="p-3">
                <h3 className="text-sm font-semibold">{item.title}</h3>

                <p className="text-orange-600 font-semibold">
                  {item.price}
                </p>

                <p className="text-xs text-gray-500">{item.min}</p>

                <div className="flex items-center text-xs gap-1 mt-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>{item.brand}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}