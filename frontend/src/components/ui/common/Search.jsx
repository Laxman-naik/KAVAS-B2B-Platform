"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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

                const res = await fetch(
                    `http://localhost:5002/api/search?q=${encodeURIComponent(q)}&limit=20`
                ); const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Search failed");
                }

                setResults({
                    products: data.products || [],
                    suppliers: data.suppliers || [],
                    categories: data.categories || [],
                });
            } catch (err) {
                console.error(err);
                setError("Something went wrong while loading results.");
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
                        {results.products.length > 0 ? (
                            <div className="grid gap-4">
                                {results.products.map((product) => (
                                    <Link
                                        key={product.id}
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
                        <h2 className="text-xl font-semibold mb-4">Suppliers</h2>
                        {results.suppliers.length > 0 ? (
                            <div className="grid gap-4">
                                {results.suppliers.map((supplier) => (
                                    <Link
                                        key={supplier.id}
                                        href={`/suppliers/${supplier.id}`}
                                        className="border rounded-lg p-4 hover:shadow-md transition"
                                    >
                                        <h3 className="font-medium text-lg">{supplier.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {supplier.industry || supplier.description}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p>No suppliers found.</p>
                        )}
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">Categories</h2>
                        {results.categories.length > 0 ? (
                            <div className="grid gap-4">
                                {results.categories.map((category) => (
                                    <Link
                                        key={category.id}
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