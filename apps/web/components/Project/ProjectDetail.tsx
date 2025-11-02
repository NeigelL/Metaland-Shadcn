import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { useParams } from "next/navigation"
import { Separator } from "@workspace/ui/components/separator";


export default function ProjectDetail({ project }: any) {
    const params = useParams()
    return <>
     {project && <div className="w-full max-w-none mx-auto space-y-4 sm:space-y-6 px-0">
     <Card className="p-2 sm:p-4 h-auto overflow-visible">
        <CardHeader className="pb-1">
           <CardTitle className="text-lg text-center font-bold">{project.display_name.toLocaleUpperCase()}</CardTitle>
         </CardHeader>
         <CardContent className="space-y-2 sm:space-y-3 text-sm">
           <div>
             <p className="text-sm text-muted-foreground">Address</p>
             <p className="text-xs font-semibold text-muted-foreground uppercase">{project.address1}</p>
           </div>
           <Separator />
           <div>
             <p className="text-sm text-muted-foreground">Area</p>
             <p className="text-xs font-semibold text-muted-foreground uppercase">{project.total_area} sqm</p>
           </div>
           <Separator />
           <div>
             <p className="text-sm text-muted-foreground">Project Status</p>
             <p className="text-xs font-semibold text-muted-foreground uppercase">ON GOING</p>
           </div>
         </CardContent>
       </Card>
     </div>}
    </>
}