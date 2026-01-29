"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { PhilippinePeso } from "lucide-react"
import { useSalesManagerGoalsQuery } from "@/components/api/salesmanagerApi"
import { useRouter } from "next/navigation"
import Loader from "@workspace/ui/components/loader"
import { formatDecimal } from "@workspace/ui/lib/utils"

export function GoalClient() {

  const { data: goals, isSuccess } = useSalesManagerGoalsQuery()

  if (!isSuccess) {
    return <Loader />
  }

  return <> {isSuccess && <div className="flex-1 space-y-4 p-8 pt-6">
    <div className="flex items-center justify-between space-y-2">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="flex items-center space-x-2">
        <div className="hidden md:block">
        </div>
      </div>
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Sales Goal
          </CardTitle>
          <PhilippinePeso className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold"> {goals?.data?.sales_target}/50</div>
          <p className="text-xs text-muted-foreground">
            {formatDecimal(goals?.data?.sales_total_tcp)}
          </p>
        </CardContent>
      </Card>
    </div>
  </div>}
  </>
}