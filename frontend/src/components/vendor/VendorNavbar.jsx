"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";

const VendorNavbar = () => {
  const [open, setOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  const navItems = [
    { href: "#features", label: "Features" },
    { href: "#benefits", label: "Benefits" },
    { href: "#pricing", label: "Pricing" },
  ];

  const resourceItems = [
    { href: "/faqs", label: "FAQs", type: "link" },
    { href: "/contactus", label: "Contact Support", type: "link" },
    { href: "#pricing", label: "Pricing Guide", type: "anchor" },
  ];

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

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B1F3A] shadow-sm">
      <div className="mx-auto w-full max-w-360 px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/LOGOKAVAS.png"
              alt="KAVAS"
              width={130}
              height={40}
              className="h-9 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-9">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative text-sm font-semibold text-white/90 transition-colors hover:text-[#D4AF37]"
              >
                {item.label}
              </a>
            ))}

            {/* Resources Dropdown */}
            <div className="relative" data-vendor-resources-root="true">
              <button
                type="button"
                onClick={() => setResourcesOpen((prev) => !prev)}
                className="inline-flex items-center gap-1 text-sm font-semibold text-white/90 transition-colors hover:text-[#D4AF37]"
                aria-expanded={resourcesOpen}
                aria-haspopup="menu"
              >
                Resources
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    resourcesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {resourcesOpen && (
                <div
                  className="absolute left-1/2 top-full mt-3 w-60 -translate-x-1/2 rounded-xl border border-[#E5E5E5] bg-white p-2 shadow-xl"
                  role="menu"
                >
                  {resourceItems.map((item) =>
                    item.type === "link" ? (
                      <Link
                        key={item.label}
                        href={item.href}
                        role="menuitem"
                        onClick={() => setResourcesOpen(false)}
                        className="block rounded-lg px-4 py-2.5 text-sm font-semibold text-[#0B1F3A] transition-colors hover:bg-[#FFF8EC] hover:text-[#D4AF37]"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        key={item.label}
                        href={item.href}
                        role="menuitem"
                        onClick={() => setResourcesOpen(false)}
                        className="block rounded-lg px-4 py-2.5 text-sm font-semibold text-[#0B1F3A] transition-colors hover:bg-[#FFF8EC] hover:text-[#D4AF37]"
                      >
                        {item.label}
                      </a>
                    )
                  )}
                </div>
              )}
            </div>

            <Link
              href="/help"
              onClick={() => setResourcesOpen(false)}
              className="relative text-sm font-semibold text-white/90 transition-colors hover:text-[#D4AF37]"
            >
              Help
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/vendor/vendorlogin"
              className="rounded-md border border-white/25 bg-transparent px-4 py-2 text-sm font-semibold text-white transition-all hover:border-[#D4AF37] hover:text-[#D4AF37]"
            >
              Login
            </Link>

            <Link
              href="/vendor/vendorregister"
              className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#0B1F3A] transition-all hover:bg-[#FFF8EC] hover:text-[#0B1F3A]"
            >
              Create Account
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 text-white transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="lg:hidden border-t border-white/10 pb-5 pt-3">
            <div className="grid gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10 hover:text-[#D4AF37]"
                >
                  {item.label}
                </a>
              ))}

              {resourceItems.map((item) =>
                item.type === "link" ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10 hover:text-[#D4AF37]"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10 hover:text-[#D4AF37]"
                  >
                    {item.label}
                  </a>
                )
              )}

              <Link
                href="/help"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10 hover:text-[#D4AF37]"
              >
                Help
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link
                href="/vendor/vendorlogin"
                onClick={() => setOpen(false)}
                className="rounded-md border border-white/25 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
              >
                Login
              </Link>

              <Link
                href="/vendor/vendorregister"
                onClick={() => setOpen(false)}
                className="rounded-md bg-white px-4 py-2.5 text-center text-sm font-semibold text-[#0B1F3A] transition-colors hover:bg-[#FFF8EC]"
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