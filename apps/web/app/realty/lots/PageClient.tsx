"use client";

import { useEffect, useState } from "react";
import { lotsDetails as initialLotsDetails } from "@/data/lotDetailContent";
import { projectsDetails } from "@/data/projectsDetailContents";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Separator } from "@workspace/ui/components/separator";
import { useSearchParams } from 'next/navigation';
import { useBuyerAmortizationsQuery } from "@/components/api/buyerApi";
import PropertyGrid from "@/components/Property/PropertyGrid";
import { Search } from "lucide-react";
import { Input } from "@workspace/ui/components/input";


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
    <div className="flex-1 sm:p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
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
          
          Search Bar
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full text-xs sm:text-sm"
            />
          </div>
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
            <TabsTrigger value="all" className="capitalize text-[11px] sm:text-sm px-2 sm:px-3">All</TabsTrigger>
            <TabsTrigger value="ongoing" className="capitalize text-[11px] sm:text-sm px-2 sm:px-3">Ongoing</TabsTrigger>
            <TabsTrigger value="fullyPaid" className="capitalize text-[11px] sm:text-sm px-2 sm:px-3">Fully Paid</TabsTrigger>
            </TabsList>
          </div>

          <Separator className="my-4" />

          {/* Lots Grid */}
          <TabsContent value="all" className="mt-0 space-y-4">
            <PropertyGrid lots={amortizations} />
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



