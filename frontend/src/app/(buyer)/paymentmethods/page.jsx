"use client";
 
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import ProfileSidebar from "@/components/buyer/ProfileSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { logoutUserThunk } from "../../../store/slices/authSlice";
import { fetchProfile } from "../../../store/slices/profileSlice";
import { fetchAddresses } from "../../../store/slices/addressSlice";
import {CreditCard, CheckCircle2, ShieldCheck, Clock3,Search,Plus,  MoreVertical,Trash2,Star,Inbox,ChevronLeft,ChevronRight, Lock,
} from "lucide-react";
 
const TABLE_HEADERS = ["Card", "Details", "Holder", "Status", "Expires", "Action"];
const PAGE_SIZE = 5;
 
const VisaLogo = () => (
  <svg viewBox="0 0 48 16" className="h-5 w-auto" aria-label="Visa">
    <text x="0" y="13" fontFamily="Arial, sans-serif" fontStyle="italic" fontWeight="800" fontSize="16" fill="#1A1F71">VISA</text>
  </svg>
);
const MastercardLogo = () => (
  <svg viewBox="0 0 40 24" className="h-6 w-auto" aria-label="Mastercard">
    <circle cx="15" cy="12" r="10" fill="#EB001B" />
    <circle cx="25" cy="12" r="10" fill="#F79E1B" fillOpacity="0.9" />
  </svg>
);
const RuPayLogo = () => (
  <svg viewBox="0 0 60 16" className="h-4 w-auto" aria-label="RuPay">
    <text x="0" y="13" fontFamily="Arial, sans-serif" fontStyle="italic" fontWeight="800" fontSize="15" fill="#0A2884">RuPay</text>
    <polygon points="52,3 58,8 52,13" fill="#F7941D" />
  </svg>
);
const UpiLogo = () => (
  <svg viewBox="0 0 44 16" className="h-4 w-auto" aria-label="UPI">
    <text x="0" y="13" fontFamily="Arial, sans-serif" fontStyle="italic" fontWeight="800" fontSize="15" fill="#4B4B4B">UPI</text>
    <polygon points="36,3 42,8 36,13" fill="#F7941D" />
  </svg>
);
const GenericCardLogo = () => (
  <CreditCard size={22} className="text-gray-400" />
);
 

const detectBrand = (digitsOnly) => {
  if (/^4/.test(digitsOnly)) return { key: "visa", label: "Visa Card", logo: <VisaLogo /> };
  if (/^5[1-5]/.test(digitsOnly)) return { key: "mastercard", label: "Mastercard", logo: <MastercardLogo /> };
  if (/^6/.test(digitsOnly)) return { key: "rupay", label: "RuPay Card", logo: <RuPayLogo /> };
  return { key: "card", label: "Card", logo: <GenericCardLogo /> };
};
 
const MOCK_METHODS = [
  {
    id: "visa",
    logo: <VisaLogo />,
    name: "Visa Card",
    detail: "**** **** **** 4242",
    holder: "Rahul Kumar",
    status: "default",
    expires: "12/28",
  },
  {
    id: "mastercard",
    logo: <MastercardLogo />,
    name: "Mastercard",
    detail: "**** **** **** 8888",
    holder: "Rahul Kumar",
    status: "active",
    expires: "09/27",
  },
  {
    id: "rupay",
    logo: <RuPayLogo />,
    name: "RuPay Card",
    detail: "**** **** **** 1234",
    holder: "Rahul Kumar",
    status: "active",
    expires: "05/26",
  },
  {
    id: "upi",
    logo: <UpiLogo />,
    name: "UPI ID",
    detail: "rahulkumar@okicici",
    holder: "Rahul Kumar",
    status: "verified",
    expires: null,
  },
];
 
const STATUS_STYLES = {
  default: "bg-green-100 text-green-700",
  verified: "bg-green-100 text-green-700",
  active: "bg-gray-100 text-gray-600",
};
 
const EMPTY_FORM = {
  paymentType: "card",
  cardNumber: "",
  cardHolder: "",
  expiry: "",
  cvv: "",
  upiId: "",
  setAsDefault: false,
};
 
const formatCardNumber = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
};

const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};
 
const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
 
  const authUser = useSelector((state) => state.auth.user);
  const { profile } = useSelector((state) => state.profile);
 
  const [methods, setMethods] = useState(MOCK_METHODS);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
 
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
 
 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
 
  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchAddresses());
  }, [dispatch]);
 
  const activeUser = profile || authUser || {};
  const fullName =
    activeUser?.full_name || activeUser?.fullName || activeUser?.name || "";
  const [firstName = "", ...rest] = String(fullName)
    .trim()
    .split(/\s+/)
    .filter(Boolean);
 
  const user = {
    firstName: activeUser?.firstName || firstName,
    lastName: activeUser?.lastName || rest.join(" "),
    email: activeUser?.email || "",
    phone: activeUser?.phone || "",
  };
 
  const handleLogout = async () => {
    await dispatch(logoutUserThunk());
    router.push("/login");
  };
 
 
  const filteredMethods = useMemo(() => {
    const value = search.toLowerCase();
 
    return methods.filter((item) => {
      return (
        item.name?.toLowerCase().includes(value) ||
        item.detail?.toLowerCase().includes(value) ||
        item.holder?.toLowerCase().includes(value)
      );
    });
  }, [methods, search]);
 
  const totalPages = Math.max(1, Math.ceil(filteredMethods.length / PAGE_SIZE));
 
  const paginatedMethods = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredMethods.slice(start, start + PAGE_SIZE);
  }, [filteredMethods, currentPage]);
 
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);
 
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);
 
  const stats = useMemo(() => {
    const total = methods.length;
    const defaultCount = methods.filter((m) => m.status === "default").length;
    const verified = methods.filter((m) => m.status === "verified").length;
    const expiringSoon = methods.filter((m) => {
      if (!m.expires) return false;
      const [month, year] = m.expires.split("/").map(Number);
      const expiryDate = new Date(2000 + year, month - 1);
      const monthsAway =
        (expiryDate.getFullYear() - new Date().getFullYear()) * 12 +
        (expiryDate.getMonth() - new Date().getMonth());
      return monthsAway <= 6 && monthsAway >= 0;
    }).length;
 
    return { total, defaultCount, verified, expiringSoon };
  }, [methods]);
 
  const STAT_CARDS = [
    { key: "total", label: "Total Methods", color: "blue", icon: CreditCard },
    { key: "defaultCount", label: "Default", color: "green", icon: CheckCircle2 },
    { key: "verified", label: "Verified", color: "indigo", icon: ShieldCheck },
    { key: "expiringSoon", label: "Expiring Soon", color: "yellow", icon: Clock3 },
  ];
 
 
  const openManageModal = (method) => {
    setSelectedMethod(method);
    setIsManageModalOpen(true);
  };
 
  const closeManageModal = () => {
    setIsManageModalOpen(false);
    setSelectedMethod(null);
  };
 
  const setDefaultMethod = (id) => {
    setMethods((prev) =>
      prev.map((m) => ({
        ...m,
        status: m.id === id ? "default" : m.status === "default" ? "active" : m.status,
      }))
    );
    closeManageModal();
  };
 
  const removeMethod = (id) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
    closeManageModal();
  };
 

  const openAddModal = () => {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setIsAddModalOpen(true);
  };
 
  const closeAddModal = () => {
    if (isSaving) return;
    setIsAddModalOpen(false);
    setForm(EMPTY_FORM);
    setFormErrors({});
  };
 
  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };
 
  const validateForm = () => {
    const errors = {};
 
    if (form.paymentType === "card") {
      const digits = form.cardNumber.replace(/\D/g, "");
 
      if (digits.length !== 16) {
        errors.cardNumber = "Enter a valid 16-digit card number.";
      }
      if (!form.cardHolder.trim()) {
        errors.cardHolder = "Cardholder name is required.";
      }
      if (!/^\d{2}\/\d{2}$/.test(form.expiry)) {
        errors.expiry = "Use MM/YY format.";
      } else {
        const [month, year] = form.expiry.split("/").map(Number);
        if (month < 1 || month > 12) {
          errors.expiry = "Enter a valid month.";
        }
      }
      if (!/^\d{3,4}$/.test(form.cvv)) {
        errors.cvv = "Enter a valid CVV.";
      }
    } else {
      if (!/^[\w.-]+@[\w.-]+$/.test(form.upiId.trim())) {
        errors.upiId = "Enter a valid UPI ID, e.g. name@bank.";
      }
    }
 
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
 
  const handleAddMethod = async (e) => {
    e.preventDefault();
 
    if (!validateForm()) return;
 
    setIsSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 600));
 
    if (form.paymentType === "card") {
      const digits = form.cardNumber.replace(/\D/g, "");
      const brand = detectBrand(digits);
 
      const newMethod = {
        id: `${brand.key}-${Date.now()}`,
        logo: brand.logo,
        name: brand.label,
        detail: `**** **** **** ${digits.slice(-4)}`,
        holder: form.cardHolder.trim(),
        status: form.setAsDefault ? "default" : "active",
        expires: form.expiry,
      };
 
      setMethods((prev) => {
        const updated = form.setAsDefault
          ? prev.map((m) => ({ ...m, status: m.status === "default" ? "active" : m.status }))
          : prev;
        return [newMethod, ...updated];
      });
    } else {
      const newMethod = {
        id: `upi-${Date.now()}`,
        logo: <UpiLogo />,
        name: "UPI ID",
        detail: form.upiId.trim(),
        holder: user.firstName ? `${user.firstName} ${user.lastName}`.trim() : "—",
        status: form.setAsDefault ? "default" : "verified",
        expires: null,
      };
 
      setMethods((prev) => {
        const updated = form.setAsDefault
          ? prev.map((m) => ({ ...m, status: m.status === "default" ? "active" : m.status }))
          : prev;
        return [newMethod, ...updated];
      });
    }
 
    setIsSaving(false);
    setIsAddModalOpen(false);
    setForm(EMPTY_FORM);
    setCurrentPage(1);
  };
 
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
 
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <div className="lg:sticky lg:top-24 self-start">
          <ProfileSidebar user={user} onLogout={handleLogout} />
        </div>
 
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#0B1F3A]">
                Payment Methods
              </h1>
              <p className="text-gray-500">
                Manage your saved cards and payment options.
              </p>
            </div>
 
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 rounded-sm bg-[#E8891C] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#d67c14] transition"
            >
              <Plus size={16} />
              Add New Card
            </button>
          </div>
 
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
            {STAT_CARDS.map(({ key, label, color, icon: Icon }) => (
              <Card key={key} className="border-0 shadow-sm rounded-sm">
                <CardContent className="p-5 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">{label}</p>
                    <h2 className={`text-3xl font-bold mt-1 text-${color}-600`}>
                      {stats[key]}
                    </h2>
                  </div>
 
                  <div
                    className={`w-14 h-14 rounded-sm bg-${color}-100 flex items-center justify-center`}
                  >
                    <Icon size={26} className={`text-${color}-600`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
 
          <Card className="rounded-sm border-0 shadow-sm">
            <CardContent className="p-4 border-b">
              <div className="relative max-w-sm">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by card, number or holder..."
                  className="pl-9 rounded-sm h-10 text-sm"
                />
              </div>
            </CardContent>
 
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full min-w-225">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {TABLE_HEADERS.map((head) => (
                      <th key={head} className="text-left p-4 font-semibold">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
 
                <tbody>
                  {paginatedMethods.length === 0 ? (
                    <tr>
                      <td
                        colSpan={TABLE_HEADERS.length}
                        className="text-center py-16 text-gray-500"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <Inbox size={42} />
                          <h2 className="text-xl font-semibold">
                            No Payment Methods Found
                          </h2>
                          <p>No cards match your search.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedMethods.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b hover:bg-orange-50 transition"
                      >
                        <td className="p-4">
                          <div className="w-14 h-10 rounded-sm border bg-white flex items-center justify-center">
                            {item.logo}
                          </div>
                        </td>
 
                        <td className="p-4">
                          <p className="font-medium text-[#0B1F3A]">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500 font-mono">
                            {item.detail}
                          </p>
                        </td>
 
                        <td className="p-4">{item.holder}</td>
 
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-sm text-xs capitalize ${
                              STATUS_STYLES[item.status] ||
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
 
                        <td className="p-4">{item.expires || "—"}</td>
 
                        <td className="p-4 text-center">
                          <button
                            onClick={() => openManageModal(item)}
                            className="inline-flex items-center gap-2 rounded-sm border border-[#E8891C] px-4 py-2 text-sm text-[#E8891C] hover:bg-[#E8891C] hover:text-white transition"
                          >
                            <MoreVertical size={16} />
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </CardContent>
 
            {filteredMethods.length > 0 && (
              <div className="flex justify-center items-center gap-2 py-5 border-t">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-sm border text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={16} />
                </button>
 
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-9 h-9 flex items-center justify-center rounded-sm text-sm font-medium border transition ${
                        page === currentPage
                          ? "bg-[#E8891C] border-[#E8891C] text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
 
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-sm border text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </Card>
 
          <Card className="rounded-sm border-0 shadow-sm">
            <CardContent className="p-5 flex items-start gap-3.5">
              <div className="w-14 h-14 shrink-0 rounded-sm bg-green-100 flex items-center justify-center">
                <ShieldCheck size={26} className="text-green-600" />
              </div>
 
              <div>
                <p className="font-semibold text-[#0B1F3A]">
                  Your payment information is secure
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  We use industry-standard encryption to protect your payment
                  details.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
 
      <Dialog open={isManageModalOpen} onOpenChange={(open) => !open && closeManageModal()}>
        <DialogContent className="rounded-sm max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#0B1F3A]">
              Manage {selectedMethod?.name}
            </DialogTitle>
            <DialogDescription>{selectedMethod?.detail}</DialogDescription>
          </DialogHeader>
 
          <div className="flex items-center gap-4 border rounded-sm p-3 bg-gray-50">
            <div className="w-16 h-12 rounded-sm border bg-white flex items-center justify-center">
              {selectedMethod?.logo}
            </div>
 
            <div className="flex-1">
              <h3 className="font-semibold text-[#0B1F3A]">
                {selectedMethod?.name}
              </h3>
              <p className="text-sm text-gray-500">{selectedMethod?.holder}</p>
            </div>
 
            {selectedMethod?.expires && (
              <div className="text-right">
                <p className="text-xs text-gray-500">Expires</p>
                <p className="font-bold text-[#0B1F3A]">
                  {selectedMethod.expires}
                </p>
              </div>
            )}
          </div>
 
          <div className="space-y-2 mt-2">
            {selectedMethod?.status !== "default" && (
              <button
                onClick={() => setDefaultMethod(selectedMethod?.id)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-sm border px-4 py-2.5 text-sm text-[#0B1F3A] hover:bg-gray-50 transition"
              >
                <Star size={16} />
                Set as default
              </button>
            )}
 
            <button
              onClick={() => removeMethod(selectedMethod?.id)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-sm border border-red-200 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
            >
              <Trash2 size={16} />
              Remove this method
            </button>
          </div>
        </DialogContent>
      </Dialog>
 
      <Dialog open={isAddModalOpen} onOpenChange={(open) => !open && closeAddModal()}>
        <DialogContent className="rounded-sm max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#0B1F3A]">
              Add New Payment Method
            </DialogTitle>
            <DialogDescription>
              Add a card or UPI ID to use for future orders.
            </DialogDescription>
          </DialogHeader>
 
          {/* Payment type toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-sm">
            <button
              type="button"
              onClick={() => updateField("paymentType", "card")}
              className={`py-2 rounded-sm text-sm font-medium transition ${
                form.paymentType === "card"
                  ? "bg-white text-[#0B1F3A] shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Card
            </button>
            <button
              type="button"
              onClick={() => updateField("paymentType", "upi")}
              className={`py-2 rounded-sm text-sm font-medium transition ${
                form.paymentType === "upi"
                  ? "bg-white text-[#0B1F3A] shadow-sm"
                  : "text-gray-500"
              }`}
            >
              UPI
            </button>
          </div>
 
          <form onSubmit={handleAddMethod} className="space-y-4 mt-2" noValidate>
            {form.paymentType === "card" ? (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    value={form.cardNumber}
                    onChange={(e) =>
                      updateField("cardNumber", formatCardNumber(e.target.value))
                    }
                    className="rounded-sm h-10"
                  />
                  {formErrors.cardNumber && (
                    <p className="text-xs text-red-600">{formErrors.cardNumber}</p>
                  )}
                </div>
 
                <div className="space-y-1.5">
                  <Label htmlFor="cardHolder">Cardholder Name</Label>
                  <Input
                    id="cardHolder"
                    placeholder="Rahul Kumar"
                    value={form.cardHolder}
                    onChange={(e) => updateField("cardHolder", e.target.value)}
                    className="rounded-sm h-10"
                  />
                  {formErrors.cardHolder && (
                    <p className="text-xs text-red-600">{formErrors.cardHolder}</p>
                  )}
                </div>
 
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                    <Input
                      id="expiry"
                      inputMode="numeric"
                      placeholder="12/28"
                      value={form.expiry}
                      onChange={(e) =>
                        updateField("expiry", formatExpiry(e.target.value))
                      }
                      className="rounded-sm h-10"
                    />
                    {formErrors.expiry && (
                      <p className="text-xs text-red-600">{formErrors.expiry}</p>
                    )}
                  </div>
 
                  <div className="space-y-1.5">
                    <Label htmlFor="cvv">CVV</Label>
                    <div className="relative">
                      <Input
                        id="cvv"
                        type="password"
                        inputMode="numeric"
                        placeholder="•••"
                        value={form.cvv}
                        onChange={(e) =>
                          updateField(
                            "cvv",
                            e.target.value.replace(/\D/g, "").slice(0, 4)
                          )
                        }
                        className="rounded-sm h-10 pr-9"
                      />
                      <Lock
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                    </div>
                    {formErrors.cvv && (
                      <p className="text-xs text-red-600">{formErrors.cvv}</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-1.5">
                <Label htmlFor="upiId">UPI ID</Label>
                <Input
                  id="upiId"
                  placeholder="yourname@okicici"
                  value={form.upiId}
                  onChange={(e) => updateField("upiId", e.target.value)}
                  className="rounded-sm h-10"
                />
                {formErrors.upiId && (
                  <p className="text-xs text-red-600">{formErrors.upiId}</p>
                )}
              </div>
            )}
 
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={form.setAsDefault}
                onChange={(e) => updateField("setAsDefault", e.target.checked)}
                className="rounded-sm border-gray-300"
              />
              Set as default payment method
            </label>
 
            <p className="flex items-center gap-1.5 text-xs text-gray-400">
              <ShieldCheck size={14} />
              Your details are encrypted and stored securely.
            </p>
 
            <DialogFooter className="gap-2 sm:gap-2">
              <button
                type="button"
                onClick={closeAddModal}
                disabled={isSaving}
                className="rounded-sm border px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
 
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#E8891C] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#d67c14] transition disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Payment Method"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
 
export default Page;