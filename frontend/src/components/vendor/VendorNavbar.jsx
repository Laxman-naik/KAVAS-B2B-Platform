"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";

const VendorNavbar = () => {
  const [open, setOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(false);
        setResourcesOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!resourcesOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setResourcesOpen(false);
    };

    const onPointerDown = (e) => {
      const el = e.target;
      if (!(el instanceof Element)) return;
      if (el.closest("[data-vendor-resources-root='true']")) return;
      setResourcesOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [resourcesOpen]);

  const navItems = [
    { href: "#features", label: "Features" },
    { href: "#benefits", label: "Benefits" },
    { href: "#pricing", label: "Pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#E5E5E5] bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/vendor" className="flex items-center gap-3">
            <Image
              src="/LOGOKAVAS.png"
              alt="KAVAS"
              width={130}
              height={40}
              className="h-9 w-auto"
              priority
            />
            <div className="leading-tight">
              <div className="text-[10px] font-semibold tracking-wide text-[#0B1F3A]">
                SELLER HUB
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center justify-center gap-8 flex-1">
            {navItems.map((x) => (
              <a
                key={x.href}
                href={x.href}
                className="text-sm font-semibold text-[#0B1F3A] hover:text-[#0B1F3A]/80"
              >
                {x.label}
              </a>
            ))}

            <div className="relative" data-vendor-resources-root="true">
              <button
                type="button"
                onClick={() => setResourcesOpen((s) => !s)}
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#0B1F3A] hover:text-[#0B1F3A]/80"
                aria-expanded={resourcesOpen}
                aria-haspopup="menu"
              >
                Resources
                <ChevronDown size={16} />
              </button>

              {resourcesOpen && (
                <div
                  className="absolute left-0 mt-2 w-56 rounded-sm border border-[#E5E5E5] bg-white shadow-md p-2"
                  role="menu"
                >
                  <Link
                    href="/faqs"
                    className="block rounded-sm px-3 py-2 text-sm font-medium text-[#0B1F3A] hover:bg-[#FFF8EC]"
                    role="menuitem"
                    onClick={() => setResourcesOpen(false)}
                  >
                    FAQs
                  </Link>
                  <Link
                    href="/contactus"
                    className="block rounded-sm px-3 py-2 text-sm font-medium text-[#0B1F3A] hover:bg-[#FFF8EC]"
                    role="menuitem"
                    onClick={() => setResourcesOpen(false)}
                  >
                    Contact Support
                  </Link>
                  <a
                    href="#pricing"
                    className="block rounded-sm px-3 py-2 text-sm font-medium text-[#0B1F3A] hover:bg-[#FFF8EC]"
                    role="menuitem"
                    onClick={() => setResourcesOpen(false)}
                  >
                    Pricing Guide
                  </a>
                </div>
              )}
            </div>

            <Link
              href="/help"
              onClick={() => setResourcesOpen(false)}
              className="text-sm font-semibold text-[#0B1F3A] hover:text-[#0B1F3A]/80"
            >
              Help
            </Link>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/vendor/vendorlogin"
              className="rounded-sm border border-[#0B1F3A]/25 px-4 py-2 text-sm font-semibold text-[#0B1F3A] hover:bg-[#FFF8EC]"
            >
              Login
            </Link>
            <Link
              href="/vendor/vendorregister"
              className="rounded-sm bg-[#0B1F3A] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Create Account
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((s) => !s)}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-sm border border-[#E5E5E5] text-[#0B1F3A]"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden pb-4">
            <div className="grid gap-2 pt-2">
              {navItems.map((x) => (
                <a
                  key={x.href}
                  href={x.href}
                  onClick={() => setOpen(false)}
                  className="rounded-sm px-3 py-2 text-sm font-semibold text-[#0B1F3A] hover:bg-[#FFF8EC]"
                >
                  {x.label}
                </a>
              ))}

              <a
                href="#pricing"
                onClick={() => setOpen(false)}
                className="rounded-sm px-3 py-2 text-sm font-semibold text-[#0B1F3A] hover:bg-[#FFF8EC]"
              >
                Resources
              </a>

              <Link
                href="/help"
                onClick={() => setOpen(false)}
                className="rounded-sm px-3 py-2 text-sm font-semibold text-[#0B1F3A] hover:bg-[#FFF8EC]"
              >
                Help
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link
                href="/vendor/vendorlogin"
                className="rounded-sm border border-[#0B1F3A]/25 px-4 py-2 text-center text-sm font-semibold text-[#0B1F3A] hover:bg-[#FFF8EC]"
              >
                Login
              </Link>
              <Link
                href="/vendor/vendorregister"
                className="rounded-sm bg-[#0B1F3A] px-4 py-2 text-center text-sm font-semibold text-white hover:opacity-90"
              >
                Create
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default VendorNavbar;
