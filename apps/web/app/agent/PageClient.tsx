"use client"
import BackLogAlert from "@/components/BackLogAlert";
import AvatarUser from "../buyer/(dashboard)/AvatarUser";
import LotSummaryCard from "./(dashboard)/LotSummaryCard";
import SalesGraph from "./(dashboard)/SalesGraph";
import DueDates from "./(dashboard)/DueDates";

export function PageClient() {

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
            <div className="flex flex-wrap mt-2 mb-2">
              <DueDates/>
            </div>
            <SalesGraph/>

        </div>

        {/* Right Column - Payment Methods */}
        {/* <div className="w-full lg:w-80 flex-shrink-0"> */}
        {/* Stack the scheduling cards vertically */}
              {/* <div className="flex flex-col gap-4"> */}
                {/* <ScheduleVisit/> */}
                {/* <RequiredDocuments/> */}
              {/* </div> */}
        {/* </div> */}

      </div>
    </>)
}