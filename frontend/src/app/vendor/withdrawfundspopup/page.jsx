"use client";

import { useMemo, useState } from "react";
import {
  X,
  Wallet,
  Building2,
  Smartphone,
  IndianRupee,
  CheckCircle2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const QUICK_AMOUNTS = [5000, 10000, 25000, 50000, 125000];

const WithdrawFundsPopup = ({
  open,
  setOpen,
  availableBalance = 124750,
  onConfirm,
}) => {
  const [amount, setAmount] = useState(5000);
  const [selectedMethod, setSelectedMethod] = useState("bank");
  const [note, setNote] = useState("");

  const platformFee = useMemo(() => {
    return Math.round(Number(amount || 0) * 0.02);
  }, [amount]);

  const receiveAmount = useMemo(() => {
    return Number(amount || 0) - platformFee;
  }, [amount, platformFee]);

  const isInvalid =
    !amount || Number(amount) < 5000 || Number(amount) > availableBalance;

  const handleConfirm = () => {
    if (isInvalid) return;

    onConfirm?.({
      payout_amount: Number(amount),
      platform_fee: platformFee,
      receive_amount: receiveAmount,
      payout_method: selectedMethod,
      remarks: note,
    });

    setOpen(false);
    setAmount(5000);
    setNote("");
  };

  const methods = [
    {
      id: "bank",
      title: "HDFC Bank - Current Account",
      sub: "A/C: 5012 3456 7890 · IFSC: HDFC0001234",
      icon: <Building2 size={22} />,
      tag: "DEFAULT",
    },
    {
      id: "upi",
      title: "UPI - Google Pay",
      sub: "rahul.sharma@okaxis",
      icon: <Smartphone size={22} />,
    },
    {
      id: "wallet",
      title: "Paytm Wallet",
      sub: "Linked: 98765 43210",
      icon: <Wallet size={22} />,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-5xl w-[95vw] p-0 overflow-hidden rounded-3xl bg-white">
        <DialogHeader className="px-8 py-4 border-b">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-3xl font-bold text-[#1E293B]">
                Withdraw Funds
              </DialogTitle>
              <p className="text-[#94A3B8] text-xl mt-2">
                Available: Rs. {availableBalance.toLocaleString("en-IN")}
              </p>
            </div>

            <button onClick={() => setOpen(false)}>
              <X className="text-[#94A3B8]" size={26} />
            </button>
          </div>
        </DialogHeader>

        <div className="px-8 py-7 max-h-[80vh] overflow-y-auto scrollbar-hide">
          <div>
            <label className="text-xl font-semibold text-[#334155]">
              Amount (Rs.)
            </label>

            <div className="mt-4 flex items-center border border-[#DCE3EE] rounded-2xl px-5 py-4">
              <span className="text-3xl font-bold text-[#94A3B8] mr-5">
                Rs.
              </span>

              <input
                type="number"
                value={amount}
                min={5000}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full text-4xl font-bold text-[#1E293B] outline-none"
              />
            </div>

            {Number(amount) < 5000 && (
              <p className="text-red-500 text-sm mt-2">
                Minimum withdrawal amount is Rs. 5,000
              </p>
            )}

            {Number(amount) > availableBalance && (
              <p className="text-red-500 text-sm mt-2">
                Amount cannot exceed available balance
              </p>
            )}

            <div className="flex flex-wrap gap-3 mt-4">
              {QUICK_AMOUNTS.map((item) => (
                <button
                  key={item}
                  onClick={() => setAmount(item)}
                  disabled={item > availableBalance}
                  className={`px-5 py-3 rounded-xl border font-bold text-lg disabled:opacity-40 ${
                    Number(amount) === item
                      ? "bg-[#1E293B] text-white border-[#1E293B]"
                      : "bg-[#F8FAFC] text-[#64748B] border-[#DCE3EE]"
                  }`}
                >
                  {item >= 1000 ? `${item / 1000}K` : item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-[#334155] mb-4">
              Withdraw To
            </h3>

            <div className="space-y-4">
              {methods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full flex items-center justify-between rounded-2xl border p-5 transition ${
                    selectedMethod === method.id
                      ? "border-[#1E293B] bg-[#F8FAFC]"
                      : "border-[#DCE3EE] bg-white"
                  }`}
                >
                  <div className="flex items-center gap-5 text-left">
                    <div
                      className={`h-14 w-14 rounded-xl flex items-center justify-center ${
                        method.id === "bank"
                          ? "bg-slate-100 text-slate-600"
                          : method.id === "upi"
                          ? "bg-green-50 text-green-600"
                          : "bg-sky-50 text-sky-600"
                      }`}
                    >
                      {method.icon}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xl font-bold text-[#334155]">
                          {method.title}
                        </h4>

                        {method.tag && (
                          <span className="bg-[#1E293B] text-white text-xs font-bold px-2 py-1 rounded-md">
                            {method.tag}
                          </span>
                        )}
                      </div>

                      <p className="text-[#94A3B8] text-lg mt-1">
                        {method.sub}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`h-8 w-8 rounded-full border-4 flex items-center justify-center ${
                      selectedMethod === method.id
                        ? "border-[#1E293B]"
                        : "border-[#CBD5E1]"
                    }`}
                  >
                    {selectedMethod === method.id && (
                      <div className="h-3 w-3 bg-[#1E293B] rounded-full" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 bg-[#F8FAFC] rounded-2xl p-6">
            <div className="flex justify-between text-lg text-[#64748B]">
              <span>Withdraw Amount</span>
              <span className="font-bold text-[#334155]">
                Rs. {Number(amount || 0).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between text-lg text-[#64748B] mt-4">
              <span>Platform Fee (2%)</span>
              <span>-Rs. {platformFee.toLocaleString("en-IN")}</span>
            </div>

            <div className="border-t mt-5 pt-5 flex justify-between">
              <span className="text-xl font-bold text-[#334155]">
                You Receive
              </span>
              <span className="text-3xl font-extrabold text-green-600">
                Rs. {receiveAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="mt-8">
            <label className="text-xl font-semibold text-[#334155]">
              Note (Optional)
            </label>

            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., Monthly withdrawal..."
              className="mt-4 w-full border border-[#DCE3EE] rounded-2xl px-5 py-4 text-lg outline-none placeholder:text-[#CBD5E1]"
            />
          </div>
        </div>

        <div className="px-8 py-6 border-t flex justify-end gap-4">
          <button
            onClick={() => setOpen(false)}
            className="px-8 py-4 font-bold text-[#64748B]"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={isInvalid}
            className="px-8 py-4 bg-[#1E293B] disabled:opacity-50 text-white rounded-2xl font-bold flex items-center gap-2"
          >
            <CheckCircle2 size={20} />
            Confirm Withdrawal
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawFundsPopup;