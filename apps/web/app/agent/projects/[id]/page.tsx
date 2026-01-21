import { Metadata } from "next"
import PageClient from "./PageClient";
import Project from "@/models/projects";

type Params = Promise<{
    id: string;
}>

export default async function Page() {
    return <PageClient />;
}

export async function generateMetadata(
    props: { params: Params }
): Promise<Metadata> {
    const { id } = await props.params
    const project = await Project.findById(id).select("name address1")

    return {
        title: project?.name || "Project",
        description: project?.address1 || "Project details"
    };
}