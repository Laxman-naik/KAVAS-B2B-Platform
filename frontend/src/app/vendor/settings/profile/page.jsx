"use client";
import { useState } from "react";

export default function ProfilePage() {
  const initialData = {
    firstName: "Rahul",
    lastName: "Sharma",
    email: "rahul@sharmatraders.com",
    phone: "+91 98765 43210",
    bio: "Wholesale supplier of organic food products, spices, and handicrafts based in Delhi. Serving B2B customers across India since 2018.",
    language: "English",
    timezone: "IST (India) — UTC+5:30",
  };

  const [form, setForm] = useState(initialData);
  const [saved, setSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  const handleChange = (e) => {
    if (!isEditing) return;
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = () => {
    if (!isEditing) return;

    if (!form.firstName || !form.email) {
      alert("Please fill required fields");
      return;
    }

    console.log("Saved Data:", form);
    setSaved(true);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setForm(initialData);
    setProfilePic(null);
    setIsEditing(false);
    setSaved(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setProfilePic(null);
  };

  return (
    <div className="min-h-screen p-3 md:p-6 animate-fadeIn">
      <div className="bg-white rounded-sm p-4 md:p-1   max-w-6xl mx-auto relative">

        {/* EDIT BUTTON */}
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 flex items-center gap-1 text-sm bg-[#1E2A38] text-white px-4 py-1.5 rounded-md hover:bg-[#2d3b4f] transition"
        >
          ✏️ Edit
        </button>

        <h2 className="text-lg md:text-xl font-semibold text-gray-800">
          Profile Information
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Manage your personal details and preferences
        </p>

        {/* PROFILE PHOTO */}
        <div className="bg-gray-100 rounded-xl p-4 flex items-center gap-4 mb-6 hover:shadow-md transition">

          <div className="relative w-16 h-16">
            {profilePic ? (
              <img
                src={profilePic}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#1E2A38] flex items-center justify-center text-white font-bold text-lg">
                RS
              </div>
            )}

            {isEditing && (
              <>
                <label className="absolute bottom-0 right-0 bg-[#1E2A38] text-white w-5 h-5 flex items-center justify-center rounded-full text-xs cursor-pointer hover:bg-[#2d3b4f]">
                  +
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>

                {profilePic && (
                  <button
                    onClick={removeImage}
                    className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                )}
              </>
            )}
          </div>

          <div>
            <p className="font-medium">Profile Photo</p>
            <p className="text-sm text-gray-500">JPG, PNG. Max 2MB</p>
          </div>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="text-sm text-gray-600">First Name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              disabled={!isEditing}
              className="input disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Last Name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              disabled={!isEditing}
              className="input disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Email Address</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="input disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Phone Number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className="input disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm text-gray-600">Bio / About</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
            disabled={!isEditing}
            className="input w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <div className="text-right text-xs text-gray-400">
            {form.bio.length}/300
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-6">

          {isEditing && (
            <button
              onClick={handleCancel}
              className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          )}

          <button
            onClick={handleSave}
            className={`px-5 py-2 rounded-lg transition-all duration-300 
            ${isEditing 
              ? "bg-[#1E2A38] text-white hover:bg-[#2d3b4f] hover:scale-105" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
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

      {/* Simple fade animation using CSS */}
      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 10px 12px;
          margin-top: 4px;
          outline: none;
          transition: all 0.3s ease;
        }

        .input:focus {
          border-color: #1e2a38;
          box-shadow: 0 0 0 2px rgba(30, 42, 56, 0.1);
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}