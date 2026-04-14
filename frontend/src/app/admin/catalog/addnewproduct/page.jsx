"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { productsData } from "@/app/(buyer)/product/productData";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const Page = () => {
  const router = useRouter();

  const [image, setImage] = useState(null);

  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    categoryId: "",
    subcategoryId: "",
    organizationId: "",
    price: "",
    mrp: "",
    minOrderQty: "",
    stock: "",
    unit: "",
    description: "",
    size: "",   // ✅ ADDED
    color: "",  // ✅ ADDED
  });

  const categories = Object.keys(productsData);

  const subcategories =
    form.categoryId && productsData[form.categoryId]
      ? [
          ...new Set(
            productsData[form.categoryId].map((p) => p.subcategory)
          ),
        ]
      : [];

  const handleSave = () => {
    if (!form.name) {
      alert("Product name is required");
      return;
    }

    const newProduct = {
      ...form,
      price: `₹${Number(form.price || 0).toLocaleString("en-IN")}`,
      status: "Listed",
      image,
      images,
      video,
    };

    const existing = JSON.parse(localStorage.getItem("products")) || [];
    const updated = [...existing, newProduct];

    localStorage.setItem("products", JSON.stringify(updated));

    router.push("/admin/catalog");
  };

  return (
    <div className="min-h-screen bg-[#0b1220] p-6 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800 space-y-4">
            <h2 className="text-xl font-semibold">Add Product</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
              className="border-orange-300"
                placeholder="Product Name"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
              className="border-orange-300"
                placeholder="Slug"
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
              <Input placeholder="Product ID" className="border-orange-300"/>
              <Input placeholder="Parent Product ID" className="border-orange-300"/>
            </div>

            <Textarea
            className="border-orange-300"
              placeholder="Product Description"
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* CATEGORY */}
          <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800 space-y-4">
            <h3 className="text-lg font-semibold">Category</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <Select
                onValueChange={(v) =>
                  setForm({ ...form, categoryId: v, subcategoryId: "" })
                }
              >
                <SelectTrigger className="w-full bg-[#0b1220] border border-orange-300">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>

                <SelectContent className="z-[9999] bg-[#111827] border border-gray-700 text-white">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                onValueChange={(v) =>
                  setForm({ ...form, subcategoryId: v })
                }
                disabled={!form.categoryId}
              >
                <SelectTrigger className="w-full bg-[#0b1220] border border-orange-300">
                  <SelectValue placeholder="Subcategory" />
                </SelectTrigger>

                <SelectContent className="z-[9999] bg-[#111827] border border-orange-300 text-white">
                  {subcategories.map((sub, index) => (
                    <SelectItem key={index} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                onValueChange={(v) =>
                  setForm({ ...form, organizationId: v })
                }
              >
                <SelectTrigger className="w-full bg-[#0b1220] border border-orange-300">
                  <SelectValue placeholder="Supplier" />
                </SelectTrigger>

                <SelectContent className="z-[9999] bg-[#111827] border border-gray-700 text-white">
                  <SelectItem value="Supplier A">Wireless Earbuds</SelectItem>
                  <SelectItem value="Supplier B">Bluetooth Speaker</SelectItem>
                  <SelectItem value="Supplier C">FabricWorld</SelectItem>
                  <SelectItem value="Supplier D">BoltCraft</SelectItem>
                </SelectContent>
              </Select>

            </div>
          </div>

          {/* PRICING */}
          <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800 space-y-4">
            <h3 className="text-lg font-semibold">Pricing</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input className="border-orange-300" type="number" placeholder="Price"
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              <Input className="border-orange-300" type="number" placeholder="MRP"
                onChange={(e) => setForm({ ...form, mrp: e.target.value })}
              />
              <Input className="border-orange-300" type="number" placeholder="Min Order Qty"
                onChange={(e) => setForm({ ...form, minOrderQty: e.target.value })}
              />
              <Input className="border-orange-300" type="number" placeholder="Stock"
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
          </div>

          {/* PRODUCT DETAILS (NEW) */}
          <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800 space-y-4">
            <h3 className="text-lg font-semibold">Product Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Select onValueChange={(v) => setForm({ ...form, size: v })}>
                <SelectTrigger className="w-full bg-[#0b1220] border border-orange-300">
                  <SelectValue placeholder="Product Size" />
                </SelectTrigger>

                <SelectContent className="z-[9999] bg-[#111827] border border-gray-700 text-white">
                  <SelectItem value="Small">Small</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Large">Large</SelectItem>
                  <SelectItem value="XL">XL</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(v) => setForm({ ...form, color: v })}>
                <SelectTrigger className="w-full bg-[#0b1220] border border-orange-300">
                  <SelectValue placeholder="Product Color" />
                </SelectTrigger>

                <SelectContent className="z-[9999] bg-[#111827] border border-gray-700 text-white">
                  <SelectItem value="Black">Black</SelectItem>
                  <SelectItem value="White">White</SelectItem>
                  <SelectItem value="Black & White">Black & White</SelectItem>
                  <SelectItem value="Red">Red</SelectItem>
                  <SelectItem value="Blue">Blue</SelectItem>
                </SelectContent>
              </Select>

            </div>
          </div>

          {/* LOGISTICS */}
          <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800 space-y-4">
            <h3 className="text-lg font-semibold">Logistics</h3>

            <Select onValueChange={(v) => setForm({ ...form, unit: v })}>
              <SelectTrigger className="w-full bg-[#0b1220] border border-orange-300">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>

              <SelectContent className="z-[9999] bg-[#111827]">
                <SelectItem value="kg">Kg</SelectItem>
                <SelectItem value="pcs">Pieces</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSave} className="w-full bg-orange-500">
            Save Product
          </Button>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800 flex flex-col gap-6">

          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4">Upload Image</h3>

            <label className="w-full h-40 border-2 border-dashed border-orange-300 rounded-xl flex items-center justify-center cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={(e) =>
                  setImage(URL.createObjectURL(e.target.files[0]))
                }
              />
              {!image ? "Upload Image" : <img src={image} className="h-full" />}
            </label>
          </div>

          <div>
            <h3 className="mb-2">Upload 4 Images</h3>
            <input
              className="border-1 rounded-2xl pl-2 text-gray-400 border-orange-300"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files).slice(0, 4);
                setImages(files.map((f) => URL.createObjectURL(f)));
              }}
            />

            <div className="grid grid-cols-2 gap-2 mt-3">
              {images.map((img, i) => (
                <img key={i} src={img} className="h-24 object-cover rounded" />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 ">Upload Video</h3>
            <input
              className="border-1 rounded-2xl pl-2 text-gray-400 border-orange-300"
              type="file"
              accept="video/*"
              onChange={(e) =>
                setVideo(URL.createObjectURL(e.target.files[0]))
              }
            />

            {video && (
              <video controls className="mt-2 w-full rounded">
                <source src={video} />
              </video>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Page;