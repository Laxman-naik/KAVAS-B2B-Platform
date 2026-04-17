"use client";

import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Shield, Lock, FileText, ChevronRight, Phone, Mail, MapPin, Headset, ShieldCheck, BookOpenText
} from "lucide-react";
import Link from "next/link";

const sections = [
    {
        id: "01",
        title: "Introduction",
        content:
            "KAVAS Wholesale Hub values your privacy and is committed to protecting your personal and business information. This Privacy Policy explains how we collect, use, and protect your data.",
    },
    {
        id: "02",
        title: "Information We Collect",
        content: [
            "Name, email address, phone number",
            "Business details (company name, GST number)",
            "Billing and shipping addresses",
            "Payment information (processed securely via third-party gateways)",
            "Order and transaction history",
        ],
    },
    {
        id: "03",
        title: "How We Use Your Information",
        content: [
            "Process orders and payments",
            "Provide customer support",
            "Improve our services",
            "Prevent fraud and ensure security",
        ],
    },
    {
        id: "04",
        title: "Data Sharing",
        content: [
            "Logistics and delivery partners",
            "Payment processing providers",
            "Legal authorities when required by law",
        ],
    },
    {
        id: "05",
        title: "Data Security",
        content:
            "We implement appropriate security measures, including encryption and secure servers, to protect your data.",
    },
    {
        id: "06",
        title: "Cookies",
        content:
            "We use cookies to improve user experience, remember preferences, and analyze website traffic.",
    },
    {
        id: "07",
        title: "Your Rights",
        content: [
            "Access your personal data",
            "Request corrections or deletion",
            "Request a copy of your data",
        ],
    },
    {
        id: "08",
        title: "Third-Party Services",
        content:
            "Our platform may use third-party services such as payment gateways and analytics tools. These services have their own privacy policies.",
    },
    {
        id: "09",
        title: "Data Retention",
        content:
            "We retain your data only as long as necessary for business, legal, or security purposes.",
    },
    {
        id: "10",
        title: "Policy Updates",
        content:
            "We may update this Privacy Policy from time to time. Continued use of our platform implies acceptance of the updated policy.",
    },
];

const page = () => {

    const [active, setActive] = useState(null);
    const [hovered, setHovered] = useState(null);

    const current = hovered || active;

    return (
        <div className="bg-[#FFF8EC] min-h-screen">
            <div className="bg-[#0B1F3A] text-white p-7 ">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <p className="text-xs text-white mb-1">
                            <Link href="/">
                                <span className=" text-gray-500 hover:text-[#D4AF37]">Home</span>
                            </Link>
                            <span className="mx-1">{">>"}</span>
                            <span className="text-white font-semibold">Privacy Policy</span>
                        </p>

                        <h1 className="text-4xl font-bold">
                            Privacy <span className="text-[#D4AF37]">Policy</span>
                        </h1>

                        <p className="mt-2 font-medium text-[#D4AF37]">
                            Your Privacy Matters. We Protect It.
                        </p>

                        <p className="mt-2 text-gray-500">
                            This Privacy Policy explains how KAVAS Wholesale Hub collects, uses, and protects your information.
                        </p>

                        <Badge className="mt-4 bg-[#0B1F3A] text-white border border-white/20 px-4 rounded-2xl flex items-center py-3 gap-2 w-fit">
                            <ShieldCheck className="text-[#D4AF37]" size={16} />
                            Last Updated: 01 August 2025
                        </Badge>
                    </div>

                    <div className="hidden md:flex gap-4">
                        <Shield size={80} />
                        <Lock size={80} />
                        <FileText size={80} />
                    </div>
                </div>
            </div>
            <div className="bg-white mt-3 max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 rounded-sm shadow-lg">
                <div className="lg:col-span-2">

                    {sections.map((sec) => (
                        <div
                            key={sec.id}
                            onMouseEnter={() => setHovered(sec.id)}
                            onMouseLeave={() => setHovered(null)}
                            className={`py-6 border-b transition-all duration-300 ${
                                current === sec.id ? "border-[#D4AF37]" : "border-gray-200"
                            }`}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <span
                                    className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold transition-all
                                        ${
                                            current === sec.id
                                                ? "bg-[#D4AF37] text-black"
                                                : "bg-[#FFF8EC] text-[#D4AF37] border border-gray-200"
                                        }
                                    `}
                                >
                                    {sec.id}
                                </span>

                                <h2 className="font-semibold text-lg text-[#1A1A1A]">
                                    {sec.title}
                                </h2>
                            </div>
                            {Array.isArray(sec.content) ? (
                                <ul className="pl-12 space-y-2 text-[#1A1A1A]">
                                    {sec.content.map((item, i) => (
                                        <li key={i} className="flex gap-2">
                                            <span className="w-2 h-2 mt-2 bg-[#D4AF37] rounded-full"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="pl-12 text-[#1A1A1A]">
                                    {sec.content}
                                </p>
                            )}
                        </div>
                    ))}
                    <div className="py-6">
                        <h2 className="font-semibold text-lg mb-3 text-[#1A1A1A]">
                            Contact Us
                        </h2>

                        <div className="space-y-2 pl-2 text-[#1A1A1A]">
                            <div className="flex items-center gap-2">
                                <MapPin size={16} />
                                Manjeera Trinity Corporate, Kukatpally, Hyderabad – 500072
                            </div>

                            <div className="flex items-center gap-2">
                                <Mail size={16} />
                                info@kavaswholesalehub.com
                            </div>

                            <div className="flex items-center gap-2">
                                <Phone size={16} />
                                +91 6302259849
                            </div>
                        </div>
                    </div>

                </div>
                <div className="space-y-4">

                    <Card className="bg-[#0B1F3A] text-white rounded-2xl">
                        <CardContent className="p-5">
                            <h3 className="font-semibold mb-4 text-[#D4AF37] flex gap-2">
                                <BookOpenText color="#D4AF37" />
                                Quick Navigation
                            </h3>

                            {sections.map((sec) => (
                                <div
                                    key={sec.id}
                                    onClick={() => setActive(sec.id)}
                                    onMouseEnter={() => setHovered(sec.id)}
                                    onMouseLeave={() => setHovered(null)}
                                    className="flex justify-between border-b border-white/20 pb-2 mb-2 cursor-pointer hover:text-[#D4AF37]"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="bg-[#D4AF37] text-black text-xs font-semibold px-2.5 py-1 rounded-full min-w-7 text-center">
                                            {sec.id}
                                        </span>
                                        <span className="text-white text-sm">
                                            {sec.title}
                                        </span>
                                    </div>
                                    <ChevronRight size={16} />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-[#FFF8EC] rounded-2xl border border-[#E5E5E5]">
                        <CardContent className="p-5 text-center space-y-4">
                            <h3 className="font-semibold text-xl text-[#1A1A1A] flex items-center justify-center gap-2">
                                <Headset size={22} color="#0B1F3A" />
                                Need Help?
                            </h3>

                            <p className="text-sm text-gray-600">
                                Have questions about our Privacy Policy? We’re here to help.
                            </p>

                            <Button className="bg-[#0B1F3A] text-white hover:bg-[#092030]">
                                Contact Support
                            </Button>
                        </CardContent>
                    </Card>

                </div>
                <div className="col-span-full bg-[#0B1F3A] text-white mt-6 rounded-sm">
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
                                    At KAVAS, we believe in transparency and secure business practices.
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