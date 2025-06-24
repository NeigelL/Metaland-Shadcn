"use client"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@workspace/ui/components/dialog";
import RequiredDocuments from "./(dashboard)/RequiredDocuments";
import PaymentMethod from "./(dashboard)/PaymentMethod";


export function PageClient() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <>
     <BackLogAlert backlogs={[]} />
      {/* <NotificationButton/> */}
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
                  <DueDates/>
            </div>
            <div>
              <PaymentChartSummary/>
            </div>
            <div>
              <PaymentMethod setIsDialogOpen={setIsDialogOpen}/>
            </div>
        </div>

        {/* Right Column - Payment Methods */}
        {/* <div className="w-full lg:w-80 flex-shrink-0"> */}
        {/* Stack the scheduling cards vertically */}
              {/* <div className="flex flex-col gap-4"> */}
                {/* <ScheduleVisit/> */}
                {/* <RequiredDocuments/> */}
              {/* </div> */}
        {/* </div> */}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Scan QR Code</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center items-center">
              <img
                src="/images/qr-code.jpg"
                alt="QR Code"
                className="w-64 h-64"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>)
}