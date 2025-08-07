

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@workspace/ui/components/card';
import { useUserStore } from '@/stores/useUserStore';
import { CalendarIcon, BarChart2, User, LandPlot, HandCoins, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAgentSummaryAmortizationsQuery } from '@/components/api/agentApi';



type SaleLot = {
  id: string;
  lot: string;
  tcp: number;
};

type CustomTooltipPayload = {
    payload: {
      sales: number,
      month: string,
      count: number,
      lots: {
        id: string,
        lot: string,
        tcp: number,
      }[]
    }
}

type CustomTooltipProps = {
  active?: boolean;
  payload?: CustomTooltipPayload[];
  label?: string;
};

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(value).replace("PHP", "₱");
  };





export default function SalesGraph() {

    const {first_name, middle_name, last_name, setParameters} = useUserStore()
    const parameters = useUserStore((state) => state.parameters);
    const{data: summary = []} = useAgentSummaryAmortizationsQuery({
        start_date: parameters?.start_date ??  new Date( new Date().getFullYear() +"-01-01"),
        end_date: parameters?.end_date?? new Date(),
        group_by: "month"
    })

    const startDate = parameters?.start_date ?? new Date( new Date().getFullYear() +"-01-01");
    const currentDate = parameters?.end_date ?? new Date();

    const generateMonthLabels = (start: Date, end: Date): string[] => {
        const months: string[] = [];
        const current = new Date(start.getFullYear(), start.getMonth(), 1);
        while (current <= end) {
          const label = current.toLocaleDateString("en-US", { month: "short", year: "numeric" });
          months.push(label);
          current.setMonth(current.getMonth() + 1);
        }
        return months;
      };
    const monthLabels = generateMonthLabels(startDate, currentDate);
    const salesByMonth: Record<string, { totalSales: number; count: number; lots: SaleLot[] }> = {};
    monthLabels.forEach((label:any) => {
        salesByMonth[label] = { totalSales: 0, count: 0, lots: [] };
      });
    const chartData = monthLabels.map((month:any) => ({
        month,
        sales: summary.find( (summary:any) => summary._id === month  )?.total_sales ?? 0,
        count: summary.find( (summary:any) => summary._id === month )?.total_lot_sold ?? 0,
        lots: summary.find( (summary:any) => summary._id === month )?.amortizations ?? [],
      }));

    const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data:any = payload[0]?.payload;
      return (
        <div className="bg-white p-4 border rounded shadow-md text-xs">
          <p className="font-bold">{data.month}</p>
          <p className="text-green-600">Total: {formatCurrency(data.sales)}</p>
          <p className="text-gray-600">Lots Sold: {data.count}</p>
          <div className="mt-2">
            {data?.lots.map((lot: any, index: number) => (
              <div
                key={index}
                className="border-t pt-1 mt-1 first:border-t-0 first:pt-0 first:mt-0"
              >
                <p>
                  {lot?.project[0]?.name} - {[
                    lot?.block[0]?.name || "No Block",
                    lot?.lot[0]?.name || "No Lot"
                  ].join("-")
                  }
                </p>
                <p className="text-gray-600">{formatCurrency(lot.tcp)}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

    return (
        <>
        <Card className="shadow-md w-full h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm sm:text-base flex items-center">
                    <BarChart2 className="h-4 w-4 mr-2 text-green-500" />
                    Sales Performance
                  </CardTitle>
                  <div className="flex items-center mt-1 text-xs text-gray-600 mb-2">
                    <User className="h-3 w-3 mr-1" />
                    <span className="text-xs truncate">{[first_name,middle_name,last_name].join(" ")} </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 ml-4">
                        <input
                          type="date"
                          className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-green-400"
                          aria-label="Start date"
                          min={parameters?.min_date?.toISOString().slice(0, 10)}
                          value={parameters?.start_date ? parameters?.start_date?.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)}
                          onChange={
                            (e) => {
                              setParameters({
                                start_date: new Date(e.target.value)
                              })
                            }
                          }
                        />
                        <span className="mx-1">to</span>
                        <input
                          type="date"
                          className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-green-400"
                          aria-label="End date"
                          value={parameters?.end_date ? parameters?.end_date?.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)}
                          onChange={
                            (e) => {
                              setParameters({
                                end_date: new Date(e.target.value)
                              })
                            }
                          }
                        />
                      </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-48 sm:h-56 md:h-60 lg:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 5, left: 5, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 8 }}
                      tickLine={false}
                      axisLine={{ stroke: '#e5e7eb' }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fontSize: 8 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}K`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="sales"
                      fill="#3bf63b"
                      radius={[4, 4, 0, 0]}
                      name="Sales Value"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 border-t pt-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                </div>
              </div>
            </CardContent>
          </Card>
        </>
    )
}
