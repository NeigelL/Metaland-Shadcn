"use client";
import { LotsDetails } from "@/types/lot-details";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
import { differenceInDays, differenceInMonths, differenceInWeeks } from "date-fns";

export default function DueDates(
    { lotsDetails, searchQuery }: { lotsDetails: LotsDetails, searchQuery: string }
) {

const today = new Date();

  const allLots = [
    ...(lotsDetails?.upcomingDueDates ?? []),
    ...(lotsDetails?.backlogs ?? []),
  ];

  const filteredLots = allLots.filter(lot =>
    lot.lot.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lot.date.includes(searchQuery) ||
    lot.amount.includes(searchQuery) ||
    lot.project.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTimeAgoLabel = (date: string) => {
    const lotDate = new Date(date);
    const daysDiff = differenceInDays(today, lotDate);

    if (daysDiff < 7) return `${daysDiff} days ago`;
    if (daysDiff < 30) return `${differenceInWeeks(today, lotDate)} weeks ago`;
    return `${differenceInMonths(today, lotDate)} months ago`;
  };

    return (
        <>
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-base sm:text-lg">Due Dates</CardTitle>
            </CardHeader>
            <CardContent>
                {filteredLots.length > 0 ? (
                <>
                    {/* Mobile Card View: visible on small screens only */}
                    <div className="block lg:hidden space-y-3">
                    {[...filteredLots]
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((lot, index) => {
                        const isBacklog = lotsDetails?.backlogs?.some(
                            (b) => b.lot === lot.lot && b.date === lot.date
                        ) ?? false;
                        const timeAgo = isBacklog ? ` (${getTimeAgoLabel(lot.date)})` : "";

                        return (
                            <Card key={index} className="p-3 shadow-sm border rounded-md">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-sm truncate">{lot.project}</span>
                                <span className={`text-sm font-medium tabular-nums ${isBacklog ? 'text-destructive' : 'text-emerald-600'}`}>
                                ₱{parseFloat(lot.amount).toLocaleString()}
                                </span>
                            </div>
                            <div className="text-sm text-muted-foreground truncate">Lot: {lot.lot}</div>
                            <div className="text-sm flex items-center text-muted-foreground">
                                <span>{lot.date}</span>
                                {isBacklog && <span className="ml-2 text-xs italic">{timeAgo}</span>}
                            </div>
                            </Card>
                        );
                        })}
                    </div>

                    {/* Desktop Table View: visible on lg+ screens */}
                    <div className="hidden lg:block rounded-md border overflow-auto max-h-[400px]">
                    <Table className="w-full">
                        <TableHeader className="sticky top-0 bg-background z-10">
                        <TableRow>
                            <TableHead className="text-xs sm:text-sm">Project</TableHead>
                            <TableHead className="text-xs sm:text-sm">Lot</TableHead>
                            <TableHead className="text-xs sm:text-sm">Due Date</TableHead>
                            <TableHead className="text-xs sm:text-sm text-right pr-4">Amount</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {[...filteredLots]
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map((lot, index) => {
                            const isBacklog = lotsDetails?.backlogs?.some(
                                (b) => b.lot === lot.lot && b.date === lot.date
                            ) ?? false;
                            const timeAgo = isBacklog ? ` (${getTimeAgoLabel(lot.date)})` : "";

                            return (
                                <TableRow key={index}>
                                <TableCell className="whitespace-nowrap text-xs sm:text-sm">{lot.project}</TableCell>
                                <TableCell className="text-xs sm:text-sm truncate">{lot.lot}</TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-center">
                                    <span className="truncate">{lot.date}</span>
                                    {isBacklog && (
                                        <span className="text-[10px] text-muted-foreground sm:ml-2">{timeAgo}</span>
                                    )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-4 text-xs sm:text-sm">
                                    <div className="flex justify-end items-center">
                                    <span className={`mr-1 ${isBacklog ? "text-destructive" : "text-emerald-500"}`}>₱</span>
                                    <span className={`tabular-nums ${isBacklog ? "text-destructive" : "text-emerald-500"}`}>
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
        </>
    )
}