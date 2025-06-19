
"use client";
import { useParams } from "next/navigation";
import { amortizationDataStore } from "@/data/amortization-data";
import { AmortizationTable } from "@/components/AmortizationSheetPage";
import { lotsDetails } from "@/data/lotDetailContent";
import { useMemo } from "react";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@workspace/ui/components/tabs";
import { useBuyerAmortizationQuery } from "@/components/api/buyerApi";


// import { SOAStatement } from "@/models/SOA";
// import { buyerProfiles } from "@/data/buyerProfileData";
// import CompactTaggingCard from "@/components/TaggingWithDescription";

interface Schedule {
  ma: string;
  dueDate: string;
  dueTag: string;
  dueAmount: string;
  datePaid: string;
  invoice: string;
  amountPaid: string;
  amountTag: string;
  runningBalance: string;
  mode: string;
}

const calculateTotalAmountPaid = (schedules: Schedule[]) => {
  let totalPaid = 0;
  schedules.forEach((schedule) => {
    if (!schedule.amountPaid) return;
    const amountStr = schedule.amountPaid.replace("₱", "").replace(/,/g, "").trim();
    const amount = parseFloat(amountStr);
    if (!isNaN(amount)) {
      totalPaid += amount;
    }
  });
  return totalPaid;
};

const getFormattedBalance = (tcp: number, payment: number): string => {
  const balance = tcp - payment;
  return `₱ ${balance.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export default function PageClient({amortization_id}: { amortization_id: any }) {

  const {data: amortization} = useBuyerAmortizationQuery(amortization_id);

  if( !amortization) {
    return "Loading...";
  }
  const balance = getFormattedBalance(amortization.tcp, amortization.total_paid);

  const formattedTotalPayment = `₱ ${amortization.total_paid.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  const fields = [
    { label: "Project", value: amortization.project_id.name },
    { label: "Lot", value: amortization.lot_id.name },
    { label: "Area & Price", value: [amortization.area + "sqm", amortization.price_per_sqm ].join(" / ") },
    { label: "Agent", value: amortization?.agent_id?.first_name },
    { label: "Realty", value: amortization?.realty_id?.name },
    { label: "Discount", value: amortization.discount },
    { label: "Down Payment", value: amortization.down_payment },
    { label: "Reservation", value: amortization.reservation },
    { label: "Total Contract Price", value: `₱ ${amortization.tcp.toLocaleString()}` },
    { label: "Total Payment", value: formattedTotalPayment },
    { label: "Balance", value: balance },
  ];

  // const buyer = buyerProfiles.find(
  //   (b) => b.name === selectedData.userName || b.fullName === selectedData.userName
  // );
  

  // if (!buyer) return <p>No buyer found for this lot.</p>;

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-full mx-auto space-y-4 sm:space-y-6 p-3 sm:p-6">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        <div>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">Amortization Details</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          Payment schedule and history for <strong>{amortization.lot_id?.name}</strong> in <strong>{amortization.project_id?.name}</strong>
        </p>
      </div>

        {/* Info Table - Responsive Fix */}
        <div className="w-full overflow-x-auto border rounded-xl ">
        <div className="p-4 bg-gray-100 border-b border-gray-200">
          <h2 className="text-base sm:text-lg justify-center item-center">LOT # : <strong>{amortization.reference_code}</strong></h2>
        </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {fields.map((field, index) => (
                <div
                  key={index}
                  className={`flex flex-col sm:flex-row sm:justify-between sm:items-center border-b sm:border-r border-gray-200 last:border-b-0 sm:last:border-r-0 lg:[&:nth-child(3n)]:border-r-0 p-3 sm:p-2 text-sm ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                  }`}
                >
                  <span className="font-semibold text-xs sm:text-sm mb-1 sm:mb-0">
                    {field.label}
                  </span>
                  <span className="text-muted-foreground text-xs sm:text-sm text-left sm:text-right break-words text-wrap">
                    {field.value}
                  </span>
                </div>
              ))}
            </div>
        </div>
        {/* <CompactTaggingCard
        lotId={String(lotId)}
        currentUser=""
      /> */}
        {/* Tabs */}
        <Tabs defaultValue="amortization">
        <div className="w-full sm:overflow-visible overflow-x-auto">
        <TabsList className="flex sm:grid sm:grid-cols-2 min-w-max sm:min-w-0 w-fit sm:w-full h-auto space-x-2 sm:space-x-0">
        <TabsTrigger
          value="amortization"
          className="py-1 sm:py-1 text-xs sm:text-sm whitespace-nowrap"
        >
          Amortization Sheet
        </TabsTrigger>
        {/* <TabsTrigger
          value="soa"
          className="py-1 sm:py-1 text-xs sm:text-sm whitespace-nowrap"
        >
          SOA
        </TabsTrigger> */}
        </TabsList>
      </div>

          <TabsContent value="amortization" className="mt-4 sm:mt-6 px-0 sm:px-1">
            <div className="space-y-4">
              <h1 className="text-base sm:text-lg lg:text-xl font-bold mb-4">Amortization Sheet</h1>
              <div className="overflow-x-auto">
                <AmortizationTable
                  schedules={amortization.summary}
                />
              </div>
            </div>
          </TabsContent>
{/*
          <TabsContent value="soa" className="w-full mt-4 sm:mt-6 px-0 sm:px-1">
            <div className="space-y-4">
              <h1 className="text-base sm:text-lg lg:text-xl font-bold mb-4">Statement of Account</h1>
              <div className="overflow-x-auto">
                <SOAStatement
                  amortization={selectedData}
                  buyer={buyer}
                  balance={balance}
                  lotId={selectedData.lotId}
                />
              </div>
            </div>
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
}
