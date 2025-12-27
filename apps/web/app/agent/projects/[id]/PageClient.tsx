"use client";
import { useAgentProjectDetailQuery } from "@/components/api/agentApi";
import ProjectDetail from "@/components/Project/ProjectDetail";
import ProjectMap from "@/components/Project/ProjectMap";
import FileGallery from "@/components/Uploads/FileGallery";
import { Button } from "@workspace/ui/components/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function PageClient() {
    const params = useParams()
    const [tabSelected, setTabSelected] = useState("detail")
    const [tabValues] = useState<string[]>(["detail", "map"]);
    const id = params?.id as string
    const project_id = id
    const { data: projectResult, isLoading, isSuccess } = useAgentProjectDetailQuery(project_id)
    const project = projectResult?.project || {}

    return <div className="flex-1 p-4 space-y-6 max-w-7xl mx-auto w-full">
        <div className="space-y-4 sm:space-y-6">
            <div className="mb-6">
                <Link href="/projects" className="w-fit" prefetch={false}>
                    <Button variant="outline" size="icon" className="rounded-md">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
            </div>

            <Tabs
                defaultValue="detail"
                className="w-full"
                onValueChange={setTabSelected}
                value={tabSelected}
            >
                <TabsList className="mb-6 grid w-full grid-cols-2">
                    {tabValues.map((type) => (
                        <TabsTrigger
                            key={type}
                            value={type.toLowerCase()}
                            className="capitalize text-xs sm:text-sm px-2 sm:px-3 min-w-max"
                        >
                            {type}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="detail" className="mt-0">
                    {isLoading && <div>Loading project details...</div>}
                    {isSuccess && <ProjectDetail project={project} />}
                    <div className="mt-2 w-full">
                        {id && <FileGallery
                            options={{
                                folder: ["projects", id, "portal-resources"].join("/"),
                                entityID: id,
                                collection: "projects",
                            }}
                        />}
                    </div>
                </TabsContent>

                <TabsContent value="map" className="mt-0">
                    {isSuccess && <ProjectMap projectPath={projectResult.polygons} />}
                </TabsContent>
            </Tabs>
        </div>
    </div>
}