import { Metadata } from "next"
import PageClient from "./PageClient";
import Project from "@/models/projects";

interface Params {
    id: string;
}

export default async function Page({ params }: { params: Params }) {
    const {id} = await params
    console.log("Project ID:", id);
    return <PageClient />;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { id } = await params
    const project  = await Project.findById(id).select( "name address1" )

    return {
        title: project?.name || "Project",
        description: project?.address1 || "Project details"
    };
}