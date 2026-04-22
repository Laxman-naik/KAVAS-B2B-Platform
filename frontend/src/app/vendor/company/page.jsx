"use client";

import { useState } from "react";
import { Camera, CheckCircle, Clock, Upload } from "lucide-react";

export default function CompanyProfileBody() {
  const initialData = {
    companyName: "Sharma Industries Pvt. Ltd.",
    businessType: "Manufacturer",
    gst: "27AABCS1429B1ZB",
    pan: "AABCS1429B",
    description: "Sharma Industries is a leading manufacturer...",
    contact: "Rajesh Sharma",
    phone: "+91 98765 43210",
    email: "rajesh@sharmaind.com",
    address: "Plot No. 42, MIDC Industrial Area",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400093",
  };

  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setFormData(initialData);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/company/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed");

      alert("Profile updated successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Error updating profile ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen bg-[#FFF8EC] text-[#1A1A1A]">

      {/* HEADER */}
      {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">
            Company Profile
          </h1>
          <p className="text-sm opacity-70">
            Manage your vendor identity and compliance documents
          </p>
        </div>

        <input
          placeholder="Search products, orders..."
          className="w-full md:w-80 px-4 py-2 rounded-full bg-white border border-[#E5E5E5] outline-none focus:ring-2 focus:ring-[#D4AF37]"
        />
      </div> */}

      {/* MAIN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT CARD */}
        <div className="bg-white rounded-xl p-6 border border-[#E5E5E5] hover:shadow-md transition">
          <div className="flex flex-col items-center text-center">

            <div
              className="relative"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <div className="w-28 h-28 bg-[#FFF8EC] rounded-xl flex items-center justify-center border-2 border-dashed border-[#E5E5E5]">
                Logo
              </div>

              <button
                className={`absolute bottom-0 right-0 bg-[#D4AF37] text-white p-2 rounded-full transition ${
                  hover ? "scale-110" : ""
                }`}
              >
                <Camera size={16} />
              </button>
            </div>

            <h2 className="mt-4 font-semibold text-lg">
              {formData.companyName}
            </h2>

            <div className="flex gap-2 mt-2">
              <span className="bg-green-100 text-green-600 px-3 py-1 text-xs rounded-full">
                GST Verified
              </span>
              <span className="bg-[#FFF8EC] text-[#0B1F3A] px-3 py-1 text-xs rounded-full">
                {formData.businessType}
              </span>
            </div>

            {/* STATS */}
            <div className="flex justify-between w-full mt-6">
              <Stat value="284" label="Products" />
              <Stat value="1,240" label="Orders" />
              <Stat value="2021" label="Member Since" />
            </div>

            <button className="mt-6 w-full bg-[#D4AF37] text-white py-2 rounded-lg hover:brightness-110 transition">
              Edit Profile
            </button>

            <div className="w-full mt-6 space-y-2 text-sm">
              <Status text="GST Certificate" type="success" />
              <Status text="Business License" type="success" />
              <Status text="PAN Card" type="pending" />
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-[#E5E5E5]">

          <h2 className="font-semibold mb-4 text-[#0B1F3A]">
            Business Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} full />
            <Input label="Business Type" name="businessType" value={formData.businessType} onChange={handleChange} />
            <Input label="GST Number" name="gst" value={formData.gst} onChange={handleChange} />
            <Input label="PAN Number" name="pan" value={formData.pan} onChange={handleChange} />
          </div>

          <div className="mt-4">
            <label className="text-sm opacity-70">Business Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full mt-1 border border-[#E5E5E5] rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          <h2 className="font-semibold mt-6 mb-2 text-[#0B1F3A]">
            Contact Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Contact Person" name="contact" value={formData.contact} onChange={handleChange} />
            <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
          </div>

          <Input label="Email" name="email" value={formData.email} onChange={handleChange} full />

          <h2 className="font-semibold mt-6 mb-2 text-[#0B1F3A]">
            Address
          </h2>

          <Input label="Street Address" name="address" value={formData.address} onChange={handleChange} full />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="City" name="city" value={formData.city} onChange={handleChange} />
            <Input label="State" name="state" value={formData.state} onChange={handleChange} />
            <Input label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} />
          </div>

          {/* UPLOAD */}
          <h2 className="font-semibold mt-6 mb-2 text-[#0B1F3A]">
            Document Uploads
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UploadCard title="GST Certificate" />
            <UploadCard title="Business License" />
            <UploadCard title="Company Logo" />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-[#E5E5E5] rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:brightness-110 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Input({ label, name, value, onChange, full }) {
  return (
    <div className={full ? "col-span-full" : ""}>
      <label className="text-sm opacity-70">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full mt-1 border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D4AF37]"
      />
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="text-center flex-1">
      <p className="font-semibold">{value}</p>
      <p className="text-xs opacity-60">{label}</p>
    </div>
  );
}

function Status({ text, type }) {
  return (
    <div className="flex justify-between">
      <span>{text}</span>
      {type === "success" ? (
        <span className="flex items-center text-green-600 gap-1">
          <CheckCircle size={14} /> Verified
        </span>
      ) : (
        <span className="flex items-center text-[#D4AF37] gap-1">
          <Clock size={14} /> Pending
        </span>
      )}
    </div>
  );
}

function UploadCard({ title }) {
  return (
    <div className="border-2 border-dashed border-[#E5E5E5] rounded-xl p-4 text-center hover:border-[#D4AF37] transition">
      <Upload className="mx-auto text-gray-400" />
      <p className="text-sm mt-2">{title}</p>
      <p className="text-xs text-gray-400">PDF, JPG, PNG</p>
      <button className="mt-2 text-[#D4AF37] text-sm hover:underline">
        Upload File
      </button>
    </div>
  );
}