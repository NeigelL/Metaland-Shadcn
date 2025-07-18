"use client";
import { useAgentProjectsAvailableQuery } from "@/components/api/agentApi";
import ProjectGrid from "@/components/Project/ProjectGrid";
import { IProject } from "@/types/project";
import { Input } from "@workspace/ui/components/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";


export default function PageClient() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedType, setSelectedType] = useState<string>("all");
    const [filteredProjects, setFilteredProjects] = useState<IProject[]>();
    const [tabValues, setTabValues] = useState<string[]>(["all"]);
    const {data: projects = []} = useAgentProjectsAvailableQuery();

    useEffect(() => {
        if(projects.length > 0) {
            const filtered = projects.filter((project:IProject) => {
                let s = searchQuery.trim()?.toLowerCase() || ""
                let name = project.name.toLowerCase() || ""
                let address1 = project.address1 && project.address1.toLowerCase() || ""
                let address2 = project.address2 && project.address2 && project.address2.toLowerCase() || ""
                let projectType = project.project_type && project.project_type.toLowerCase() || ""
                const matchesSearch = (name.length > 0 && name.includes(s)) || (address1.length > 0 && address1.includes(s)) || (address2.length > 0 && address2.includes(s)) || (projectType.length > 0 && projectType.includes(s))
                const matchesType = selectedType === "all" || (projectType && projectType.includes(selectedType));
                return matchesSearch && matchesType;
            })
            setFilteredProjects(filtered)
        }
    }, [searchQuery, selectedType])

    useEffect(() => {
        if(projects.length > 0) {
            const types:string[] = Array.from(new Set(projects.flatMap((project:IProject) => project?.project_type)));
            setTabValues(["all", ...types]);
            setSelectedType("all");
            setFilteredProjects(projects);
        }
    },[projects])

    return <div className="flex-1 p-4 space-y-6 max-w-7xl mx-auto w-full">
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:justify-between md:items-center">
                <div>
                    <h1 className="text-base sm:text-xl md:text-2xl font-bold tracking-tight">
                    METALAND ACTIVE PROJECTS
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                    VIEW METALAND ACTIVE PROJECTS
                    </p>
                </div>
                {/* Search Bar */}
                <div className="relative w-full max-w-full sm:max-w-xs md:w-80">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search by name, address, or type..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-full text-xs sm:text-sm"
                    />
                </div>
            </div>

            {<Tabs
                defaultValue="all"
                value={selectedType}
                onValueChange={(e) => setSelectedType(e?.toLowerCase())}
                className="w-full">
                <TabsList className="w-full flex-wrap sm:flex-nowrap whitespace-nowrap overflow-x-auto scrollbar-hide gap-1 sm:gap-2">
                    {tabValues.map((type) => (
                    <TabsTrigger
                        key={type}
                        value={type}
                        className="capitalize text-xs sm:text-sm px-2 sm:px-3 min-w-max"
                    >
                        {type}
                    </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value={selectedType} className="mt-4 sm:mt-6">
                    <ProjectGrid projects={filteredProjects && filteredProjects.length > 0 ? filteredProjects : []} />
                </TabsContent>
                </Tabs>}

        </div>
    </div>
}