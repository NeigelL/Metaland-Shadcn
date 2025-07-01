import PageClient from "./PageClient";
import { Metadata } from "next"
export const metadata: Metadata = {
    title:
      "FAQ",
    description: "FAQ",
};

export default async function Page() {
  return (
    <div className="w-full p-2 md:p-4">
        <PageClient/>
    </div>
  )
}
