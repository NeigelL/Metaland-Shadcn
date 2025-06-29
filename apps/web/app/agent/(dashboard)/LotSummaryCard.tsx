"use client";
import { useAgentEarliestQuery, useAgentSummaryAmortizationsQuery } from "@/components/api/agentApi";
import { useUserStore } from "@/stores/useUserStore";
import { Card, CardContent } from "@workspace/ui/components/card";
import { formatDecimal } from "@workspace/ui/lib/utils";
import { HandCoins, LandPlot, PhilippinePeso } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LotSummaryCard() {

    const {setParameters, parameters} = useUserStore()
    const {data: earliest = []} = useAgentEarliestQuery()

    const{data: summary = []} = useAgentSummaryAmortizationsQuery({
        start_date: parameters?.start_date ??  new Date( new Date().getFullYear() +"-01-01"),
        end_date: parameters?.end_date?? new Date(),
        group_by: "summary"
    })

    useEffect(() => {
      if(earliest[0]?.earliest_reservation_date)
      setParameters({
          min_date: new Date(earliest[0]?.earliest_reservation_date),
      })
    },[earliest])

    return (
        <>
            {/* Lots Purchased Card */}
            <Link href = "/lots">
              <Card
                className="cursor-pointer transition-colors hover:bg-gray-100 rounded-lg">
                <CardContent className="flex items-center justify-between py-1 px-2 sm:px-3">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="p-1 border rounded-lg border-gray-200">
                    <LandPlot className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-blue-600">
                        {summary[0]?.buyers_ids ? summary[0]?.buyers_ids?.length :  0}
                      </p>
                      <p className="text-xs text-muted-foreground">Total Clients</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            {/* Fully Paid Lots Card */}
            <Link href="/lots?tab=fullyPaid">
              <Card className="cursor-pointer transition-colors hover:bg-gray-100 rounded-lg">
                <CardContent className="flex items-center justify-between py-1 px-2 sm:px-3">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="p-1 border rounded-lg border-gray-200">
                    <LandPlot className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-base font-semibold text-blue-600">
                          {summary[0]?.total_lot_sold??  0}
                      </p>
                      <p className="text-xs text-muted-foreground">Total Lots Sold</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            {/* TCP Card */}
            <Card className="h-auto">
              <CardContent className="flex items-center justify-between py-1 px-2 sm:px-3">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="p-1 border rounded-lg border-gray-200">
                  <PhilippinePeso className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                  <p className="text-base font-semibold text-green-600">
                  {
                    formatDecimal(summary[0]?.total_sales ?? 0)
                  }
                  </p>
                  <p className="text-xs text-muted-foreground">Total Sales</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Total Payment Card */}
            {/* <Card className="h-auto">
              <CardContent className="flex items-center justify-between py-1 px-2 sm:px-3">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="p-1 border rounded-lg border-gray-200">
                  <PhilippinePeso className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-green-600">
                      ₱ {(totalPaid ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Commission</p>
                  </div>
                </div>
              </CardContent>
            </Card> */}
            {/* <Link href="/agentearnings?tab=incentives"> */}
              <Card className="shadow-md h-20 hover:bg-gray-50 transition-colors">
                <CardContent className="p-0">
                  <div className="flex items-center justify-start h-full ml-3">
                    <div className="bg-yellow-100 p-2 rounded-full">
                      <HandCoins className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-semibold text-yellow-600">{
                        [summary[0]?.total_rice_incentives ?? 0, summary[0]?.total_cash_incentives ? formatDecimal(summary[0]?.total_cash_incentives) : 0].join(" / ")
                        }</p>
                      <p className="text-xs text-muted-foreground">Total Rice & Cash Incentives</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* </Link> */}
        </>
    )
}