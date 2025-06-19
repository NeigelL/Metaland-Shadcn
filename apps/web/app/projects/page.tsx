"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@workspace/ui/components/card";
import { projects } from "@/data/projects";
import { lotsDetails } from "@/data/lotDetailContent";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";
import Link from "next/link";
import { Search, MapPin, Grid, User, LandPlot } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@workspace/ui/components/tabs";

interface Project {
  project: string;
  address: string;
  type: string[];
  area: string;
  info: string | string[];
  status: string;
  description?: string;
  condition?: string;
  mapUrl?: string;
  vicinityURL?: string;
  mainUrl?: string;
  imageUrl?: string[];
  priceHistory?: { date: string; price: number }[];
}

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Get projects that exist in lotsDetails
    const lotDetailProjects = new Set<string>();
    lotsDetails.lots.forEach(lot => {
      if (lot.project) {
        lotDetailProjects.add(lot.project);
      }
    });

    // Filter projects to only include those present in lotsDetails
    const projectsInLots = projects.filter(project => 
      lotDetailProjects.has(project.project)
    );

    setAvailableProjects(projectsInLots);
  }, []);
  
  // Get unique project types for the filter tabs from available projects only
  const allTypes = Array.from(new Set(availableProjects.flatMap(project => project.type))).sort();
  const tabValues = ["all", ...allTypes];

  useEffect(() => {
    // Filter available projects based on search query and selected type
    const filtered = availableProjects.filter(project => {
      const matchesSearch = 
        project.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.type.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = selectedType === "all" || project.type.includes(selectedType);
      
      return matchesSearch && matchesType;
    });
    
    setFilteredProjects(filtered);
  }, [searchQuery, selectedType, availableProjects]);

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-l md:text-2xl font-bold tracking-tight">
              METALAND PROJECTS
            </h1>
            <p className="text-muted-foreground mt-1">
              VIEW METALAND PROJECTS
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, address, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        <Tabs defaultValue="all" value={selectedType} onValueChange={setSelectedType} className="w-full">
          <TabsList className="w-full overflow-x-auto flex-nowrap whitespace-nowrap">
            {tabValues.map((type) => (
              <TabsTrigger 
                key={type} 
                value={type}
                className="capitalize"
              >
                {type}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {/* Tab Contents */}
          {tabValues.map(type => (
            <TabsContent key={type} value={type} className="mt-6">
              <ProjectGrid projects={filteredProjects} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-muted p-4 rounded-full mb-4">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No projects found</h3>
        <p className="text-muted-foreground mt-2">Try adjusting your search criteria</p>
      </div>
    );
  }

  // Function to get status style class
  const getStatusStyle = (status?: string): string => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {projects.map((project, index) => (
        <Card key={index} className="flex flex-col h-full">
          {/* Project Header - Using fixed height with consistent styling */}
          <div className="bg-gray-50 p-4 border-b flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <h3 className="font-medium truncate max-w-[150px]">{project.project}</h3>
            </div>
            <span 
              className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(project.status)}`}
            >
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </div>
          
          {/* Content Section - With consistent spacing and alignment */}
          <CardContent className="p-4 flex-grow flex flex-col">
            <div className="space-y-4 w-full">
              {/* Location */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">LOCATION</span>
                </div>
                <p className="text-xs line-clamp-2 pl-5">{project.address}</p>
              </div>
              
              {/* Area */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Grid className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">AREA</span>
                </div>
                <p className="text-xs pl-5">{project.area}</p>
              </div>
              
              {/* Type */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <LandPlot className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">TYPE</span>
                </div>
                <div className="flex flex-wrap gap-1 pl-5">
                  {project.type.map((type, i) => (
                    <Badge key={i} variant="outline" className="text-xs py-0.5 px-1.5">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Condition - If available */}
              {project.condition && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">CONDITION</span>
                  </div>
                  <p className="text-xs pl-5">{project.condition}</p>
                </div>
              )}
            </div>
          </CardContent>
          
          {/* Footer with View Button - Consistent across all cards */}
          {/* <CardFooter className="p-4 pt-0 mt-auto">
            <Link
              href={`/agentproject/${encodeURIComponent(project.project)}`}
              className="w-full text-xs px-3 py-2 bg-gray-600 text-white rounded hover:bg-blue-600 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Search className="h-3 w-3" />
              View Details
            </Link>
          </CardFooter> */}
        </Card>
      ))}
    </div>
  );
}