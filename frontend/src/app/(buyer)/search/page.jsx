// frontend/app/(buyer)/search/page.jsx
import { Suspense } from "react";
import Search from "../../../components/ui/common/Search";

export default function Page() {
  return (
    <div>
      <h1>Search</h1>

      <Suspense fallback={<div>Loading...</div>}>
        <Search />
      </Suspense>
    </div>
  );
}