"use client";
import { LotsDetails } from "@/types/lot-details";
import { Card, CardContent } from "@workspace/ui/components/card";
import { LandPlot, PhilippinePeso } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LotSummaryCard() {
    const [lotsDetails, setLotsDetails] = useState<LotsDetails | null>(null);

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
                        {(lotsDetails?.totalLots ?? 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Properties Reserved</p>
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
                        {(lotsDetails?.fullyPaidLots ?? 0).toLocaleString()}
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
                  ₱ {(lotsDetails?.totalTcp ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
                      ₱ {(lotsDetails?.totalAmountPaid ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Payment Made</p>
                  </div>
                </div>
              </CardContent>
            </Card>
        </>
    )
}