import Hero from "@/components/ui/common/Hero";
import TrendingProducts from "@/components/ui/common/TrendingProducts";
import NewArrivals from "@/components/ui/common/NewArrivals";
import Home from "@/components/ui/common/Home";
import FeaturedSuppliers from "@/components/ui/common/FeaturedSuppliers";
import FlashDeals from "@/components/ui/common/FlashDeals";


const page = () => {
  return (
    <>
    <Home />
    <TrendingProducts/>
    <NewArrivals/>
    <FeaturedSuppliers />
    <FlashDeals />
    </>
  );
}

export default page


