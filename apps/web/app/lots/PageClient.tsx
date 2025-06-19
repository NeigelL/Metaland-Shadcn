"use client";

import { useEffect, useState } from "react";
import { differenceInDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { lotsDetails as initialLotsDetails } from "@/data/lotDetailContent";
import { projectsDetails } from "@/data/projectsDetailContents";
import { Input } from "@workspace/ui/components/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import { useSearchParams } from 'next/navigation';
import Link from "next/link";
import { amortizationDataStore } from "@/data/amortization-data";
import { 
  Search, 
  Calendar, 
  Wallet,
  AlertTriangle
} from "lucide-react";
import { useBuyerAmortizationsQuery } from "@/components/api/buyerApi";


interface Lot {
  lot_id: string;
  project: string;
  lot: string;
  date?: string;
  lotType?: string;
  tcp?: number;
  payment?: number;
  status?: string;
  reservation?: string;
  dueAmount?: string;
  dueDate?: string;
}

interface LotsDetails {
  userName: string;
  totalLots: number;
  fullyPaidLots: number;
  ongoingLots: number;
  lots: Lot[];
}


export function PageClient() {
  const [lotsDetails, setLotsDetails] = useState<LotsDetails | null>(null);
  const projectsMap = new Map(projectsDetails.projects.map(p => [p.project.toLowerCase(), p.address]));
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "ongoing" | "fullyPaid">("all");
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') as "all" | "ongoing" | "fullyPaid" | null;
  const{data: amortizations} = useBuyerAmortizationsQuery()

  useEffect(() => {
    const updatedLotsDetails = {
      ...initialLotsDetails,
      lots: initialLotsDetails.lots.map(lot => ({
        ...lot,
        lot_id: String(lot.lotId), // convert to string if needed
        dueAmount: lot.dueAmount ?? "0",
      })),
    };
    setLotsDetails(updatedLotsDetails);
  }, []);

  useEffect(() => {
    // Update the active tab based on URL parameter
    if (defaultTab === "all" || defaultTab === "ongoing" || defaultTab === "fullyPaid") {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  if (!lotsDetails) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse flex flex-col items-center w-full max-w-6xl">
          <div className="h-8 w-64 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded"></div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Filter the lots based on the selected filter
  const filteredLots = lotsDetails.lots.filter(lot => {
    const matchesSearch =
    lot.lot.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lot.project?.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") {
      return matchesSearch;
    }

    if (activeTab === "ongoing") {
      return matchesSearch && lot.status === "ongoing";
    }

    if (activeTab === "fullyPaid") {
      return matchesSearch && lot.status === "fully paid";
    }

    return false;
  });

  // Sort the filtered lots alphabetically by the 'lot' name
  const sortedFilteredLots = filteredLots.sort((a, b) => {
    const projectCompare = (a.project || "").localeCompare(b.project || "");
    if (projectCompare !== 0) return projectCompare;
    return a.lot.localeCompare(b.lot);
  });

  return (
    <div className="flex-1 p-3 sm:p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-l md:text-2xl font-bold tracking-tight">
              LOTS
            </h1>
            <p className="text-muted-foreground mt-1">
              TRACK ALL RESERVED PROPERTIES
            </p>
          </div>
          
          {/* Search Bar */}
          {/* <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full text-xs sm:text-sm"
            />
          </div> */}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="space-y-4">
      <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={(v: string) => setActiveTab(v as "all" | "ongoing" | "fullyPaid")}
          className="w-full"
        >
          <div className="flex items-center justify-between">
            <TabsList className="w-full overflow-x-auto flex-nowrap whitespace-nowrap scrollbar-hide">
            <TabsTrigger value="all" className="capitalize text-[11px] sm:text-sm px-2 sm:px-3">All Lots</TabsTrigger>
            <TabsTrigger value="ongoing" className="capitalize text-[11px] sm:text-sm px-2 sm:px-3">Ongoing</TabsTrigger>
            <TabsTrigger value="fullyPaid" className="capitalize text-[11px] sm:text-sm px-2 sm:px-3">Fully Paid</TabsTrigger>
            </TabsList>
          </div>

          <Separator className="my-4" />

          {/* Lots Grid */}
          <TabsContent value="all" className="mt-0 space-y-4">
            <PropertyGrid lots={amortizations} projectsMap={projectsMap} />
          </TabsContent>

          {/* <TabsContent value="ongoing" className="mt-0 space-y-4">
            <PropertyGrid lots={sortedFilteredLots} projectsMap={projectsMap} />
          </TabsContent>

          <TabsContent value="fullyPaid" className="mt-0 space-y-4">
            <PropertyGrid lots={sortedFilteredLots} projectsMap={projectsMap} />
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
}

// In your existing LotsPage component

function PropertyGrid({
  lots,
  projectsMap,
}: {
  lots: any[];
  projectsMap: Map<string, string>;
}) {  



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
      { lots &&  lots.map((lot, index) => {
        const reservation = lot.reservation_date ? new Date(lot.reservation_date) : null;
        const dueDate = lot.dueDate ? new Date(lot.dueDate) : null;
        const isFullyPaid = lot.total_paid_percent >= 100;

        const isPastDue = dueDate ? new Date() > dueDate : false;
        const overdueDays = isPastDue && dueDate ? differenceInDays(new Date(), dueDate) : 0;

        const address = projectsMap.get(lot.project_id?.name.toLowerCase() || "") || "Address not found";

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
                      {(() => {
                        const matchingProject = projectsDetails.projects.find(p => 
                          p.project.toLowerCase() === lot.project?.toLowerCase()
                        );

                        if (!matchingProject?.priceHistory) return null;
                        
                      })()}
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

        {/* <div className="flex justify-end">
          <Link
            href={`/lot/${lot.lot_id._id.toString()}`}
            className="w-full sm:w-auto px-3 py-2 bg-gray-600 text-xs text-white rounded hover:bg-blue-400 text-center block sm:inline-block"
          >
            Details
          </Link>
        </div> */}
              
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
