"use client";
import { useBuyerAmortizationsQuery } from '@/components/api/buyerApi';
import Loader from '@workspace/ui/components/loader';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts';
export default function PaymentChartSummary() {

  const{data: amortizations, isLoading} = useBuyerAmortizationsQuery()
  const [graphData, setGraphData] = useState<any>( [
    { name: "Paid", value: 0 },
    { name: "Remaining", value: 0 }
  ]);


  const COLORS = ["#4CAF50", "#F44336"];

    useEffect(() => {
    let tempPaidTotal = 0;
    let tempRemainingTotal = 0;
    if (amortizations && amortizations.length > 0) {
        tempPaidTotal = amortizations.reduce((acc:any, item:any) => {
            if (item.total_paid) {
                return acc + item.total_paid;
            }
            return acc;
        }, 0);
        tempRemainingTotal = amortizations.reduce((acc:any, item:any) => {
            if (item.tcp && item.total_paid) {
                return acc + (item.tcp - item.total_paid);
            }
            return acc;
        }, 0);
        setGraphData([
            { name: "Paid", value: tempPaidTotal },
            { name: "Remaining", value: tempRemainingTotal }
        ]);
    }
    },[amortizations])

    if(isLoading) return <div className="flex items-center justify-center h-24"><Loader/></div>

  return  <>{graphData.length > 0 && graphData[0].value > 0 && <div className="rounded-lg border border-gray-200 shadow">
        <div className="p-3 md:p-4 pb-0">
            <h3 className="text-base md:text-lg font-medium">Payment Progress</h3>
        </div>
        <div className="p-2 md:p-4 flex flex-col items-center">
            <div className="w-full h-40 md:h-48">
            <ResponsiveContainer className="w-100 h-100">
                <PieChart margin={{ top: 0, right: 0, bottom: 5, left: 0 }} >
                    <Pie
                        data={graphData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={60}
                        dataKey="value"
                        nameKey="name"
                    >
                        {graphData.map((entry:any, index:any) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value, name) => [`₱${Number(value).toLocaleString()}`, name]}
                        isAnimationActive={false}
                        contentStyle={{ fontSize: '10px', padding: '5px 8px' }}
                        itemStyle={{ fontSize: '12px' }}
                    />
                    <Legend
                        layout="horizontal"
                        align="center"
                        verticalAlign="bottom"
                        wrapperStyle={{ fontSize: '12px', paddingTop: '5px' }}
                        iconSize={8}
                        iconType="circle"
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
        <p className="text-center mt-1 text-xs md:text-sm font-medium">
            { graphData[0].value > 0 ? (graphData[0].value / ( graphData[0].value + graphData[1].value  ) * 100  ).toFixed(2) : 0  }% paid of total TCP
        </p>
        </div>
    </div>}</>
}