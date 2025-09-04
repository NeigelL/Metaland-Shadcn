import { Can } from "@/components/Permission/Can";
import PageClient from "./PageClient";
import { Metadata } from "next"
export const metadata: Metadata = {
    title:
      "Manage Prospects",
    description: "Manage Prospects"
};

export default async function () {
    return <Can permissions={["users:manage-prospects"]} redirect={true}>
      <PageClient />
    </Can>
}