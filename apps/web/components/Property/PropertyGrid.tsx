
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { differenceInDays } from "date-fns";
import { Search, Calendar, Wallet, AlertTriangle } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import Link from "next/link";
import { Separator } from "@workspace/ui/components/separator";


export default function PropertyGrid({ lots }: { lots: any[]}) {

 if (lots && lots.length === 0) {
  return (
   <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="bg-muted p-4 rounded-full mb-4">
     <Search className="h-6 w-6 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-medium">No properties found</h3>
   </div>
  );
 }

 return (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
   { lots && lots.map((lot, index) => {
    const reservation = lot.reservation_date ? new Date(lot.reservation_date) : null;
    const dueDate = lot.dueDate ? new Date(lot.dueDate) : null;
    const isFullyPaid = lot.total_paid_percent >= 100;

    const isPastDue = dueDate ? new Date() > dueDate : false;
    const overdueDays = isPastDue && dueDate ? differenceInDays(new Date(), dueDate) : 0;

    const address = lot.project_id?.name.toUpperCase();

    return (
     <Card key={index} className="overflow-hidden w-full min-w-0">
      <div
       className={`h-1 w-full ${
        isFullyPaid ? "bg-emerald-500" : isPastDue ? "bg-destructive" : "bg-amber-500"
       }`}
      ></div>

      <CardHeader className="pb-2">
       <div className="mb-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
         {lot.project}
        </p>
        <p className="text-xs text-muted-foreground normal-case break-words">
         {address}
        </p>

        
       </div>

       <div className="flex justify-between items-start">
       <CardTitle className="text-sm sm:text-base truncate max-w-[200px]">
        {lot.lot_id.name}
       </CardTitle>

        <Badge variant={isFullyPaid ? "success" : isPastDue ? "warning" : "default"}>
         {isFullyPaid ? "Fully Paid" : "Ongoing"}
        </Badge>
       </div>
      </CardHeader>

      <CardContent className="space-y-4">
       <div className="grid grid-cols-2 gap-2">
        {lot.tcp && (
         <div className="flex items-start space-x-2">
          <Wallet className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <div>
           <p className="text-xs text-muted-foreground">TCP</p>
           <p className="text-sm font-medium">₱{parseFloat(String(lot.tcp)).toLocaleString()}</p>
           {/* {(() => {
            const matchingProject = projectsDetails.projects.find(p => 
             p.project.toLowerCase() === lot.project?.toLowerCase()
            );

            if (!matchingProject?.priceHistory) return null;
            
           })()} */}
          </div>
          
         </div>
        )}

        {reservation && (
         <div className="flex items-start space-x-2">
          <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <div>
           <p className="text-xs text-muted-foreground">Reservation Date</p>
           <p className="text-sm font-medium">
            {reservation.toLocaleDateString("en-US", {
             year: "numeric",
             month: "short",
             day: "numeric",
            })}
           </p>
          </div>
         </div>
        )}
       </div>

       <Separator />

       <div className="flex justify-between items-end">
        {/* <div>
         <p className="text-xs text-muted-foreground">Amount Due</p>
         <p className={`text-lg font-bold ${isPastDue ? "text-destructive" : ""}`}>
          ₱{parseFloat(lot.dueAmount || "0").toLocaleString()}
         </p>
        </div> */}

    <div className="flex justify-end">
     <Link
      href={`/amortizations/${lot._id.toString()}`}
      className="w-full sm:w-auto px-3 py-2 bg-gray-600 text-xs text-white rounded hover:bg-blue-400 text-center block sm:inline-block"
      prefetch={false}
     >
      Details
     </Link>
    </div>
       
     </div>

       {isPastDue && (
        <div className="flex items-center text-destructive text-sm font-medium bg-destructive/10 p-2 rounded">
         <AlertTriangle className="h-4 w-4 mr-2" />
         <span>Overdue by {overdueDays} day{overdueDays > 1 ? "s" : ""}</span>
        </div>
       )}
      </CardContent>
     </Card>
    );
   })}
   
  </div>
 );
}