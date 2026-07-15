"use client";

import { useMemo, useState } from "react";
import {
  Wallet,
  Building2,
  Smartphone,
  CheckCircle2,
  Loader2,
  AlertCircle,
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
  availableBalance = 0,
  payoutAccounts = [],
  vendorId,
  token,
  onConfirm,
  onSuccess,
}) => {
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedAccount = useMemo(() => {
    return payoutAccounts.find((item) => item.id === selectedMethod);
  }, [payoutAccounts, selectedMethod]);

  const platformFee = useMemo(() => {
    return Math.round(Number(amount || 0) * 0.02);
  }, [amount]);

  const receiveAmount = useMemo(() => {
    return Number(amount || 0) - platformFee;
  }, [amount, platformFee]);

  const isInvalid =
    !amount ||
    Number(amount) < 5000 ||
    Number(amount) > Number(availableBalance) ||
    !selectedAccount ||
    loading;

  const getIcon = (type) => {
    if (type === "bank") return <Building2 size={18} />;
    if (type === "upi") return <Smartphone size={18} />;
    return <Wallet size={18} />;
  };

  const resetForm = () => {
    setAmount("");
    setSelectedMethod("");
    setNote("");
    setError("");
  };

  const handleConfirm = async () => {
    if (isInvalid) return;

    try {
      setLoading(true);
      setError("");

      const payload = {
        vendor_id: vendorId,
        payout_amount: Number(amount),
        platform_fee: platformFee,
        receive_amount: receiveAmount,
        payout_method: selectedAccount?.type,
        payout_account_id: selectedAccount?.id,
        remarks: note,
        status: "PENDING",
      };

      if (onConfirm) {
        await onConfirm(payload);
      } else {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/withdraw-requests`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(payload),
          }
        );

        const data = await res.json();

        if (!res.ok || data?.success === false) {
          throw new Error(data?.message || "Withdrawal request failed");
        }

        onSuccess?.(data);
      }

      setOpen(false);
      resetForm();
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[80vw]! max-w-[80vw]! h-[90vh] p-0 overflow-hidden rounded-2xl bg-white shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b bg-[#F8FAFC]">
          <DialogTitle className="text-xl font-bold text-[#0F172A]">
            Withdraw Funds
          </DialogTitle>

          <p className="text-[#64748B] text-sm mt-1">
            Available Balance:{" "}
            <span className="font-bold text-[#0F172A]">
              Rs. {Number(availableBalance || 0).toLocaleString("en-IN")}
            </span>
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 px-6 py-5 h-[calc(90vh-77px)] overflow-y-auto">
          <div className="lg:col-span-8 space-y-5">
            <div>
              <label className="text-sm font-semibold text-[#334155]">
                Withdrawal Amount
              </label>

              <div className="mt-3 flex items-center border border-[#DCE3EE] rounded-xl px-4 py-3 bg-white focus-within:border-[#1E293B]">
                <span className="text-lg font-bold text-[#94A3B8] mr-3">
                  Rs.
                </span>

                <input
                  type="number"
                  value={amount}
                  min={5000}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full text-2xl font-bold text-[#0F172A] outline-none bg-transparent placeholder:text-[#CBD5E1]"
                />
              </div>

              {amount && Number(amount) < 5000 && (
                <p className="text-red-500 text-xs mt-2">
                  Minimum withdrawal amount is Rs. 5,000
                </p>
              )}

              {Number(amount) > Number(availableBalance) && (
                <p className="text-red-500 text-xs mt-2">
                  Amount cannot exceed available balance
                </p>
              )}

              <div className="flex flex-wrap gap-2 mt-3">
                {QUICK_AMOUNTS.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setAmount(item)}
                    disabled={item > Number(availableBalance)}
                    className={`px-4 py-2 rounded-lg border font-bold text-sm disabled:opacity-40 transition ${
                      Number(amount) === item
                        ? "bg-[#1E293B] text-white border-[#1E293B]"
                        : "bg-[#F8FAFC] text-[#64748B] border-[#DCE3EE] hover:border-[#1E293B]"
                    }`}
                  >
                    {item >= 1000 ? `${item / 1000}K` : item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#334155] mb-3">
                Withdraw To
              </h3>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
                {payoutAccounts.length === 0 ? (
                  <div className="col-span-full border border-dashed border-[#CBD5E1] rounded-xl p-5 text-center bg-[#F8FAFC]">
                    <p className="text-sm font-semibold text-[#334155]">
                      No payout account found
                    </p>
                    <p className="text-xs text-[#94A3B8] mt-1">
                      Please add your bank, UPI, or Razorpay payout account first.
                    </p>
                  </div>
                ) : (
                  payoutAccounts.map((method) => (
                    <button
                      type="button"
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full flex items-start justify-between rounded-xl border p-4 transition ${
                        selectedMethod === method.id
                          ? "border-[#1E293B] bg-[#F8FAFC] shadow-sm"
                          : "border-[#DCE3EE] bg-white hover:border-[#94A3B8]"
                      }`}
                    >
                      <div className="flex items-start gap-3 text-left">
                        <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-slate-100 text-slate-700">
                          {getIcon(method.type)}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-[#334155] leading-5">
                              {method.title || method.account_name || "Payout Account"}
                            </h4>

                            {method.is_default && (
                              <span className="bg-[#1E293B] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                DEFAULT
                              </span>
                            )}
                          </div>

                          <p className="text-[#94A3B8] text-xs mt-1 leading-5">
                            {method.sub ||
                              method.upi_id ||
                              method.account_number ||
                              method.razorpay_contact_id ||
                              "Account details"}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center ml-2 ${
                          selectedMethod === method.id
                            ? "border-[#1E293B]"
                            : "border-[#CBD5E1]"
                        }`}
                      >
                        {selectedMethod === method.id && (
                          <div className="h-2 w-2 bg-[#1E293B] rounded-full" />
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-[#334155]">
                Note Optional
              </label>

              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g., Monthly withdrawal..."
                className="mt-3 w-full border border-[#DCE3EE] rounded-xl px-4 py-3 text-sm outline-none placeholder:text-[#CBD5E1] focus:border-[#1E293B]"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm font-semibold">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-5">
              <h3 className="text-lg font-bold text-[#0F172A] mb-5">
                Withdrawal Summary
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between gap-4 text-sm text-[#64748B]">
                  <span>Withdraw Amount</span>
                  <span className="font-bold text-[#334155]">
                    Rs. {Number(amount || 0).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm text-[#64748B]">
                  <span>Platform Fee 2%</span>
                  <span className="font-bold text-red-500">
                    -Rs. {platformFee.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="border-t pt-4 flex justify-between gap-4 items-center">
                  <span className="text-sm font-bold text-[#334155]">
                    You Receive
                  </span>
                  <span className="text-xl font-bold text-green-600">
                    Rs. {receiveAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-white border border-[#E2E8F0] p-4">
                <p className="text-xs text-[#64748B] leading-5">
                  Withdrawal request will be sent to admin. After admin approval,
                  payout can be processed through RazorpayX or manual transfer.
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isInvalid}
                  className="w-full px-5 py-3 bg-[#1E293B] disabled:opacity-50 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#0F172A]"
                >
                  {loading ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={17} />
                      Confirm Withdrawal
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                  className="w-full px-5 py-3 font-bold text-sm text-[#64748B] rounded-xl hover:bg-white disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawFundsPopup;