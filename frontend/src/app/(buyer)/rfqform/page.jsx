"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { createRFQ } from "@/store/slices/rfqSlice";
import {
  Box,
  Building2,
  Users,
  IndianRupee,
  Zap,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  UploadCloud,
  Send,
  Lock,
} from "lucide-react";

export default function RFQPage() {
  const dispatch = useDispatch();

  const buyerOrgId = "YOUR_REAL_BUYER_ORG_UUID";

  const [form, setForm] = useState({
    productName: "",
    quantity: "",
    unit: "",
    targetPrice: "",
    companyName: "",
    buyerName: "",
    email: "",
    phone: "",
    deliveryLocation: "",
    requirements: "",
    file: null,
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const benefits = [
    {
      icon: Users,
      title: "Connect with Verified Suppliers",
      desc: "Get quotes from trusted and verified manufacturers & suppliers.",
    },
    {
      icon: IndianRupee,
      title: "Compare & Save More",
      desc: "Compare multiple quotes and choose the best deal.",
    },
    {
      icon: Zap,
      title: "Faster Responses",
      desc: "Receive quick responses and quotations from interested suppliers.",
    },
    {
      icon: ShieldCheck,
      title: "Secure & Confidential",
      desc: "Your business information is kept safe and confidential.",
    },
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.productName.trim()) {
      newErrors.productName = "Product name is required";
    }

    if (!form.quantity || Number(form.quantity) <= 0) {
      newErrors.quantity = "Valid quantity is required";
    }

    if (!form.unit) {
      newErrors.unit = "Unit is required";
    }

    if (!form.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!form.buyerName.trim()) {
      newErrors.buyerName = "Buyer name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!form.deliveryLocation.trim()) {
      newErrors.deliveryLocation = "Delivery location is required";
    }

    if (form.targetPrice && Number(form.targetPrice) < 0) {
      newErrors.targetPrice = "Target price cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm({
      productName: "",
      quantity: "",
      unit: "",
      targetPrice: "",
      companyName: "",
      buyerName: "",
      email: "",
      phone: "",
      deliveryLocation: "",
      requirements: "",
      file: null,
    });

    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitted(true);

      const payload = {
        buyer_org_id: buyerOrgId,
        product_id: null,
        title: form.productName.trim(),
        description: `
Company Name: ${form.companyName}
Buyer Name: ${form.buyerName}
Email: ${form.email}
Phone: ${form.phone}
Delivery Location: ${form.deliveryLocation}
Unit: ${form.unit}
Requirements: ${form.requirements || "N/A"}
Attachment: ${form.file ? form.file.name : "No attachment"}
        `.trim(),
        quantity: Number(form.quantity),
        budget: form.targetPrice ? Number(form.targetPrice) : null,
      };

      const result = await dispatch(createRFQ(payload));

      if (createRFQ.fulfilled.match(result)) {
        alert("RFQ submitted successfully!");
        resetForm();
      } else {
        alert(result.payload || "Failed to submit RFQ");
      }
    } catch (error) {
      console.error("RFQ submit error:", error);
      alert("Something went wrong");
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8EC] p-3 sm:p-5 lg:p-6 text-[#1A1A1A]">
      <div className="relative overflow-hidden rounded-sm bg-[#0B1F3A] px-5 py-4 sm:px-8 lg:px-12 lg:py-5 shadow-xl">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#D4AF37]">
              B2B Marketplace
            </p>

            <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              Request For Quotation (RFQ)
            </h1>

            <p className="mt-4 max-w-2xl text-sm sm:text-base text-white/90">
              Submit your requirement and get competitive quotes from verified
              suppliers.
            </p>
          </div>

          <div className="hidden lg:flex items-center">
            <img
              src="/rfq.png"
              alt="RFQ Illustration"
              className="w-105 object-contain drop-shadow-2xl hover:scale-105 transition-all duration-500"
            />
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_420px]">
        <form
          onSubmit={handleSubmit}
          className="rounded-sm border border-[#E5E5E5] bg-white p-5 sm:p-7 shadow-lg transition-all duration-300 hover:shadow-2xl"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-[#0B1F3A] p-3 text-white">
              <Box size={26} />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F3A]">
                Product Requirement
              </h2>
              <p className="text-sm text-gray-500">
                Tell us what you are looking for
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <InputBox
              label="Product Name"
              name="productName"
              value={form.productName}
              onChange={handleChange}
              error={errors.productName}
              placeholder="Enter product name"
              required
            />

            <InputBox
              label="Quantity"
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              error={errors.quantity}
              placeholder="Enter quantity"
              required
            />

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Unit <span className="text-red-500">*</span>
              </label>

              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className={`w-full rounded-sm border px-3 py-2 outline-none transition-all duration-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 ${
                  errors.unit ? "border-red-400" : "border-[#E5E5E5]"
                }`}
              >
                <option value="">Select unit</option>
                <option value="Pieces">Pieces</option>
                <option value="Kg">Kg</option>
                <option value="Box">Box</option>
                <option value="Carton">Carton</option>
                <option value="Ton">Ton</option>
                <option value="Meter">Meter</option>
              </select>

              {errors.unit && (
                <p className="mt-1 text-xs text-red-500">{errors.unit}</p>
              )}
            </div>

            <InputBox
              label="Target Price (₹)"
              name="targetPrice"
              type="number"
              value={form.targetPrice}
              onChange={handleChange}
              error={errors.targetPrice}
              placeholder="Expected price"
            />
          </div>

          <hr className="my-7 border-[#E5E5E5]" />

          <div className="flex items-center gap-4">
            <div className="rounded-full bg-[#0B1F3A] p-3 text-white">
              <Building2 size={26} />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F3A]">
                Buyer Details
              </h2>
              <p className="text-sm text-gray-500">Your business information</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InputBox
              label="Company Name"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              error={errors.companyName}
              placeholder="Enter company name"
              required
            />

            <InputBox
              label="Buyer Name"
              name="buyerName"
              value={form.buyerName}
              onChange={handleChange}
              error={errors.buyerName}
              placeholder="Enter buyer name"
              required
            />

            <InputBox
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter email address"
              required
            />

            <InputBox
              label="Phone Number"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="mt-3">
            <InputBox
              label="Delivery Location"
              name="deliveryLocation"
              value={form.deliveryLocation}
              onChange={handleChange}
              error={errors.deliveryLocation}
              placeholder="Enter delivery location / city / state / country"
              required
            />
          </div>

          <div className="mt-3">
            <label className="mb-2 block text-sm font-semibold">
              Additional Requirements
            </label>

            <textarea
              name="requirements"
              value={form.requirements}
              onChange={handleChange}
              maxLength={500}
              rows={2}
              placeholder="Write product specifications, quality standards, delivery timeline or any other details..."
              className="w-full resize-none rounded-sm border border-[#E5E5E5] px-3 py-2 outline-none transition-all duration-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30"
            />

            <p className="mt-1 text-right text-xs text-gray-500">
              {form.requirements.length} / 500
            </p>
          </div>

          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <label className="flex cursor-pointer items-center gap-4 rounded-sm border border-dashed border-gray-400 p-5 transition-all duration-300 hover:scale-[1.02] hover:border-[#D4AF37] hover:bg-[#FFF8EC]">
              <UploadCloud size={42} className="text-[#0B1F3A]" />

              <div>
                <p className="font-semibold">
                  Upload Attachment{" "}
                  <span className="text-sm font-normal text-gray-500">
                    (Optional)
                  </span>
                </p>

                <p className="text-sm text-gray-500">PDF, JPG, PNG up to 5MB</p>

                <p className="text-sm font-semibold text-[#D4AF37]">
                  {form.file ? form.file.name : "Choose File"}
                </p>
              </div>

              <input
                type="file"
                name="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleChange}
                className="hidden"
              />
            </label>

            <div className="w-full lg:w-auto">
              <button
                type="submit"
                disabled={submitted}
                className="flex w-full items-center justify-center cursor-pointer gap-3 rounded-sm bg-[#0B1F3A] px-10 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#D4AF37] hover:text-[#0B1F3A] disabled:cursor-not-allowed disabled:opacity-70 lg:w-auto"
              >
                <Send size={18} />
                {submitted ? "Submitting..." : "Submit RFQ"}
              </button>

              <p className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
                <Lock size={13} /> Your information is secure with us.
              </p>
            </div>
          </div>
        </form>

        <aside className="space-y-3">
          <div className="rounded-sm border border-[#E5E5E5] bg-[#FFF8EC] p-4 shadow-lg">
            <h3 className="mb-6 text-2xl font-bold text-[#1A1A1A]">
              Why Submit RFQ?
            </h3>

            <div className="space-y-3">
              {benefits.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="group flex gap-4 border-b border-[#E5E5E5] pb-5 last:border-none last:pb-0"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#0B1F3A] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#D4AF37]">
                      <Icon size={18} />
                    </div>

                    <div>
                      <h4 className="font-bold text-[#1A1A1A]">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-sm text-gray-600">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-sm bg-[#0B1F3A] p-6 text-white shadow-lg transition-all duration-300">
            <h3 className="text-2xl font-bold text-[#D4AF37]">Need Help?</h3>

            <p className="mt-2 text-sm text-white/90">
              Our team is here to assist you.
            </p>

            <hr className="my-5 border-white/20" />

            <div className="space-y-3">
              <ContactItem icon={Phone} text="+91 98765 43210" />
              <ContactItem icon={Mail} text="support@kavas.com" />
              <ContactItem icon={MapPin} text="Hyderabad, Telangana, India" />
            </div>

            <button
              type="button"
              className="mt-7 w-full rounded-sm border border-[#D4AF37] bg-[#D4AF37] px-5 py-3 font-bold text-[#0B1F3A] transition-all duration-300 hover:scale-105 hover:bg-transparent hover:text-[#D4AF37]"
            >
              Contact Support
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function InputBox({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  required,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-sm border px-3 py-2 outline-none transition-all duration-300 hover:border-[#D4AF37] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 ${
          error ? "border-red-400" : "border-[#E5E5E5]"
        }`}
      />

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function ContactItem({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
        <Icon size={20} />
      </div>
      <p className="text-sm font-semibold">{text}</p>
    </div>
  );
}