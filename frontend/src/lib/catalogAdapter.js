import { productsData } from "@/app/(buyer)/product/productData";

export const slugify = (text = "") =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const deslugify = (text = "") =>
  text
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const categoryAliasMap = {
  "home-appliances": "electronics",
  electronics: "electronics",
  "fashion-wear": "apparel",
  "beauty-and-personal-care": "apparel",
  "kid-toys": "apparel",
  "baby-products": "apparel",
  "sports-and-entertainment": "electronics",
  "gifts-and-crafts": "apparel",
  "repair-and-operations-tools": "electronics",
  "raw-materials": "apparel",
  packaging: "electronics",
  "medical-and-health": "electronics",
  "other-products": "electronics",
};

const subcategoryAliasMap = {
  electronics: {
    "mobile-phones-and-accessories": "audio & headphones",
    "computers-and-laptops": "laptops & computers",
    "tv-and-home-entertainment": "monitors",
    "cameras-and-photography": "cameras & security",
    "audio-devices": "audio & headphones",
    "wearable-technology": "audio & headphones",
    "gaming-consoles-and-accessories": "keyboards & mice",
  },
  apparel: {
    "mens-clothing": "men wear",
    "mens-wear": "men wear",
    "womens-clothing": "women wear",
    "kids-clothing": "kids wear",
    footwear: "footwear",
    "bags-and-accessories": "accessories",
    "jewelry-and-watches": "accessories",
  },
};

const productAliasMap = {
  electronics: {
    "mobile-phones-and-accessories": {
      smartphones: "Wireless Earbuds TWS Pro",
      "phone-cases": "True Wireless Earbuds Mini",
      chargers: "Fast Charger 33W",
      "power-banks": "Power Bank 20000mAh",
    },
    "computers-and-laptops": {
      laptops: "Laptop Cooling Pad",
      desktops: "USB-C Hub 7 in 1",
    },
    "tv-and-home-entertainment": {
      "smart-tvs": "LED Monitor 24 inch",
    },
    "cameras-and-photography": {
      "dslr-camera": "CCTV Camera 1080p",
      "tripod-stand": "WiFi Smart Camera",
    },
    "audio-devices": {
      headphones: "Noise Cancelling Headphones",
      "bluetooth-speaker": "Portable Bluetooth Speaker",
    },
    "wearable-technology": {
      "smart-watch": "Wireless Earbuds TWS Pro",
    },
    "gaming-consoles-and-accessories": {
      "gaming-console": "Mechanical Keyboard RGB",
      "game-controller": "Wireless Keyboard Mouse Combo",
    },
  },
  apparel: {
    "mens-clothing": {
      shirts: "Men Formal Shirt Wholesale",
      "t-shirts": "Men Cotton T-Shirts Pack",
      jeans: "Men Denim Jeans Bulk",
      jackets: "Men Hoodie Winter",
    },
  },
};

function resolveCategory(heroCategorySlug) {
  return categoryAliasMap[heroCategorySlug] || heroCategorySlug;
}

function resolveSubcategory(heroCategorySlug, heroSubcategorySlug) {
  const realCategory = resolveCategory(heroCategorySlug);
  return (
    subcategoryAliasMap[realCategory]?.[heroSubcategorySlug] || heroSubcategorySlug
  );
}

function resolveTopProduct(heroCategorySlug, heroSubcategorySlug, heroTopProductSlug) {
  const realCategory = resolveCategory(heroCategorySlug);
  return (
    productAliasMap[realCategory]?.[heroSubcategorySlug]?.[heroTopProductSlug] || null
  );
}

export function getCategoryProducts(categorySlug) {
  const realCategory = resolveCategory(categorySlug);
  return productsData[realCategory] || [];
}

export function getSubcategories(categorySlug) {
  const items = getCategoryProducts(categorySlug);
  return [...new Set(items.map((item) => item.subcategory))];
}

export function getTopProducts(categorySlug, subcategorySlug = null) {
  const items = getCategoryProducts(categorySlug);

  return items.filter((item) => {
    const matchesTop = item.isTopProduct;

    const matchesSubcategory = subcategorySlug
      ? slugify(item.subcategory) === slugify(resolveSubcategory(categorySlug, subcategorySlug))
      : true;

    return matchesTop && matchesSubcategory;
  });
}

export function getTopProduct(categorySlug, subcategorySlug, topProductSlug) {
  const items = getCategoryProducts(categorySlug);
  const realSubcategory = resolveSubcategory(categorySlug, subcategorySlug);
  const aliasedTopProductName = resolveTopProduct(
    categorySlug,
    subcategorySlug,
    topProductSlug
  );

  return items.find((item) => {
    if (!item.isTopProduct) return false;
    if (slugify(item.subcategory) !== slugify(realSubcategory)) return false;

    if (aliasedTopProductName) {
      return item.name === aliasedTopProductName;
    }

    return slugify(item.name) === topProductSlug;
  });
}

export function getListingProducts(categorySlug, subcategorySlug, topProductSlug) {
  const mainProduct = getTopProduct(categorySlug, subcategorySlug, topProductSlug);
  if (!mainProduct) return [];
  return [mainProduct, ...(mainProduct.similarProducts || [])];
}

export function getListingProductById(
  categorySlug,
  subcategorySlug,
  topProductSlug,
  productId
) {
  const listings = getListingProducts(categorySlug, subcategorySlug, topProductSlug);
  return listings.find((item) => item.id === Number(productId));
}