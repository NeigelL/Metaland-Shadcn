import { Can } from "@/components/Permission/Can";
import PageClient from "./PageClient";
import { Metadata } from "next"
export const metadata: Metadata = {
    title:
      "Available Assets",
    description: "Available Assets"
};

export default async function () {
    return <Can permissions={["users:manage-assets"]} redirect={true}>
      <PageClient />
    </Can>
}