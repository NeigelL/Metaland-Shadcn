"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { MapPin, ArrowRight, Building2, Home } from "lucide-react";
import Link from "next/link";

const dummyProjects = [
    {
        id: "proj-1",
        name: "Metaland Heights",
        location: "Quezon City, Metro Manila",
        totalSold: 120,
        totalAvailable: 45,
        status: "Selling",
        description: "Premier residential community featuring modern amenities and lush landscapes."
    },
    {
        id: "proj-2",
        name: "Sunnyvale Estates",
        location: "Laguna, Philippines",
        totalSold: 85,
        totalAvailable: 112,
        status: "Pre-Selling",
        description: "Affordable family homes in a serene environment, perfect for starting families."
    },
    {
        id: "proj-3",
        name: "Urban Loft Towers",
        location: "Makati City",
        totalSold: 32,
        totalAvailable: 8,
        status: "Sold Out",
        description: "High-rise luxury condominiums in the heart of the business district."
    },
    {
        id: "proj-4",
        name: "Lakeside Villas",
        location: "Tagaytay City",
        totalSold: 10,
        totalAvailable: 50,
        status: "Selling",
        description: "Exclusive retirement village overlooking the beautiful Taal Lake."
    }
];

export default function ProjectsPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            COMING SOON
            {/* <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
                    <p className="text-muted-foreground">
                        Manage and view status of all active real estate projects.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {dummyProjects.map((project) => (
                    <Card key={project.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl">{project.name}</CardTitle>
                                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                                        <MapPin className="mr-1 h-3 w-3" />
                                        {project.location}
                                    </div>
                                </div>
                                <Badge variant={project.status === "Sold Out" ? "destructive" : "secondary"}>
                                    {project.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                {project.description}
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-1">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Sold</span>
                                    <div className="flex items-center">
                                        <Home className="mr-2 h-4 w-4 text-green-500" />
                                        <span className="font-bold text-lg">{project.totalSold}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Available</span>
                                    <div className="flex items-center">
                                        <Building2 className="mr-2 h-4 w-4 text-blue-500" />
                                        <span className="font-bold text-lg">{project.totalAvailable}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link href={`/salesmanager/projects/${project.id}`}>
                                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div> */}
        </div>
    );
}
