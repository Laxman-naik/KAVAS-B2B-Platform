"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

const page = () => {
  return (
    <div className="w-full min-h-screen bg-[#FFF8EC]">
      
      <div className="w-full bg-[#0B1F3A] py-4 sm:py-6 md:py-8 flex justify-center px-4 sm:px-6 lg:px-10 mb-6 sm:mb-8">
        <div className="max-w-5xl mx-auto w-full text-center sm:text-left">
          
          <h1 className="text-lg sm:text-2xl md:text-3xl flex justify-center font-bold text-white leading-snug">
            KAVAS Wholesale Hub – Shipping & Returns
          </h1>

          <p className="text-[#FFF8EC] mt-2 flex justify-center text-sm sm:text-base md:text-lg">
            Find answers to common questions about shipping, returns, and refunds.
          </p>

        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 px-3 sm:px-6 lg:px-0">
        <Card className="shadow-sm rounded-xl sm:rounded-2xl border border-[#E5E5E5]">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-[#0B1F3A]">Shipping</h2>

            <Accordion type="single" collapsible className="w-full">

              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left text-sm sm:text-base text-[#1A1A1A] hover:text-[#D4AF37]">
                  Why does the delivery date sometimes differ from the estimated timeline?
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-gray-600">
                  Delivery timelines are estimates and may vary due to holidays, courier delays, or operational constraints.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left text-sm sm:text-base text-[#1A1A1A] hover:text-[#D4AF37]">
                  What is the order processing and shipping time?
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-gray-600">
                  Orders are processed within 1–3 business days. Standard shipping takes 5–10 business days and express shipping takes 2–5 business days.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left text-sm sm:text-base text-[#1A1A1A] hover:text-[#D4AF37]">
                  What factors affect delivery time?
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-gray-600">
                  Delivery depends on product availability, processing time, delivery location, and courier timelines.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left text-sm sm:text-base text-[#1A1A1A] hover:text-[#D4AF37]">
                  Why might my order arrive in multiple packages?
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-gray-600">
                  Orders may be split based on product availability or warehouse location.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left text-sm sm:text-base text-[#1A1A1A] hover:text-[#D4AF37]">
                  How are shipping charges calculated?
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-gray-600">
                  Charges depend on weight, volume, and delivery location. Final cost is shown at checkout.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left text-sm sm:text-base text-[#1A1A1A] hover:text-[#D4AF37]">
                  How can I track my order?
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-gray-600">
                  Tracking details are shared via email/SMS and available in the "My Orders" section.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger className="text-left text-sm sm:text-base text-[#1A1A1A] hover:text-[#D4AF37]">
                  Do you offer international shipping?
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-gray-600">
                  Yes, for select locations. Customs duties must be paid by the customer.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger className="text-left text-sm sm:text-base text-[#1A1A1A] hover:text-[#D4AF37]">
                  What should I do if my delivery is delayed?
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-gray-600">
                  Contact support. We will assist in tracking and resolving the issue.
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </CardContent>
        </Card>
        <Card className="shadow-sm rounded-xl sm:rounded-2xl border border-[#E5E5E5]">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-[#0B1F3A]">Returns & Refunds</h2>

            <Accordion type="single" collapsible className="w-full">

              <AccordionItem value="r1">
                <AccordionTrigger className="text-left text-sm sm:text-base text-[#1A1A1A] hover:text-[#D4AF37]">
                  What items are eligible for return?
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-gray-600">
                  Returns are accepted only for damaged, defective, or incorrect products within 48 hours of delivery.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="r2">
                <AccordionTrigger className="text-left text-sm sm:text-base text-[#1A1A1A] hover:text-[#D4AF37]">
                  Which items are not eligible for return?
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-gray-600">
                  Customized or misused products are not eligible for return.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="r3">
                <AccordionTrigger className="text-left text-sm sm:text-base text-[#1A1A1A] hover:text-[#D4AF37]">
                  What conditions must be met for a return?
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-gray-600">
                  Items must be unused, in original packaging, with all tags and invoices.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="r4">
                <AccordionTrigger className="text-left text-sm sm:text-base text-[#1A1A1A] hover:text-[#D4AF37]">
                  How do I initiate a return?
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-gray-600">
                  Contact support, share details and images, and pickup will be arranged after approval.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="r5">
                <AccordionTrigger className="text-left text-sm sm:text-base text-[#1A1A1A] hover:text-[#D4AF37]">
                  When will I receive my refund?
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-gray-600">
                  Refunds are processed within 5–10 business days to the original payment method.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="r6">
                <AccordionTrigger className="text-left text-sm sm:text-base text-[#1A1A1A] hover:text-[#D4AF37]">
                  Are shipping charges refundable?
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-gray-600">
                  Shipping charges are non-refundable except for defective or incorrect items.
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </CardContent>
        </Card>
        <Card className="shadow-sm rounded-xl sm:rounded-2xl border border-[#E5E5E5]">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-[#0B1F3A]">Cancellations & Modifications</h2>

            <Accordion type="single" collapsible className="w-full">

              <AccordionItem value="c1">
                <AccordionTrigger className="text-left text-sm sm:text-base text-[#1A1A1A] hover:text-[#D4AF37]">
                  Can I cancel my order?
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-gray-600">
                  Orders can only be canceled before shipment.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="c2">
                <AccordionTrigger className="text-left text-sm sm:text-base text-[#1A1A1A] hover:text-[#D4AF37]">
                  Can I modify my order?
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-gray-600">
                  Modifications are allowed only before processing begins.
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </CardContent>
        </Card>
        <Card className="shadow-sm rounded-xl sm:rounded-2xl border border-[#E5E5E5]">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-[#0B1F3A]">Contact Us</h2>

            <div className="space-y-2 text-gray-600 text-sm sm:text-base">
              <p>Email: info@kavaswholesalehub.com</p>
              <p>Phone: +91 0000000000</p>
              <p>Support available during business hours</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default page;