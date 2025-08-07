"use client";
import { useBuyerAmortizationsQuery } from "@/components/api/buyerApi";
import { Card, CardContent } from "@workspace/ui/components/card";
import { LandPlot, PhilippinePeso } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LotSummaryCard() {

    const{data: amortizations} = useBuyerAmortizationsQuery()
    const [fullyPaidLots, setFullyPaidLots] = useState<number>(0);
    const [totalTCP, setTotalTCP] = useState<number>(0);
    const [totalPaid, setTotalPaid] = useState<number>(0);

    useEffect(() => {
      let tempPaidLots = 0;
      if (amortizations && amortizations.length > 0) {
        tempPaidLots = amortizations.filter((item:any) => item.total_paid_percent >= 100).length;
        setFullyPaidLots(tempPaidLots);
        setTotalTCP(amortizations.reduce((acc:any, item:any) => {
          if (item.tcp) {
            return acc + item.tcp;
          }
          return acc;
        },0))
        setTotalPaid(amortizations.reduce((acc:any, item:any) => {
          if (item.total_paid) {
            return acc + item.total_paid;
          }
          return acc;
        },0))
      }
    },[amortizations])

    return (
        <>
            {/* Lots Purchased Card */}
            <Link href = "/lots" prefetch={false}>
              <Card
                className="cursor-pointer transition-colors hover:bg-gray-100 rounded-lg">
                <CardContent className="flex items-center justify-between py-1 px-2 sm:px-3">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="p-1 border rounded-lg border-gray-200">
                    <LandPlot className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-blue-600">
                        {amortizations && amortizations.length ? amortizations.length : 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Properties Reserved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            {/* Fully Paid Lots Card */}
            <Link href="/lots?tab=fullyPaid" prefetch={false}>
              <Card className="cursor-pointer transition-colors hover:bg-gray-100 rounded-lg">
                <CardContent className="flex items-center justify-between py-1 px-2 sm:px-3">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="p-1 border rounded-lg border-gray-200">
                    <LandPlot className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-base font-semibold text-blue-600">
                        {fullyPaidLots}
                      </p>
                      <p className="text-xs text-muted-foreground">Fully Paid Properties</p>
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
                  ₱ {(totalTCP ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground">Total TCP</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Total Payment Card */}
            <Card className="h-auto">
              <CardContent className="flex items-center justify-between py-1 px-2 sm:px-3">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="p-1 border rounded-lg border-gray-200">
                  <PhilippinePeso className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-green-600">
                      ₱ {(totalPaid ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Payment Made</p>
                  </div>
                </div>
              </CardContent>
            </Card>
        </>
    )
}