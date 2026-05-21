"use client";

import React, { useState } from "react";
import { Plus, Info, Loader2, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CreateSupportTicket = ({ open, onOpenChange, onTicketCreate }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    priority: "medium",
    orderId: "",
    description: "",
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      subject: "",
      category: "",
      priority: "medium",
      orderId: "",
      description: "",
    });
    setSuccess(false);
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.subject || !formData.category || !formData.description) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);

    const newTicket = {
      id: `TKT-${Date.now()}`,
      subject: formData.subject,
      category: formData.category,
      priority: formData.priority,
      orderId: formData.orderId || "N/A",
      description: formData.description,
      status: "Open",
      replies: 0,
      createdAt: new Date().toLocaleString(),
    };

    setTimeout(() => {
      onTicketCreate?.(newTicket);
      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        handleClose();
      }, 900);
    }, 700);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && handleClose()}>
      <DialogContent className="w-[96vw] max-w-5xl rounded-sm border border-[#E5E7EB] bg-white p-0 shadow-2xl">
        <DialogHeader className="border-b border-[#E5E7EB] bg-[#0B1F3A] px-6 py-4">
          <DialogTitle className="text-xl font-bold text-white">
            Create Support Ticket
          </DialogTitle>
          <p className="mt-1 text-sm text-white/70">
            Submit your issue and our team will respond within 2 hours.
          </p>
        </DialogHeader>

        {success ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-6 py-8 text-center">
            <CheckCircle2 size={52} className="text-green-600" />
            <h3 className="mt-4 text-xl font-bold text-[#0B1F3A]">
              Ticket Created Successfully
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Your support request has been submitted.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-[#0B1F3A]">
                  Subject *
                </label>
                <Input
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  placeholder="Brief description of your issue"
                  className="h-10 rounded-sm border-[#E5E7EB] focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#0B1F3A]">
                  Category *
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleChange("category", value)}
                >
                  <SelectTrigger className="h-10 rounded-sm border-[#E5E7EB] focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-sm">
                    <SelectItem value="payment">Payment Issue</SelectItem>
                    <SelectItem value="orders">Orders</SelectItem>
                    <SelectItem value="refund">Returns & Refunds</SelectItem>
                    <SelectItem value="product">Product Listing</SelectItem>
                    <SelectItem value="account">Account Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#0B1F3A]">
                  Priority
                </label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleChange("priority", value)}
                >
                  <SelectTrigger className="h-10 rounded-sm border-[#E5E7EB] bg-[#F8FAFC] focus:ring-0 focus:ring-offset-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-sm">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#0B1F3A]">
                  Related Order ID{" "}
                  <span className="font-normal text-gray-400">(Optional)</span>
                </label>
                <Input
                  value={formData.orderId}
                  onChange={(e) => handleChange("orderId", e.target.value)}
                  placeholder="e.g., ORD-2847"
                  className="h-10 rounded-sm border-[#E5E7EB] focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#0B1F3A]">
                  Status
                </label>
                <Input
                  value="Open"
                  readOnly
                  className="h-10 rounded-sm border-[#E5E7EB] bg-[#F8FAFC] text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-[#0B1F3A]">
                  Description *
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Describe your issue in detail..."
                  maxLength={500}
                  className="min-h-24 resize-none rounded-sm border-[#E5E7EB] focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <p className="mt-1 text-right text-xs text-gray-400">
                  {formData.description.length}/500
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-3 rounded-sm border border-[#E5E7EB] bg-[#F8FAFC] p-3 text-sm text-[#475569]">
              <Info size={17} className="mt-0.5 shrink-0 text-[#0B1F3A]" />
              <p>
                Add order ID, error message, or issue details for faster support
                resolution.
              </p>
            </div>

            <div className="mt-5 flex justify-end gap-3 border-t border-[#E5E7EB] pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="h-10 rounded-sm border-[#E5E7EB]"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="h-10 rounded-sm bg-[#0B1F3A] px-6 font-semibold text-white hover:bg-[#132F55]"
              >
                {loading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Plus size={17} />
                    Submit Ticket
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateSupportTicket;