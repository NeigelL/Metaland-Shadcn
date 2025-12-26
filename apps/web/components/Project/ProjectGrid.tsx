import { Card, CardContent, CardFooter } from "@workspace/ui/components/card";
import { Grid, LandPlot, MapPin, Search, User } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import Link from "next/link";
import { IProject } from "@/types/project";
import { formatDecimal } from "@workspace/ui/lib/utils";

export default function ProjectGrid({ projects }: { projects: (IProject & { total_available_lots?: number })[] }) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="bg-muted p-4 rounded-full mb-4">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No projects found</h3>
      </div>
    );
  }

  const getStatusStyle = (status?: string): string => {
    switch (status?.toLowerCase()) {
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {projects.map((project, index) => (
        <Card
          key={index}
          className="flex flex-col h-full hover:shadow-md transition-shadow"
        >
          <div className="bg-gray-50 p-4 border-b items-center justify-between min-h-[3.5rem]">
            <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
              <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
              <h3 className="font-medium text-sm sm:text-base">
                {project.name}
              </h3>
            </div>
            {project?.project_status && <div
              className={`text-xs px-2 py-1 rounded-full shrink-0 ${getStatusStyle(
                project?.project_status
              )}`}
            >
              {project?.project_status?.toUpperCase()}
            </div>}
          </div>

          <CardContent className="p-4 flex-grow flex flex-col">
            <div className="space-y-3 w-full">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-xs font-medium text-muted-foreground">
                    LOCATION
                  </span>
                </div>
                <p className="text-xs sm:text-sm line-clamp-2 pl-5 leading-relaxed">
                  {project?.address1?.toUpperCase()}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Grid className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-xs font-medium text-muted-foreground">
                    AREA
                  </span>
                </div>
                <p className="text-xs sm:text-sm pl-5">{[formatDecimal(project?.total_area, false) + "", " sqm"]}</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <LandPlot className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-xs font-medium text-muted-foreground">
                    TYPE
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 pl-5">
                  {/* {project.type.map((type:any, i:any) => ( */}
                  <Badge
                    variant="outline"
                    className="text-xs py-0.5 px-1.5 sm:px-2"
                  >
                    {project.project_type}
                  </Badge>
                  {/* ))} */}
                </div>
              </div>

              {project.total_available_lots && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs font-medium text-muted-foreground">
                      AVAILABLE LOTS
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm pl-5 leading-relaxed">
                    {project.total_available_lots}
                  </p>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0 mt-auto">
            <Link
              href={["/projects", project._id].join("/")}
              className="w-full text-xs sm:text-sm px-3 py-2 sm:py-2.5 bg-gray-600 text-white rounded hover:bg-blue-600 flex items-center justify-center gap-1.5 transition-colors"
              prefetch={false}
            >
              <Search className="h-3 w-3" />
              View Project
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}