"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const [results, setResults] = useState({
    products: [],
    suppliers: [],
    categories: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const uniqueProducts = useMemo(() => {
    return results.products.filter(
      (product, index, self) =>
        index === self.findIndex((p) => p.id === product.id)
    );
  }, [results.products]);

  const uniqueCategories = useMemo(() => {
    return results.categories.filter(
      (category, index, self) =>
        index === self.findIndex((c) => c.id === category.id)
    );
  }, [results.categories]);

  useEffect(() => {
    if (!q.trim()) {
      setResults({
        products: [],
        suppliers: [],
        categories: [],
      });
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError("");

        const url = `/api/search?q=${encodeURIComponent(searchText)}&limit=20`;

        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Search failed");
        }

        setResults({
          products: data.products || [],
          suppliers: data.suppliers || [],
          categories: data.categories || [],
        });
      } catch (err) {
        console.error("Search error:", err);
        setError(err.message || "Something went wrong while loading results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [q]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">
        Search results for: "{q}"
      </h1>

      {loading && <p>Loading results...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Products</h2>

            {uniqueProducts.length > 0 ? (
              <div className="grid gap-4">
                {uniqueProducts.map((product, index) => (
                  <Link
                    key={`${product.id}-${index}`}
                    href={`/products/${product.id}`}
                    className="border rounded-lg p-4 hover:shadow-md transition"
                  >
                    <h3 className="font-medium text-lg">{product.name}</h3>

                    <p className="text-sm text-gray-600 mt-1">
                      {product.description}
                    </p>

                    {product.organization_name && (
                      <p className="text-xs text-gray-500 mt-2">
                        Supplier: {product.organization_name}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <p>No products found.</p>
            )}
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>

            {uniqueCategories.length > 0 ? (
              <div className="grid gap-4">
                {uniqueCategories.map((category, index) => (
                  <Link
                    key={`${category.id}-${index}`}
                    href={`/search?q=${encodeURIComponent(category.name)}`}
                    className="border rounded-lg p-4 hover:shadow-md transition"
                  >
                    <h3 className="font-medium text-lg">{category.name}</h3>
                  </Link>
                ))}
              </div>
            ) : (
              <p>No categories found.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}