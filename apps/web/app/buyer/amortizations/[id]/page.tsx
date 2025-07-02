import { Metadata } from "next"
export const metadata: Metadata = {
    title:
      "Amortization Detail",
    description: "Amortization Detail",
};
import PageClient from "./PageClient";

export default async function AmortizationPageDetail() {
  return <PageClient />
}