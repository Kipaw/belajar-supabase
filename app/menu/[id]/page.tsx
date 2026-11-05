import { Suspense } from "react";
import MenuDetail from "./menu-detail";

export default function Page() {
  return (
    <Suspense
      fallback={<div className="container mx-auto py-8">Loading...</div>}
    >
      <MenuDetail />
    </Suspense>
  );
}
