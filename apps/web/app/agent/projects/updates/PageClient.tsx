"use client";

import { useAgentProjectsAvailableQuery, useAgentProjectDetailQuery } from "@/components/api/agentApi";
import { IProject } from "@/types/project";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
import { Button } from "@workspace/ui/components/button";
import { useState, useMemo } from "react";
import AgentProjectMap from "@/components/GoogleMap/AgentProjectMap";
import { Map, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
import { cn } from "@workspace/ui/lib/utils";

export default function PageClient() {
    const { data: projects = [], isLoading } = useAgentProjectsAvailableQuery();
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    const toggleProject = (projectId: string) => {
        if (selectedProjectId === projectId) {
            setSelectedProjectId(null);
        } else {
            setSelectedProjectId(projectId);
        }
    };

    return (
        <div className="flex-1 p-4 space-y-6 max-w-7xl mx-auto w-full">
            {/* Header Section */}
            <div className="space-y-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Project Updates</h1>
                    <p className="text-muted-foreground">
                        Real-time availability and pricing updates for all projects.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Projects Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Project Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead className="text-right">Available Lots</TableHead>
                                    <TableHead className="text-right">Lowest SQM</TableHead>
                                    <TableHead className="text-right">Avg. TCP</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            Loading projects...
                                        </TableCell>
                                    </TableRow>
                                ) : projects.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            No projects found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    projects.map((project: IProject) => (
                                        <React.Fragment key={project._id as string}>
                                            <ProjectRow
                                                project={project}
                                                isOpen={selectedProjectId === project._id}
                                                onToggle={() => toggleProject(project._id as string)}
                                            />
                                            {selectedProjectId === project._id && (
                                                <TableRow className="bg-muted/30 hover:bg-muted/30">
                                                    <TableCell colSpan={6} className="p-0 border-b">
                                                        <div className="p-4">
                                                            <ProjectMapSection project={project} />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function ProjectRow({ project, isOpen, onToggle }: { project: IProject, isOpen: boolean, onToggle: () => void }) {
    const { data: detailData, isLoading } = useAgentProjectDetailQuery(project._id as string);

    const stats = useMemo(() => {
        if (!detailData?.polygons?.lots) return null;

        const lots = detailData.polygons.lots;
        const availableLots = lots.filter((l: any) => l.lot_id?.status === 'available');

        const count = availableLots.length;

        if (count === 0) {
            return { count: 0, lowestSqm: 0, avgTcp: 0 };
        }

        const lowestSqm = Math.min(...availableLots.map((l: any) => Number(l.lot_id?.area) || Infinity));

        let totalTcp = 0;
        let tcpCount = 0;

        availableLots.forEach((l: any) => {
            const tcp = Number(l.lot_id?.tcp);
            if (!isNaN(tcp) && tcp > 0) {
                totalTcp += tcp;
                tcpCount++;
            }
        });

        const avgTcp = tcpCount > 0 ? totalTcp / tcpCount : 0;

        return {
            count,
            lowestSqm: lowestSqm === Infinity ? 0 : lowestSqm,
            avgTcp
        };
    }, [detailData]);

    return (
        <TableRow
            className={cn("cursor-pointer transition-colors", isOpen ? "bg-muted/50" : "hover:bg-muted/50")}
            onClick={onToggle}
        >
            <TableCell className="font-medium">{project.name}</TableCell>
            <TableCell>{[project.city, project.province].filter(Boolean).join(", ")}</TableCell>
            <TableCell className="text-right">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin ml-auto" /> : stats?.count || 0}
            </TableCell>
            <TableCell className="text-right">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin ml-auto" /> : stats?.lowestSqm ? `${stats.lowestSqm.toLocaleString()} sqm` : '-'}
            </TableCell>
            <TableCell className="text-right">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin ml-auto" /> : stats?.avgTcp ? `₱${stats.avgTcp.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '-'}
            </TableCell>
            <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onToggle(); }}>
                    {isOpen ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
                    {isOpen ? "Hide Map" : "View Map"}
                </Button>
            </TableCell>
        </TableRow>
    );
}

function ProjectMapSection({ project }: { project: IProject }) {
    const { data: detailData, isLoading, isSuccess } = useAgentProjectDetailQuery(project._id as string);

    return (
        <div className="w-full h-[500px] relative rounded-md border text-black bg-background overflow-hidden">
            {isLoading ? (
                <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mr-2" />
                    <span className="text-muted-foreground">Loading Map Data...</span>
                </div>
            ) : isSuccess && detailData?.polygons ? (
                <AgentProjectMap
                    projectPath={detailData.polygons}
                />
            ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                    Map data not available.
                </div>
            )}
        </div>
    );
}
