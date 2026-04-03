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
        desc: "Aadhaar / PAN of authorized signatory cross-referenced",
        icon: <UserCheck className="w-5 h-5" />,
    },
    {
        id: 3,
        title: "Factory / Warehouse Audit",
        desc: "Physical or video inspection of facility",
        icon: <Factory className="w-5 h-5" />,
    },
    {
        id: 4,
        title: "Product Sample Review",
        desc: "Quality and compliance checks",
        icon: <PackageCheck className="w-5 h-5" />,
    },
    {
        id: 5,
        title: "Trade Reference Check",
        desc: "Minimum 3 buyer references verified",
        icon: <ShieldCheck className="w-5 h-5" />,
    },
    {
        id: 6,
        title: "Pricing Audit",
        desc: "Ensures competitive wholesale pricing",
        icon: <TrendingUp className="w-5 h-5" />,
    },
    {
        id: 7,
        title: "Ongoing Monitoring",
        desc: "Quarterly audits + AI monitoring",
        icon: <CheckCircle className="w-5 h-5" />,
    },
];

const page = () => {
    return (
        <div className="bg-gray-50">

            {/* 🔶 HERO */}
            <div className="bg-green-500 text-black py-12 sm:py-14 md:py-16 px-4 sm:px-6 text-center">
                <div className="flex justify-center mb-4">
                    <div className="bg-green-400/20 p-3 sm:p-4 rounded-xl">
                        <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
                    Verified Suppliers Only
                </h1>

                <p className="max-w-xl mx-auto text-sm sm:text-base opacity-90 mb-6 px-2">
                    Every supplier goes through a strict 7-step verification process.
                </p>

                <Link href="/suppliers/verified">
                    <Button className="bg-white text-green-700 hover:bg-gray-100 px-5 py-2 text-sm sm:text-base">
                        Browse Verified Suppliers →
                    </Button>
                </Link>
            </div>

            {/* 🔶 STEPS */}
            <div className="py-10 sm:py-12 md:py-14 px-4 sm:px-6 md:px-10">
                <div className="text-center mb-8 sm:mb-10">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
                        Our 7-Step Verification Process
                    </h2>
                    <p className="text-gray-500 text-sm mt-2">
                        Every supplier passes all 7 gates
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

                    {steps.map((step) => (
                        <Card
                            key={step.id}
                            className="rounded-2xl shadow-sm hover:shadow-md transition"
                        >
                            <CardContent className="p-5 sm:p-6 text-center">
                                <div className="flex justify-center mb-3">
                                    <div className="bg-green-500 text-white w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full font-semibold">
                                        {step.id}
                                    </div>
                                </div>

                                <h3 className="font-semibold text-sm sm:text-base mb-1">
                                    {step.title}
                                </h3>

                                <p className="text-xs sm:text-sm text-gray-500">
                                    {step.desc}
                                </p>
                            </CardContent>
                        </Card>
                    ))}

                    {/* ✅ Verified Badge */}
                    <Card className="rounded-2xl border-2 border-green-400 bg-green-50">
                        <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                            <BadgeCheck className="w-9 h-9 sm:w-10 sm:h-10 text-green-600 mb-3" />
                            <h3 className="font-semibold text-green-700 text-sm sm:text-base">
                                Verified Badge Earned
                            </h3>
                            <p className="text-xs sm:text-sm text-green-600">
                                Only 1 in 4 applicants qualify
                            </p>
                        </CardContent>
                    </Card>

                </div>
            </div>

            {/* 🔶 STATS */}
            <div className="px-4 sm:px-6 md:px-10 pb-12 sm:pb-14">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">

                    <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-green-700">
                            12,400+
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                            Verified Suppliers
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-green-700">
                            98.7%
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                            Success Rate
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-green-700">
                            &lt;0.3%
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                            Fraud Rate
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-green-700">
                            24 hrs
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                            Verification Time
                        </p>
                    </div>

                </div>

                {/* Back */}
                <Link href="/">
                    <div className="text-center mt-6">
                        <Button variant="outline" className="text-sm sm:text-base">
                            ← Back to Home
                        </Button>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default page;
