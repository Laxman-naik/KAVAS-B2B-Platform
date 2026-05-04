"use client";
import { useState } from "react";

export default function BusinessPage() {
  const [form, setForm] = useState({
    legalName: "Sharma Traders Pvt Ltd",
    displayName: "Sharma Traders",
    gstin: "07AABCS1234A1Z5",
    pan: "AABCS1234A",
    businessType: "Private Limited",
    year: "2018",
    website: "www.sharmatraders.in",
    address: "Plot 42, Industrial Area Phase II",
    city: "Delhi",
    state: "Delhi",
    pin: "110020",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = () => {
    if (!form.legalName || !form.gstin) {
      alert("Please fill required fields");
      return;
    }

    console.log("Saved Business Data:", form);
    setSaved(true);
  };

  return (
    <div className=" rounded-sm min-h-screen p-3 md:p-6">
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm max-w-6xl mx-auto">

        <h2 className="text-lg md:text-xl font-semibold text-gray-800">
          Business Information
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Your registered business details for invoicing and compliance
        </p>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-6 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full text-green-600">
              ✔
            </div>
            <div>
              <p className="font-medium text-green-700">KYC Verified</p>
              <p className="text-sm text-green-600">
                Your business documents have been verified. You can list unlimited products.
              </p>
            </div>
          </div>

          <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full w-fit">
            VERIFIED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="text-sm text-gray-600">Business Legal Name</label>
            <input name="legalName" value={form.legalName} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E2A38]" />
          </div>

          <div>
            <label className="text-sm text-gray-600">Display Name on Store</label>
            <input name="displayName" value={form.displayName} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E2A38]" />
          </div>

          <div>
            <label className="text-sm text-gray-600">GSTIN</label>
            <input name="gstin" value={form.gstin} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E2A38]" />
            <p className="text-xs text-gray-400 mt-1">
              15-character GST Identification Number
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-600">PAN Number</label>
            <input name="pan" value={form.pan} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E2A38]" />
          </div>

          <div>
            <label className="text-sm text-gray-600">Business Type</label>
            <select name="businessType" value={form.businessType} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E2A38]">
              <option>Private Limited</option>
              <option>Partnership</option>
              <option>Sole Proprietor</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Established Year</label>
            <input name="year" value={form.year} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E2A38]" />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Website (Optional)</label>
            <input name="website" value={form.website} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E2A38]" />
          </div>
        </div>
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold text-gray-800 mb-3">Registered Address</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Street Address</label>
              <input name="address" value={form.address} onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E2A38]" />
            </div>

            <div>
              <label className="text-sm text-gray-600">City</label>
              <input name="city" value={form.city} onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E2A38]" />
            </div>

            <div>
              <label className="text-sm text-gray-600">State</label>
              <select name="state" value={form.state} onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E2A38]">
                <option>Delhi</option>
                <option>Maharashtra</option>
                <option>Karnataka</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">PIN Code</label>
              <input name="pin" value={form.pin} onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#1E2A38]" />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            className="bg-[#1E2A38] text-white px-5 py-2 rounded-lg hover:bg-[#2d3b4f] transition-all duration-300 hover:scale-105"
          >
            Save Changes
          </button>
        </div>

        {saved && (
          <p className="text-green-600 text-sm mt-3 text-right">
            Changes saved successfully!
          </p>
        )}
      </div>
    </div>
  );
}