"use client";

import { use } from "react";
import CategoryPage from "../page";
import { slugify, deslugify } from "@/utils/slugify";

export default function SubCategoryPage({ params }) {
  return <CategoryPage params={params} />;
}
