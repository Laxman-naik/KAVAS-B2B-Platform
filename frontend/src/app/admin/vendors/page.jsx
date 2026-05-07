"use client"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOnboardingVendorsThunk, updateVendorStatusThunk, } from "@/store/slices/authSlice";

const statusStyles = {
  in_review: "bg-blue-500/20 text-blue-400",
  kyc_pending: "bg-yellow-500/20 text-yellow-400",
  approved: "bg-green-500/20 text-green-400",
  rejected: "bg-red-500/20 text-red-400",
};

export default function VendorsTable() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const { onboardingVendors = [], loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    category: "",
    contact: "",
    email: "",
    country: "",
    phone: "",
    commission: "",
    kyc: "Yes",
    message: "",
  });

  const handleView = (vendor) => {
    setSelectedVendor(vendor);
    setShowEditModal(true);
  };

  useEffect(() => {
    dispatch(fetchOnboardingVendorsThunk());
  }, [dispatch]);

  console.log(onboardingVendors)

  const filtered = onboardingVendors.filter((v) =>
    v.business_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = () => {
    if (!form.name || !form.category) return;

    const newVendor = {
      name: form.name,
      category: form.category,
      rating: 0,
      orders: 0,
      revenue: "₹0",
      status: "Pending KYC",
    };

    console.log(newVendor);
    setShowModal(false);

    setForm({
      name: "",
      category: "",
      contact: "",
      email: "",
      country: "",
      phone: "",
      commission: "",
      kyc: "Yes",
      message: "",
    });
  };

  const handleStatusChange = async () => {
    if (!selectedVendor) return;

    let nextStatus = "";

    switch (selectedVendor.status) {
      case "in_review":
        nextStatus = "kyc_pending";
        break;

      case "kyc_pending":
        nextStatus = "approved";
        break;

      default:
        return;
    }

    try {
      await dispatch(
        updateVendorStatusThunk({
          onboarding_id: selectedVendor.onboarding_id,
          status: nextStatus,
        })
      ).unwrap();

      setSelectedVendor((prev) => ({
        ...prev,
        status: nextStatus,
      }));
      dispatch(fetchOnboardingVendorsThunk());
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", });
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-[#0b1220] text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Vendors</h1>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search vendors..."
            className="px-4 py-2 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition duration-200">
            Export
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition duration-200"
          >
            + Invite vendor
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-800">
        <table className="min-w-full text-sm">
          <thead className="bg-[#111827] text-gray-400">
            <tr>
              {[
                "Vendor",
                "Business Type",
                "Orders",
                "Revenue",
                "Status",
                "Actions"
              ].map((h) => (
                <th key={h} className="px-6 py-4 text-left font-medium ">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr
                key={v.onboarding_id}
                className="border-t border-gray-800 hover:bg-[#0d1424] bg-[#111827]"
              >
                <td className="px-6 py-4 font-medium">
                  {v.business_name}
                </td>

                <td className="px-6 py-4 text-gray-300">
                  {v.business_type}
                </td>

                <td className="px-6 py-4">
                  {v.orders || "-"}
                </td>

                <td className="px-6 py-4">
                  ₹{v.revenue || "0"}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${statusStyles[v.status] || "bg-gray-500/20 text-gray-400"
                      }`}
                  >
                    {v.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">

                  <button
                    onClick={() => handleView(v)}
                    className="px-3 py-1 text-xs rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                  >
                    View
                  </button>

                  <button
                    onClick={() => {
                      setSelectedVendor(v);
                      setShowEditModal(true);
                    }}
                    className="px-3 py-1 text-xs rounded bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditModal && selectedVendor && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl p-6 relative">
            <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl">✕</button>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{selectedVendor.business_name}</h2>
              <p className="text-sm text-gray-500">{selectedVendor.email} • {selectedVendor.phone}</p>
            </div>
            <Section title="Basic Info">
              <Info label="Status" value={selectedVendor.status?.replaceAll("_", " ")?.replace(/\b\w/g, (c) => c.toUpperCase())}/> 
              <Info label="City" value={selectedVendor.city} />
              <Info label="State" value={selectedVendor.state} />
              <Info label="Pincode" value={selectedVendor.pincode} />
              {/* <Info label="Created At" value={selectedVendor.created_at} /> */}
              <Info label="Submitted At" value={formatDate(selectedVendor.submitted_at)} />
            </Section>
            <Section title="Business Details">
              <Info label="Business Name" value={selectedVendor.business_name} />
              <Info label="Registered Name" value={selectedVendor.registered_name} />
              <Info label="Type" value={selectedVendor.business_type} />
              <Info label="Registration No" value={selectedVendor.registration_number} />
              <Info label="PAN" value={selectedVendor.pan} />
              <Info label="GST" value={selectedVendor.gstin} />
              <Info label="Address" value={selectedVendor.business_address} />
            </Section>
            <Section title="Contact">
              <Info label="Email" value={selectedVendor.email} />
              <Info label="Email Verified" value={String(selectedVendor.email_verified)} />
              <Info label="Phone" value={selectedVendor.phone} />
              <Info label="Phone Verified" value={String(selectedVendor.phone_verified)} />
            </Section>
            <Section title="Bank Details">
              <Info label="Account Holder" value={selectedVendor.account_holder_name} />
              <Info label="Account Number" value={selectedVendor.account_number} />
              <Info label="IFSC" value={selectedVendor.ifsc_code} />
              <Info label="Bank Verified" value={String(selectedVendor.bank_verified)} />
            </Section>
            <Section title="Store Details">
              <Info label="Tagline" value={selectedVendor.tagline} />
              <Info label="Description" value={selectedVendor.description} />
              <div className="flex gap-4 mt-3">
                {selectedVendor.store_image && (<img src={selectedVendor.store_image} className="w-40 h-24 object-cover rounded border" />)}
                {selectedVendor.store_logo && (<img src={selectedVendor.store_logo} className="w-20 h-20 object-contain border rounded" />)}
              </div>
            </Section>
            <Section title="Pickup Address">
              <Info label="Address" value={selectedVendor.pickup_address} />
              <Info label="City" value={selectedVendor.pickup_city} />
              <Info label="State" value={selectedVendor.pickup_state} />
              <Info label="Pincode" value={selectedVendor.pickup_pincode} />
            </Section>
            <Section title="System Flags">
              <Info label="Is Active" value={String(selectedVendor.is_active)} />
              <Info label="Is Store Address" value={String(selectedVendor.is_store_address)} />
              <Info label="Vendor ID" value={selectedVendor.vendor_id} />
              <Info label="Onboarding ID" value={selectedVendor.onboarding_id} />
              <Info label="Rejection Reason" value={selectedVendor.rejection_reason || "-"} />
            </Section>
            <div className="border-t pt-4 mt-6 space-y-3">
              <textarea className="w-full border rounded p-2 text-sm" placeholder="Rejection reason" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
              <div className="flex gap-3">

                <button
                  onClick={handleStatusChange}
                  disabled={selectedVendor.status === "approved"}
                  className={`px-4 py-2 rounded text-white ${selectedVendor.status === "approved"
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                    }`}
                >
                  {selectedVendor.status === "in_review"
                    ? "Move to KYC"
                    : selectedVendor.status === "kyc_pending"
                      ? "Approve Vendor"
                      : "Approved"}
                </button>

                <button
                  onClick={async () => {
                    try {
                      await dispatch(
                        updateVendorStatusThunk({
                          onboarding_id: selectedVendor.onboarding_id,
                          status: "rejected",
                          rejection_reason: rejectReason,
                        })
                      ).unwrap();

                      setSelectedVendor((prev) => ({
                        ...prev,
                        status: "rejected",
                        rejection_reason: rejectReason,
                      }));
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-2">
          <div className="w-full max-w-2xl bg-[#0F1E33] rounded-2xl p-6 text-white shadow-xl">

            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold">Invite vendor</h2>
                <p className="text-xs text-gray-400">
                  Send an onboarding invitation
                </p>
              </div>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

              <input
                placeholder="Business name"
                className="p-2 rounded bg-[#13263C]"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                placeholder="Category"
                className="p-2 rounded bg-[#13263C]"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />

              <input
                placeholder="Contact name"
                className="p-2 rounded bg-[#13263C]"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
              />

              <input
                placeholder="Email"
                className="p-2 rounded bg-[#13263C]"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <input
                placeholder="Country"
                className="p-2 rounded bg-[#13263C]"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              />

              <input
                placeholder="Phone"
                className="p-2 rounded bg-[#13263C]"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              <input
                placeholder="Commission %"
                className="p-2 rounded bg-[#13263C]"
                value={form.commission}
                onChange={(e) =>
                  setForm({ ...form, commission: e.target.value })
                }
              />

              <select
                className="p-2 rounded bg-[#13263C]"
                value={form.kyc}
                onChange={(e) => setForm({ ...form, kyc: e.target.value })}
              >
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>

            <textarea
              placeholder="Invitation message"
              className="w-full mt-3 p-2 rounded bg-[#13263C]"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-orange-500 rounded hover:bg-orange-600"
              >
                Send invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Info = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-gray-500 text-xs">{label}</span>
    <span className="font-medium text-gray-800 wrap-break-words">
      {value ?? "-"}
    </span>
  </div>
);

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="font-semibold text-gray-700 mb-3 border-b pb-1">
      {title}
    </h3>
    <div className="grid grid-cols-2 gap-4 text-sm">
      {children}
    </div>
  </div>
);
