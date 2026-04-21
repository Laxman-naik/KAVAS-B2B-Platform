"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {Shield, Lock, FileText, ShieldCheck,Scale} from "lucide-react";
import Link from "next/link";

const sections = [
    {
        id: "01",
        title: "Introduction",
        content:
           "These Terms and Conditions govern your use of the KAVAS Wholesale Hub website (https://kavaswholesalehub.com) and services. By accessing or using our platform, you agree to comply with these Terms." 
    },
    {
        id: "02",
        title: "Eligibility",
        content: [
            "Are at least 18 years old or represent a registered business entity",
            "Will use the platform only for lawful business purposes",
        ],
    },
    {
        id: "03",
        title: "Account Registration & Security",
        content: [
            "Users must provide accurate and complete information",
            "You are responsible for maintaining account confidentiality",
            "We reserve the right to suspend or terminate accounts in case of violations",
        ],
    },
    {
        id: "04",
        title: "Products & Orders",
        content: [
            "Product details and pricing are subject to change",
            "Minimum Order Quantity (MOQ) may apply",
            "Orders are confirmed only after payment verification",
        ],
    },
    {
        id: "05",
        title: "Payments & Billing",
        content: [
            "Accepted methods: UPI, Cards, Bank Transfer, B2B Credit",
            "Full payment required unless credit terms are approved",
            "Fraudulent transactions may lead to account suspension",
        ],
    },
    {
        id: "06",
        title: "Shipping & Delivery",
        content: [
            "Delivery timelines depend on logistics and supplier availability",
            "Tracking details will be provided after dispatch",
            "Delays may occur due to force majeure events",
        ],
    },
    {
        id: "07",
        title: "Returns, Refunds & Cancellations",
        content: [
            "Returns accepted only for damaged/incorrect products within 48 hours",
            "Refunds processed within 5–10 business days",
            "Orders cannot be canceled after shipment",
        ],
    },
    {
        id: "08",
        title: "Platform Role",
        content:
            "KAVAS Wholesale Hub acts as an intermediary platform connecting buyers and sellers. We do not manufacture products and are not responsible for product quality, warranties, or compliance.",
    },
    {
        id: "09",
        title: "User Conduct",
        content: [
            "Provide false information",
            "Engage in fraud or illegal activities",
            "Attempt to hack or misuse the platform",
        ],
    },
    {
        id: "10",
        title: "Limitation of Liability",
        content:
            "To the maximum extent permitted by law, KAVAS Wholesale Hub shall not be liable for any indirect, incidental, or consequential damages arising from platform usage.",
    },
    {
        id: "11",
        title: "Indemnification",
        content:
            "You agree to indemnify and hold KAVAS harmless from any claims, damages, or losses arising from your use of the platform.",
    },
    {
        id: "12",
        title: "Dispute Resolution",
        content:
            "Any disputes shall be resolved through arbitration in accordance with the Arbitration and Conciliation Act, 1996. The place of arbitration shall be Hyderabad, Telangana.",
    },
    {
        id: "13",
        title: "Governing Law & Jurisdiction",
        content:
            "These Terms are governed by the laws of India. Courts in Hyderabad, Telangana shall have exclusive jurisdiction.",
    },
    {
        id: "14",
        title: "Changes to Terms",
        content:
            "We reserve the right to update these Terms at any time. Continued use of the platform implies acceptance of updated terms.",
    },
    {
        id: "15",
        title: "Contact Us",
        content: [
            "Address: Manjeera Trinity Corporate, JNTU Road, Kukatpally, Hyderabad – 500072",
            "Email: info@kavaswholesalehub.com",
            "Phone: +91 6302259849",
        ],
    },
    {
        id: "16",
        title: "Acceptance",
        content:
            "By using KAVAS Wholesale Hub, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.",
    },
];

const page = () => {
    return (
        <div className="bg-[#FFF8EC] min-h-screen">

            {/* HEADER */}
            <div className="bg-[#0B1F3A] text-white p-7">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <p className="text-xs mb-1">
                            <Link href="/">
                                <span className="text-gray-400 hover:text-[#D4AF37]">Home</span>
                            </Link>
                            <span className="mx-1">{">>"}</span>
                            <span className="font-semibold">Terms & Conditions</span>
                        </p>

                        <h1 className="text-4xl font-bold">
                            Terms & <span className="text-[#D4AF37]">Conditions</span>
                        </h1>

                        <p className="mt-2 text-[#D4AF37]">
                            Clear Rules. Safe Business. Trusted Partnership.
                        </p>

                        <p className="mt-2 text-gray-500">
                            Please read our Terms & Conditions carefully. These terms govern your use of the
                            <br />KAVAS Wholesale Hub platform, website, and services.
                        </p>

                        <Badge className="mt-4 bg-[#0B1F3A] border border-white/20 px-4 rounded-2xl flex items-center py-2 gap-2 w-fit">
                            <ShieldCheck size={16} className="text-[#D4AF37]" />
                            Effective Date: 01 August 2025
                        </Badge>
                    </div>

                    <div className="hidden md:flex gap-4">
                        <Shield size={80} />
                        <Lock size={80} />
                        <FileText size={80} />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl bg-white mt-3 rounded-sm mx-auto border p-6 space-y-4">

                <div className="bg-[#F5EBD7] border border-[#E5D3A3] rounded-xl p-4 flex items-center gap-3">
                    <div className="bg-[#0B1F3A] text-white p-3 rounded-lg">
                        <ShieldCheck />
                    </div>
                    <p className="text-sm font-medium text-[#1A1A1A]">
                        By accessing or using KAVAS Wholesale Hub, you acknowledge that you have read,
                        understood, and agree to be bound by these Terms & Conditions.
                    </p>
                </div>
                <>
                    {sections.map((sec) => {

                        if (sec.id === "10" || sec.id === "11") return null;

                        return (
                            <div
                                key={sec.id}
                                className="border-b border-[#E5E5E5] pb-4 flex flex-col gap-3"
                            >
                                <div className="flex gap-4">
                                    <div className="bg-[#FFF3D6] text-[#D4AF37] font-bold w-10 h-10 flex items-center justify-center rounded-full">
                                        {sec.id}
                                    </div>

                                    <div className="w-full">
                                        <h3 className="font-semibold text-[#1A1A1A]">
                                            {sec.title}
                                        </h3>

                                        {Array.isArray(sec.content) ? (
                                            <ul className="mt-1 text-sm text-gray-700 space-y-1">
                                                {sec.content.map((item, i) => (
                                                    <li key={i}>• {item}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-700 mt-1">
                                                {sec.content}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {sec.id === "09" && (
                                    <div className="grid md:grid-cols-2 gap-4 mt-2">
                                        <div className="bg-[#F5EBD7] border border-[#E5D3A3] rounded-xl p-5 flex gap-4">
                                            <div className="text-[#D4AF37]">
                                                <Scale color="#D4AF37" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">
                                                    {sections.find(s => s.id === "10").title}
                                                </h3>
                                                <p className="text-sm text-gray-700 mt-1">
                                                    {sections.find(s => s.id === "10").content}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-[#F5EBD7] border border-[#E5D3A3] rounded-xl p-5 flex gap-4">
                                            <div className="text-[#D4AF37]">
                                                <ShieldCheck />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">
                                                    {sections.find(s => s.id === "11").title}
                                                </h3>
                                                <p className="text-sm text-gray-700 mt-1">
                                                    {sections.find(s => s.id === "11").content}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </>

                <div className="bg-[#0B1F3A] text-white mt-6 rounded-sm">
                    <div className="px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="border border-[#D4AF37] rounded-full p-3">
                                <Shield className="text-[#D4AF37]" size={28} />
                            </div>

                            <div>
                                <h3 className="text-[#D4AF37] font-semibold text-lg">
                                    Your Privacy is Our Priority
                                </h3>
                                <p className="text-sm text-gray-300">
                                    Shop with confidence – Your data is safe with us.
                                </p>
                            </div>
                        </div>

                        <Link href="/">
                            <Button className="bg-[#D4AF37] text-black hover:bg-yellow-500 px-6">
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default page;