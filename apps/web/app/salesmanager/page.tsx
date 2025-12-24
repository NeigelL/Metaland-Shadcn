import { PageClient } from "./PageClient";
import { Metadata } from "next"
export const metadata: Metadata = {
  title:
    "Sales Manager Portal",
  description: "Sales Manager Portal",
};


export default async function Page() {
  return (
    <div className="w-full p-2 md:p-4">
      <PageClient />
    </div>
  )
}
