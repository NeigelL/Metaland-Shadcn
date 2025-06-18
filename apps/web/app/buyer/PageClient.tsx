"use client"
import { NotificationButton } from "@/components/Buyer/NotificationButton";
import BackLogAlert from "@/components/BackLogAlert";
import { useSession } from "next-auth/react";
import AvatarUser from "./(dashboard)/AvatarUser";
import LotSummaryCard from "./(dashboard)/LotSummaryCard";
import PaymentChartSummary from "./(dashboard)/PaymentSummary";
import DueDates from "./(dashboard)/DueDates";
import { useEffect, useState } from "react";
import { LotsDetails } from "@/types/lot-details";
import { totalAmountPaid } from "@/data/amortization-data";
import { lotsDetails as initialLotsDetails } from "@/data/lotDetailContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";
import { Badge, FileText, MapPinIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@workspace/ui/components/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import ScheduleVisit from "./(dashboard)/ScheduleVisit";
import RequiredDocuments from "./(dashboard)/RequiredDocuments";


export function PageClient() {
    const {data: user } = useSession();
    const [searchQuery, setSearchQuery] = useState("");
    const [lotsDetails, setLotsDetails] = useState<LotsDetails>();
    const [paymentProgress, setPaymentProgress] = useState(0);
    const [balanceRemaining, setBalanceRemaining] = useState(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);


    useEffect(() => {
    const updatedLotsDetails:any = { ...initialLotsDetails, totalAmountPaid: totalAmountPaid };

    updatedLotsDetails.totalAmountPaid = totalAmountPaid;

    // Ensure all required properties exist
    if (!updatedLotsDetails.totalTcp) {
      updatedLotsDetails.totalTcp = 0;  // Default to 0 if undefined
    }
    if (!updatedLotsDetails.totalAmountPaid) {
      updatedLotsDetails.totalAmountPaid = 0;  // Default to 0 if undefined
    }
    
    // If there is no allLots, create simulated lots
    if (!updatedLotsDetails.allLots || updatedLotsDetails.allLots.length === 0) {
      const simulatedAllLots = [];
      
      // Create fully paid lots
      for (let i = 1; i <= updatedLotsDetails.fullyPaidLots; i++) {
        const tcp = Math.floor(Math.random() * 500000) + 500000;
        simulatedAllLots.push({
          lotId: i,
          project: 'Metaland Project',
          lot: `Lot-FP-${i.toString().padStart(3, '0')}`,
          tcp: tcp,
          status: 'Fully Paid',
          dueDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Random future date
          dueAmount: '0', // Fully paid, so no due amount
          reservation: `RES-${Date.now()}-${i}`,
          lotType: 'Residential'
        });
      }
    
      // Create ongoing lots
      for (let i = 1; i <= updatedLotsDetails.ongoingLots; i++) {
        const tcp = Math.floor(Math.random() * 500000) + 500000;
        const paid = Math.floor(Math.random() * 300000);
        simulatedAllLots.push({
          lotId: updatedLotsDetails.fullyPaidLots + i,
          project: 'Metaland Project',
          lot: `Lot-OG-${i.toString().padStart(3, '0')}`,
          tcp: tcp,
          status: 'Ongoing',
          dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Random date within 30 days
          dueAmount: (tcp - paid).toString(),
          reservation: `RES-${Date.now()}-${updatedLotsDetails.fullyPaidLots + i}`,
          lotType: 'Residential'
        });
      }
    
      updatedLotsDetails.allLots = simulatedAllLots;
    }
    
    // Update the lotsDetails state
    setLotsDetails(updatedLotsDetails);
    
    // Calculate remaining balance and progress
    const remaining = updatedLotsDetails.totalTcp - totalAmountPaid;
    setBalanceRemaining(remaining > 0 ? remaining : 0);
    
    // Calculate payment progress (percentage)
    const paymentProgress = (totalAmountPaid / updatedLotsDetails.totalTcp) * 100;
    setPaymentProgress(paymentProgress);
    
  }, []);

    return (
        <>
     <BackLogAlert backlogs={[]} />
      <NotificationButton/>
      <div className="flex flex-col lg:flex-row gap-4 min-h-screen">
        <div className="w-full lg:w-64 space-y-3 flex-shrink-0">
           {/* Pie Chart Card */}
           <AvatarUser/>

          {/* Stats Cards - 2x2 Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            <LotSummaryCard/>
          </div>

        </div>

        <div className="flex-1 h-110">
            <div className="mt-4 mb-4">
                  {lotsDetails && <DueDates lotsDetails={lotsDetails} searchQuery="" />}
            </div>
            <div className="rounded-lg border border-gray-200 shadow">
              <PaymentChartSummary/>
            </div>
            <h3 className="text-sm font-medium mb-4 p-4">Payment Methods</h3>
            <Tabs defaultValue="credit-card" className="w-full h-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="credit-card">Unionbank</TabsTrigger>
                <TabsTrigger value="cash">Cash</TabsTrigger>
              </TabsList>

              <div className="h-250px">
                <TabsContent value="credit-card" className="mt-2 h-full">
                  <Card className="border shadow-sm h-full">
                    <CardContent className="p-4 h-full">
                      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
                        <div className="lg:col-span-5">
                          <div className="p-4 bg-muted rounded-md">
                            <img
                              src="/images/unionbank.svg"
                              alt="UnionBank Logo"
                              className="h-6 mb-3"
                            />
                            <p className="mb-1 text-xs text-muted-foreground">Account Name:</p>
                            <p className="text-xs font-medium mb-3">Metaland Properties Inc.</p>
                            <p className="mb-1 text-xs text-muted-foreground">Account Number:</p>
                            <p className="text-xs font-medium">00-322-000023-8</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 w-full max-w-xs">
                          <Label htmlFor="qr-code" className="text-xs">Scan QR Code</Label>
                          <Button
                            id="qr-code"
                            size="sm"
                            className="h-8 px-4 text-xs w-full"
                            onClick={ () =>  setIsDialogOpen(true) }
                          >
                            Open
                          </Button>
                          
                          <p className="text-xs text-muted-foreground mt-2">
                            Please include your reservation ID in the payment reference.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="cash" className="mt-2 h-250px">
                  <Card className="border shadow-sm h-full">
                    <CardContent className="p-4 h-full">
                      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
                        <div className="lg:col-span-5">
                          <div className="p-4 bg-muted rounded-md">
                            <img
                              src="/images/logo-nobackground.svg"
                              alt="Metaland Logo"
                              className="h-6 mb-3"
                            />
                            <p className="mb-2 text-sm font-medium">Cash Payment Instructions</p>
                            <p className="mb-1 text-xs text-muted-foreground">Visit our office at:</p>
                            <p className="text-xs font-medium mb-2">36C, Cebu Exchange Tower, Salinas Drive Lahug, Cebu City, 6000</p>
                            <p className="mb-1 text-xs text-muted-foreground">Hours:</p>
                            <p className="text-xs font-medium mb-2">9:00 AM - 6:00 PM, Mon-Sat</p>
                            <p className="text-xs text-muted-foreground">Please bring a valid ID for verification</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label className="text-xs">Office Location</Label>
                          <div className="bg-muted rounded-md h-32 flex items-center justify-center">
                            <MapPinIcon className="h-6 w-6 text-muted-foreground" />
                            <span className="text-xs ml-2">Map Preview</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
        </div>

        {/* Right Column - Payment Methods */}
        <div className="w-full lg:w-80 flex-shrink-0">
        {/* Stack the scheduling cards vertically */}
              <div className="flex flex-col gap-4">
                <ScheduleVisit/>
                <RequiredDocuments/>
              </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Scan QR Code</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center items-center">
              <img
                src="/images/qr-code.png"
                alt="QR Code"
                className="w-64 h-64"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>)
}