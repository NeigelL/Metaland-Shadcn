"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@workspace/ui/components/accordion";
import { MapPin, DollarSign, Maximize2, CheckCircle, XCircle } from "lucide-react";
import LotMap from "@/components/GoogleMap/LotMap"; // Assuming this adapts or I'll fix it
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@workspace/ui/components/sheet";
import Link from "next/link";

// Dummy Data
const projectData = {
    id: "proj-1",
    name: "Metaland Heights",
    location: "Quezon City, Metro Manila",
    description: "Premier residential community featuring modern amenities and lush landscapes.",
    blocks: [
        {
            id: "block-1",
            name: "Block 1",
            lots: [
                { id: "lot-1-1", name: "Lot 1", area: 120, price: 1500000, status: "Available", lat: 14.6760, lng: 121.0437 },
                { id: "lot-1-2", name: "Lot 2", area: 150, price: 1800000, status: "Sold", lat: 14.6762, lng: 121.0439 },
                { id: "lot-3", name: "Lot 3", area: 120, price: 1500000, status: "Available", lat: 14.6763, lng: 121.0441 },
            ]
        },
        {
            id: "block-2",
            name: "Block 2",
            lots: [
                { id: "lot-2-1", name: "Lot 1", area: 200, price: 2500000, status: "Reserved", lat: 14.6750, lng: 121.0430 },
                { id: "lot-2-2", name: "Lot 2", area: 180, price: 2200000, status: "Available", lat: 14.6752, lng: 121.0432 },
            ]
        }
    ]
};

export default function ProjectDetailsPage() {
    const params = useParams();
    const [selectedLot, setSelectedLot] = useState<any>(null);
    const [isMapOpen, setIsMapOpen] = useState(false);

    // In a real app, fetch project by params.id
    const project = projectData;

    const handleLotClick = (lot: any) => {
        setSelectedLot(lot);
        setIsMapOpen(true);
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{project.name}</h2>
                    <div className="flex items-center text-muted-foreground mt-1">
                        <MapPin className="mr-1 h-4 w-4" />
                        {project.location}
                    </div>
                </div>
                <Button variant="outline" onClick={() => setIsMapOpen(true)}>
                    View Project Map
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Blocks & Lots</CardTitle>
                            <CardDescription>Select a lot to view details and reservation options.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                {project.blocks.map((block) => (
                                    <AccordionItem key={block.id} value={block.id}>
                                        <AccordionTrigger>{block.name}</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="grid gap-2">
                                                {block.lots.map((lot) => (
                                                    <div
                                                        key={lot.id}
                                                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                                                        onClick={() => handleLotClick(lot)}
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <div className={`w-3 h-3 rounded-full ${lot.status === 'Available' ? 'bg-green-500' :
                                                                lot.status === 'Sold' ? 'bg-red-500' : 'bg-yellow-500'
                                                                }`} />
                                                            <span className="font-medium">{lot.name}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-4 text-sm">
                                                            <span className="flex items-center text-muted-foreground">
                                                                <Maximize2 className="mr-1 h-3 w-3" /> {lot.area} sqm
                                                            </span>
                                                            <span className="font-semibold">
                                                                ₱{(lot.price / 1000000).toFixed(2)}M
                                                            </span>
                                                            <Badge variant={lot.status === 'Available' ? 'default' : 'secondary'}>
                                                                {lot.status}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total Blocks</span>
                                <span className="font-bold">{project.blocks.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total Lots</span>
                                <span className="font-bold">
                                    {project.blocks.reduce((acc, block) => acc + block.lots.length, 0)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Sheet open={isMapOpen} onOpenChange={setIsMapOpen}>
                <SheetContent className="sm:max-w-xl w-full">
                    <SheetHeader>
                        <SheetTitle>Lot Details & Location</SheetTitle>
                        <SheetDescription>
                            {selectedLot ? `Viewing details for ${selectedLot.name}` : "Select a lot to view details"}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="mt-6 space-y-6">
                        {selectedLot ? (
                            <>
                                <div className="aspect-video w-full bg-slate-100 rounded-md overflow-hidden relative">
                                    {/* Placeholder for Map - In real impl pass coords */}
                                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                        {/* We would render <LotMap /> here ideally */}
                                        <MapPin className="h-10 w-10 mb-2" />
                                        <span className="ml-2">Map View</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-xs text-muted-foreground uppercase">Price</span>
                                        <p className="text-xl font-bold">₱{selectedLot.price.toLocaleString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs text-muted-foreground uppercase">Area</span>
                                        <p className="text-xl font-bold">{selectedLot.area} sqm</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs text-muted-foreground uppercase">Status</span>
                                        <Badge variant={selectedLot.status === 'Available' ? 'default' : 'secondary'}>
                                            {selectedLot.status}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Promo / Discount Section */}
                                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                                    <h4 className="font-semibold text-blue-900 mb-2">Promos Available</h4>
                                    <ul className="text-sm text-blue-800 space-y-1 list-disc pl-4">
                                        <li>10% Discount for Spot Cash</li>
                                        <li>5% Discount for 50% Downpayment</li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <div className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-md">
                                Select a lot from the list
                            </div>
                        )}
                    </div>

                    <SheetFooter className="mt-8 sm:justify-between">
                        {selectedLot?.status === 'Available' && (
                            <Button className="w-full" asChild>
                                <Link href={`/salesmanager/reservations?lotId=${selectedLot.id}&projectId=${project.id}&price=${selectedLot.price}`}>
                                    Reserve Now
                                </Link>
                            </Button>
                        )}
                    </SheetFooter>
                </SheetContent>
            </Sheet>

        </div>
    );
}
