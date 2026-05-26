"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVendorme,
  fetchBusinessDetails,
  saveBusinessDetails,
} from "@/store/slices/vendorSlice";

export default function BusinessPage() {
  const dispatch = useDispatch();

  const business = useSelector((state) => state.vendor.business);
  const loading = useSelector((state) => state.vendor.loading);

  const [form, setForm] = useState({
    legalName: "",
    displayName: "",
    gstin: "",
    pan: "",
    businessType: "",
    year: "",
    website: "",
    address: "",
    city: "",
    state: "",
    pin: "",
  });

  const [saved, setSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchVendorme());
    dispatch(fetchBusinessDetails());
  }, [dispatch]);

  useEffect(() => {
    if (!business) return;

    setForm({
      legalName: business.registered_name || "",
      displayName: business.business_name || "",
      gstin: business.gstin || "",
      pan: business.pan || "",
      businessType: business.business_type || "",
      year: business.established_year || "",
      website: business.website || "",
      address: business.address || "",
      city: business.city || "",
      state: business.state || "",
      pin: business.pincode || "",
    });
  }, [business]);

  const handleChange = (e) => {
    if (!isEditing) return;

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setSaved(false);
  };

  const handleSave = async () => {
    if (!isEditing) return;

    if (!form.displayName || !form.businessType || !form.pan || !form.address) {
      alert("Please fill required business fields");
      return;
    }

    try {
      await dispatch(
        saveBusinessDetails({
          business_name: form.displayName,
          business_type: form.businessType,
          registered_name: form.legalName,
          pan: form.pan,
          gstin: form.gstin,
          registration_number: "",
          address: form.address,
          pincode: form.pin,
          city: form.city,
          state: form.state,
        })
      ).unwrap();

      await dispatch(fetchBusinessDetails());

      setSaved(true);
      setIsEditing(false);
    } catch (err) {
      console.error("Business save failed:", err);
      alert(err?.message || "Failed to save business details");
    }
  };

  return (
    <div className="min-h-screen rounded-sm bg-white p-3 md:p-6">
      <div className="relative mx-auto max-w-6xl rounded-sm border border-[#E5E5E5] bg-white p-4 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 border-b border-[#E5E5E5] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0B1F3A] md:text-xl">
              Business Information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Your registered business details for invoicing and compliance
            </p>
          </div>

          {!isEditing ? (
            <button
              type="button"
              onClick={() => {
                setIsEditing(true);
                setSaved(false);
              }}
              className="h-10 rounded-sm bg-[#0B1F3A] px-5 text-sm font-semibold text-white hover:opacity-95"
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setSaved(false);
                  if (business) {
                    setForm({
                      legalName: business.registered_name || "",
                      displayName: business.business_name || "",
                      gstin: business.gstin || "",
                      pan: business.pan || "",
                      businessType: business.business_type || "",
                      year: business.established_year || "",
                      website: business.website || "",
                      address: business.address || "",
                      city: business.city || "",
                      state: business.state || "",
                      pin: business.pincode || "",
                    });
                  }
                }}
                className="h-10 rounded-sm border border-[#E5E5E5] bg-white px-5 text-sm font-semibold text-[#0B1F3A] hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="h-10 rounded-sm bg-[#D4AF37] px-5 text-sm font-semibold text-[#0B1F3A] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        <div className="my-6 flex flex-col gap-3 rounded-sm border border-green-200 bg-green-50 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600">
              ✔
            </div>
            <div>
              <p className="font-semibold text-green-700">KYC Status</p>
              <p className="text-sm text-green-600">
                Your business details are stored from vendor onboarding.
              </p>
            </div>
          </div>

          <span className="w-fit rounded-sm bg-green-600 px-3 py-1 text-xs font-semibold text-white">
            VERIFIED
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Business Legal Name
            </label>
            <input
              name="legalName"
              value={form.legalName}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-2 h-11 w-full rounded-sm border border-[#E5E5E5] px-3 text-sm outline-none focus:border-[#0B1F3A] disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Display Name on Store
            </label>
            <input
              name="displayName"
              value={form.displayName}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-2 h-11 w-full rounded-sm border border-[#E5E5E5] px-3 text-sm outline-none focus:border-[#0B1F3A] disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">GSTIN</label>
            <input
              name="gstin"
              value={form.gstin}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-2 h-11 w-full rounded-sm border border-[#E5E5E5] px-3 text-sm outline-none focus:border-[#0B1F3A] disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              PAN Number
            </label>
            <input
              name="pan"
              value={form.pan}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-2 h-11 w-full rounded-sm border border-[#E5E5E5] px-3 text-sm outline-none focus:border-[#0B1F3A] disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Business Type
            </label>
            <select
              name="businessType"
              value={form.businessType}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-2 h-11 w-full rounded-sm border border-[#E5E5E5] bg-white px-3 text-sm outline-none focus:border-[#0B1F3A] disabled:bg-gray-100"
            >
              <option value="">Select business type</option>
              <option value="manufacturer">Manufacturer</option>
              <option value="wholesaler">Wholesaler</option>
              <option value="distributor">Distributor</option>
              <option value="retailer">Retailer</option>
              <option value="Private Limited">Private Limited</option>
              <option value="Partnership">Partnership</option>
              <option value="Sole Proprietor">Sole Proprietor</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Established Year
            </label>
            <input
              name="year"
              value={form.year}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-2 h-11 w-full rounded-sm border border-[#E5E5E5] px-3 text-sm outline-none focus:border-[#0B1F3A] disabled:bg-gray-100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">
              Website Optional
            </label>
            <input
              name="website"
              value={form.website}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-2 h-11 w-full rounded-sm border border-[#E5E5E5] px-3 text-sm outline-none focus:border-[#0B1F3A] disabled:bg-gray-100"
            />
          </div>
        </div>

        <div className="mt-6 border-t border-[#E5E5E5] pt-5">
          <h3 className="mb-4 font-bold text-[#0B1F3A]">
            Registered Address
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Street Address
              </label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                disabled={!isEditing}
                className="mt-2 h-11 w-full rounded-sm border border-[#E5E5E5] px-3 text-sm outline-none focus:border-[#0B1F3A] disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">City</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                disabled={!isEditing}
                className="mt-2 h-11 w-full rounded-sm border border-[#E5E5E5] px-3 text-sm outline-none focus:border-[#0B1F3A] disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">State</label>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                disabled={!isEditing}
                className="mt-2 h-11 w-full rounded-sm border border-[#E5E5E5] px-3 text-sm outline-none focus:border-[#0B1F3A] disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                PIN Code
              </label>
              <input
                name="pin"
                value={form.pin}
                onChange={handleChange}
                disabled={!isEditing}
                className="mt-2 h-11 w-full rounded-sm border border-[#E5E5E5] px-3 text-sm outline-none focus:border-[#0B1F3A] disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        {saved && (
          <p className="mt-4 rounded-sm border border-green-200 bg-green-50 p-3 text-right text-sm font-medium text-green-700">
            Business details saved successfully.
          </p>
        )}
      </div>
    </div>
  );
}