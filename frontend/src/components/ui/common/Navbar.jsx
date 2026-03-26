"use client";
import React from 'react'

import { Button } from "@/components/ui/button";
import { MapPin, Search, ShoppingCart, Moon, ArrowRight } from "lucide-react";

const Navbar = () => {
    return (
        <>
            <div className="w-full shadow-sm border-b bg-white">
                <div className="bg-black text-white text-xs py-2 overflow-hidden">
                    <div className="whitespace-nowrap animate-marquee flex gap-10 px-4">
                        <span>    Pro Membership — 14 days free trial, no credit card needed    </span> 
                        <span>    Sell on Kavas — List your products FREE for 6 months    </span>
                        <span>    Help Centre — 24/7 support available    </span>
                    </div>
                </div>

                <div className="mx-auto w-full max-w-7xl ">
                    <div className="flex min-h-20 items-center gap-4 py-2">

                        <div className="flex items-center shrink-0 h-20">
                            <img
                                src="/KAVAS Logo new.png"
                                alt="KAVAS Logo"
                                className="h-[54px] w-auto object-contain"
                            />
                        </div>

                        <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-gray-50 shrink-0  hover:bg-gray-100">
                            <MapPin size={16} className="text-gray-600" />
                            <div className="flex flex-col leading-tight">
                                <span className="text-[11px] text-gray-600">Deliver to</span>
                                <span className="text-xs font-medium text-gray-900">Mumbai</span>
                            </div>
                        </div>

                        <div className="flex flex-1 items-center max-w-3xl">
                            <input
                                placeholder="Search products, suppliers, brands..."
                                className="h-10 w-full rounded-r-none rounded-l-md border border-gray-300 bg-white px-3 text-sm outline-none  shadow-2xl"

                            />
                            <Button className="h-10 rounded-l-none bg-orange-500 hover:bg-orange-600 scale-3d">
                                <Search size={18} className="mr-0" />
                                Search
                            </Button>

                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <Button variant="outline" size="icon" className="h-10 w-10">
                                <Moon className="h-4 w-4" />
                            </Button>

                            <Button variant="outline" className="h-10">Sign in</Button>

                            <Button className="h-10 bg-orange-500 hover:bg-orange-600">
                                Join free <ArrowRight></ArrowRight>
                            </Button>

                            <Button variant="outline" className="h-10 gap-2">
                                <span className="relative">
                                    <ShoppingCart className="h-4 w-4" />
                                    <span className="absolute -top-5 -right-13 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                        0
                                    </span>
                                </span>
                                Cart
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar