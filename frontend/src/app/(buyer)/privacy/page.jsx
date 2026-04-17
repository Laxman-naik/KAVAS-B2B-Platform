"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Lock,
  FileText,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Headphones,
} from "lucide-react";

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
  return (
    <>
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 to-blue-800 text-white p-10 rounded-b-3xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">
              Privacy <span className="text-yellow-400">Policy</span>
            </h1>
            <p className="mt-2 text-gray-200">
              Your Privacy Matters. We Protect It.
            </p>
            <Badge className="mt-4 bg-yellow-500 text-black">
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

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-4">
          {sections.map((sec) => (
            <Card key={sec.id} className="rounded-2xl">
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <div className="bg-yellow-100 text-yellow-700 font-bold rounded-full w-10 h-10 flex items-center justify-center">
                    {sec.id}
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">{sec.title}</h2>

                    {Array.isArray(sec.content) ? (
                      <ul className="list-disc ml-5 mt-2 text-gray-600 space-y-1">
                        {sec.content.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600 mt-2">{sec.content}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Contact */}
          <Card className="rounded-2xl">
            <CardContent className="p-5 space-y-3">
              <h2 className="font-semibold text-lg">Contact Us</h2>

              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={16} />
                <span>
                  Manjeera Trinity Corporate, Kukatpally, Hyderabad – 500072
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={16} />
                <span>info@kavaswholesalehub.com</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={16} />
                <span>+91 6302259849</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right */}
        <div className="space-y-4">
          <Card className="bg-blue-950 text-white rounded-2xl">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-4">Quick Navigation</h3>
              {sections.map((sec) => (
                <div
                  key={sec.id}
                  className="flex justify-between border-b border-blue-800 pb-2 mb-2"
                >
                  <span>
                    {sec.id} {sec.title}
                  </span>
                  <ChevronRight size={16} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-yellow-100 rounded-2xl">
            <CardContent className="p-5 text-center space-y-3">
              <Headphones className="mx-auto" />
              <h3 className="font-semibold">Need Help?</h3>
              <Button>Contact Support</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  

    </>
  )
}

export default page