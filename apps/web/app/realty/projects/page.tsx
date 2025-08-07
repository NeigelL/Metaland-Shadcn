import PageClient from "./PageClient";
import { Metadata } from "next"
export const metadata: Metadata = {
    title:
      "Active Projects",
    description: "Active Projects"
};

export default function (){

    return <PageClient />
}