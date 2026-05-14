"use client";
import { useState } from "react";
import { Save } from "lucide-react";

export default function PayoutConfiguration() {
  const [autoPayout, setAutoPayout] = useState(true);
  const [frequency, setFrequency] = useState("Weekly (Every Tuesday)");
  const [threshold, setThreshold] = useState(50000);
  const [minPayout, setMinPayout] = useState(1000);
  const [method, setMethod] = useState("Bank Transfer (NEFT/IMPS)");
  const [reserve, setReserve] = useState(0);

  const handleSave = () => {
    alert("Configuration Saved!");
  };

  return (
    <div className="min-h-screen bg-white mt-4 rounded-sm p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-semibold">Payout Configuration</h1>
          <p className="text-gray-500 text-sm">
            Control how and when you receive your earnings
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md flex justify-between items-center hover:shadow-lg transition">
          <div>
            <h2 className="font-medium">Automatic Payouts</h2>
            <p className="text-sm text-gray-500">
              Funds are automatically transferred on schedule
            </p>
          </div>

          <button
            onClick={() => setAutoPayout(!autoPayout)}
            className={`w-14 h-7 flex items-center rounded-full p-1 transition ${
              autoPayout ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-5 h-5 rounded-full shadow-md transform transition ${
                autoPayout ? "translate-x-7" : ""
              }`}
            />
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h2 className="font-medium mb-4">Payout Schedule</h2>

          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <label className="text-sm">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400"
              >
                <option>Weekly (Every Tuesday)</option>
                <option>Monthly</option>
                <option>Daily</option>
              </select>
            </div>

            <div>
              <label className="text-sm">Minimum Threshold (Rs.)</label>
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400"
              />
              <p className="text-xs text-gray-400 mt-1">
                Payout triggers when balance exceeds this
              </p>
            </div>

            <div>
              <label className="text-sm">Minimum Payout (Rs.)</label>
              <input
                type="number"
                value={minPayout}
                onChange={(e) => setMinPayout(e.target.value)}
                className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-sm">Preferred Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400"
              >
                <option>Bank Transfer (NEFT/IMPS)</option>
                <option>UPI</option>
                <option>PayPal</option>
              </select>
            </div>

          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h2 className="font-medium mb-4">Reserve Balance</h2>

          <label className="text-sm">Hold Percentage ({reserve}%)</label>

          <input
            type="range"
            min="0"
            max="50"
            value={reserve}
            onChange={(e) => setReserve(e.target.value)}
            className="w-full mt-3 accent-blue-600 cursor-pointer"
          />

          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
          </div>

          <p className="text-xs text-gray-400 mt-2">
            {reserve === 0
              ? "No reserve balance will be held"
              : `${reserve}% will be held as reserve`}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h2 className="font-medium mb-4">Current Configuration</h2>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-gray-500">Auto Payout</span>
            <span className={autoPayout ? "text-green-600" : "text-red-500"}>
              {autoPayout ? "Enabled" : "Disabled"}
            </span>

            <span className="text-gray-500">Frequency</span>
            <span>{frequency}</span>

            <span className="text-gray-500">Threshold</span>
            <span>Rs. {threshold}</span>

            <span className="text-gray-500">Reserve Hold</span>
            <span>{reserve}%</span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition transform hover:scale-105"
          >
            <Save size={18} />
            Save Configuration
          </button>
        </div>

      </div>
    </div>
  );
}