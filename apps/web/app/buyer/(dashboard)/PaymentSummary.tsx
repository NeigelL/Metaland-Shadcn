"use client";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts';
export default function PaymentChartSummary() {

  const data = [
    { name: "Paid", value: 100 },
    { name: "Remaining", value: 200 }
  ];
  const COLORS = ["#4CAF50", "#F44336"];

  return (
    <>
        <div className="p-3 md:p-4 pb-0">
            <h3 className="text-base md:text-lg font-medium">Payment Progress</h3>
        </div>
        <div className="p-2 md:p-4 flex flex-col items-center">
            <div className="w-full h-40 md:h-48">
            <ResponsiveContainer className="w-100 h-100">
                <PieChart margin={{ top: 0, right: 0, bottom: 5, left: 0 }} >
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={60}
                        dataKey="value"
                        nameKey="name"
                    >
                        {data.map((entry, index) => (
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
            12% paid of total TCP
        </p>
        </div>
    </>
  );
}