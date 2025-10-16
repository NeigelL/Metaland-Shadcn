"use client";
import { useBuyerLotsQuery } from "@/components/api/buyerApi";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import Loader from "@workspace/ui/components/loader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
import { formatDateClient } from "@workspace/ui/lib/utils";
import { differenceInDays, differenceInMonths, differenceInWeeks } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DueDates() {

  const today = new Date();
  const {data: lotsData, isLoading, isSuccess} = useBuyerLotsQuery();
  const [delayedLots , setDelayedLots ]= useState<any>([])
  const router = useRouter();
  useEffect(() => {
    let tempDelayedLots:any = [];
    for(let i = 0; i < lotsData?.length; i++) {
        let lot:any = lotsData[i];
        let d:any = lot?.delayed.map((item:any) =>{
            return {
                ...lot,
                _id: lot._id,
                lot: lot.lot_id?.name || "No Lot",
                block: lot.block_id?.name || "No Block",
                date: item.due_date,
                amount: item.amount.toFixed(2),
                project: lot.project_id?.name || "No Project",
            }
        })
        if(d) {
        tempDelayedLots.push(...d)
        }
    }
    setDelayedLots(tempDelayedLots);
  },[isSuccess])

  const getTimeAgoLabel = (date: string) => {
    const lotDate = new Date(date);
    const daysDiff = differenceInDays(today, lotDate);
    if (daysDiff < 7) return `${daysDiff} days ago`;
    if (daysDiff < 30) return `${differenceInWeeks(today, lotDate)} weeks ago`;
    return `${differenceInMonths(today, lotDate)} months ago`;
  };

    return (
        <>
        { isLoading && <div className="w-full justify-center h-24"><Loader/></div>}
        { delayedLots && delayedLots.length > 0 && <Card className="w-full max-h-96 overflow-scroll">
            <CardHeader>
                <CardTitle className="text-base sm:text-lg">Due Dates</CardTitle>
            </CardHeader>
            <CardContent>
                {delayedLots.length > 0 ? (
                <>
                    {/* Mobile Card View: visible on small screens only */}
                    <div className="block lg:hidden space-y-3">
                    {delayedLots.map((lot:any, index:any) => {
                        console.log(lot)

                    const timeAgo =  ` (${getTimeAgoLabel(lot.date)})`;

                        return (
                            <Card
                            key={index}
                            className="p-3 shadow-sm border rounded-md gap-1"
                            onClick={
                                () => {
                                    router.push(`/amortizations/${lot._id}`);
                                }
                            }
                            >
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-sm truncate">{lot.project}</span>
                                <span className={`text-sm font-medium tabular-nums text-destructive`}>
                                ₱{parseFloat(lot.amount).toLocaleString()}
                                </span>
                            </div>
                            <div className="text-sm text-muted-foreground truncate">Lot: {lot.lot}</div>
                            <div className="text-sm text-muted-foreground truncate">{[lot.block ,lot.lot].join(" ")}</div>
                            <div className="text-sm flex items-center text-muted-foreground">
                                <span>{formatDateClient(lot.date)}</span>
                                {<span className="ml-2 text-xs italic">{timeAgo}</span>}
                            </div>
                            </Card>
                        );
                        })}
                    </div>

                    {/* Desktop Table View: visible on lg+ screens */}
                    <div className="hidden lg:block rounded-md border overflow-auto max-h-[400px]">
                    <Table className="w-full">
                        <TableHeader className="sticky top-0 bg-background">
                        <TableRow>
                            <TableHead className="text-xs sm:text-sm">Project</TableHead>
                            <TableHead className="text-xs sm:text-sm">Lot</TableHead>
                            <TableHead className="text-xs sm:text-sm">Due Date</TableHead>
                            <TableHead className="text-xs sm:text-sm text-right pr-4">Amount</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {delayedLots.map((lot:any, index:any) => {
                            const timeAgo = ` (${getTimeAgoLabel(lot.date)})`;

                            return (
                                <TableRow
                                key={index}
                                className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors cursor-pointer"
                                 onClick={
                                    () => {
                                        router.push(`/amortizations/${lot._id}`);
                                    }
                                }
                                >
                                <TableCell className="whitespace-nowrap text-xs sm:text-sm">{lot.project}</TableCell>
                                <TableCell className="text-xs sm:text-sm truncate">{lot.lot}</TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-center">
                                    <span className="truncate">{ formatDateClient(lot.date)}</span>
                                    <span className="text-[10px] text-muted-foreground sm:ml-2">{timeAgo}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-4 text-xs sm:text-sm">
                                    <div className="flex justify-end items-center">
                                    <span className={`mr-1 text-destructive`}>₱</span>
                                    <span className={`tabular-nums  text-destructive`}>
                                        {parseFloat(lot.amount).toLocaleString()}
                                    </span>
                                    </div>
                                </TableCell>
                                </TableRow>
                            );
                            })}
                        </TableBody>
                    </Table>
                    </div>
                </>
                ) : (
                <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
                    <p className="text-sm text-muted-foreground">No Due Dates</p>
                </div>
                )}
            </CardContent>
            </Card>
            }
        </>
    )
}