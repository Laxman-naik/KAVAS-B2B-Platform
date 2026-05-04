// import Home from "@/components/ui/common/Home";
// import TrendingProducts from "@/components/ui/common/TrendingProducts";
// import NewArrivals from "@/components/ui/common/NewArrivals";
// import FeaturedSuppliers from "@/components/ui/common/FeaturedSuppliers";
// import FlashDeals from "@/components/ui/common/FlashDeals";
// import TrustedSlide from "@/components/ui/common/TrustedSlide";
// import AllProducts from "@/components/ui/common/AllProducts";
// import { Categories } from "@/components/ui/common/Categories";

// export default function BuyerHome() {
//   return (

//     <>
    
//       <Home />
//       <NewArrivals />
//       <FlashDeals />
//       <TrendingProducts />
//       <TrustedSlide />
//       <AllProducts />
//       <FeaturedSuppliers />
      
//     </>
//   );
// }


import Home from "@/components/ui/common/Home";
import TrendingProducts from "@/components/ui/common/TrendingProducts";
import NewArrivals from "@/components/ui/common/NewArrivals";
import FeaturedSuppliers from "@/components/ui/common/FeaturedSuppliers";
import FlashDeals from "@/components/ui/common/FlashDeals";
import TrustedSlide from "@/components/ui/common/TrustedSlide";
import AllProducts from "@/components/ui/common/AllProducts";
import WhyChoose from "@/components/ui/common/WhyChoose"

export default function BuyerHome() {
  return (
    <>
      <Home />
       <TrendingProducts />
       <FlashDeals />
      <NewArrivals />
      <TrustedSlide />
      <WhyChoose />
     
      <AllProducts />
       
      {/* <FeaturedSuppliers /> */}
      
    </>
  );
}