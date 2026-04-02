"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    CheckCircle,
    ShieldCheck,
    Building2,
    UserCheck,
    Factory,
    PackageCheck,
    BadgeCheck,
    TrendingUp,
} from "lucide-react";
import Link from "next/link";

const steps = [
    {
        id: 1,
        title: "Business Registration",
        desc: "GST, MSME, or ROC certificate verified by our compliance team",
        icon: <Building2 className="w-5 h-5" />,
    },
    {
        id: 2,
        title: "KYC & Identity Check",
        desc: "Aadhaar / PAN of authorized signatory cross-referenced with govt. databases",
        icon: <UserCheck className="w-5 h-5" />,
    },
    {
        id: 3,
        title: "Factory / Warehouse Audit",
        desc: "Physical or video inspection of production/storage facility",
        icon: <Factory className="w-5 h-5" />,
    },
    {
        id: 4,
        title: "Product Sample Review",
        desc: "Random sample review for quality, labelling, and safety compliance",
        icon: <PackageCheck className="w-5 h-5" />,
    },
    {
        id: 5,
        title: "Trade Reference Check",
        desc: "Minimum 3 buyer references contacted and confirmed",
        icon: <ShieldCheck className="w-5 h-5" />,
    },
    {
        id: 6,
        title: "Pricing Audit",
        desc: "Market price benchmarking to ensure competitive, genuine wholesale rates",
        icon: <TrendingUp className="w-5 h-5" />,
    },
    {
        id: 7,
        title: "Ongoing Monitoring",
        desc: "Quarterly re-audits + AI-powered dispute flagging post-listing",
        icon: <CheckCircle className="w-5 h-5" />,
    },
];

const page = () => {
    return (
        <div className="bg-gray-50">

            {/* 🔶 HERO SECTION */}
            <div className="bg-green-500 text-black py-16 px-6 text-center">
                <div className="flex justify-center mb-4">
                    <div className="bg-green-400/20 p-4 rounded-xl">
                        <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                    Verified Suppliers Only
                </h1>

                <p className="max-w-2xl mx-auto text-sm md:text-base opacity-90 mb-6">
                    Every supplier on Kavas goes through a rigorous 7-step verification
                    process before they can list a single product. Zero tolerance for fraud.
                </p>
                <Link href="/suppliers/verified">
                    <Button className="bg-white text-green-700 hover:bg-gray-100 font-medium px-6 py-2 rounded-lg">
                        Browse Verified Suppliers →
                    </Button>
                </Link>
            </div>

            {/* 🔶 STEPS SECTION */}
            <div className="py-14 px-4 md:px-10">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-semibold">
                        Our 7-Step Verification Process
                    </h2>
                    <p className="text-gray-500 text-sm mt-2">
                        Every supplier passes all 7 gates before they go live
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step) => (
                        <Card
                            key={step.id}
                            className="rounded-2xl shadow-sm hover:shadow-md transition"
                        >
                            <CardContent className="p-6 text-center">
                                {/* Number Circle */}
                                <div className="flex justify-center mb-4">
                                    <div className="bg-green-500 text-white w-10 h-10 flex items-center justify-center rounded-full font-semibold">
                                        {step.id}
                                    </div>
                                </div>

                                <h3 className="font-semibold mb-2">{step.title}</h3>
                                <p className="text-sm text-gray-500">{step.desc}</p>
                            </CardContent>
                        </Card>
                    ))}

                    {/* ✅ Verified Badge Card */}
                    <Card className="rounded-2xl border-2 border-green-400 bg-green-50">
                        <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                            <BadgeCheck className="w-10 h-10 text-green-600 mb-3" />
                            <h3 className="font-semibold text-green-700">
                                Verified Badge Earned
                            </h3>
                            <p className="text-sm text-green-600">
                                Only 1 in 4 applicants make it
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* 🔶 STATS SECTION */}
            <div className="px-4 md:px-10 pb-14">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 text-center gap-6">
                    <div>
                        <h3 className="text-2xl font-bold text-green-700">12,400+</h3>
                        <p className="text-sm text-gray-600">Verified Suppliers</p>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold text-green-700">98.7%</h3>
                        <p className="text-sm text-gray-600">Successful Transactions</p>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold text-green-700">&lt;0.3%</h3>
                        <p className="text-sm text-gray-600">
                            Fraud Rate (Industry avg 3.2%)
                        </p>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold text-green-700">24 hrs</h3>
                        <p className="text-sm text-gray-600">Avg. Verification Time</p>
                    </div>
                </div>
                <Link href="/">
                    <div className="text-center mt-6">

                        <Button variant="outline">← Back to Home</Button>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default page;