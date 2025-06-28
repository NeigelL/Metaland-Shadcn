"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
import { useUploadedFilesStore } from "@/stores/useUploadedFilesStore";
import { formatDate } from "date-fns";
import { formatDecimal } from "@workspace/ui/lib/utils";
import FileGallery from "./Uploads/FileGallery";

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
  isTotal?: boolean;
  isOverdue?: boolean;
  mode: string;
}

interface AmortizationTableProps {
  schedules: any[];
}

export function AmortizationTable({ schedules }: AmortizationTableProps) {
  const addFiles = useUploadedFilesStore((state) => state.addFiles);

 console.dir(schedules)

  // Card view for mobile - matching your responsive pattern
  const CardView = () => (
    <div className="space-y-3 sm:space-y-4">
      {schedules.map((schedule, index) => {
        const shouldHighlight = !schedule.isPaid && schedule.due_date && schedule.isDelayed;
        
        return (
          <div
            key={`card-${index}`}
            className={`border rounded-xl overflow-hidden ${
              schedule.isTotal 
                ? "bg-gray-100 border-gray-300" 
                : "bg-white border-gray-200"
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {/* MA */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b sm:border-r border-gray-200 p-3 sm:p-2 text-sm bg-gray-50">
                <span className="font-semibold text-xs sm:text-sm mb-1 sm:mb-0">MA</span>
                <span className="text-muted-foreground text-xs sm:text-sm text-left sm:text-right">
                  {schedule.ma_label}
                </span>
              </div>
              
              {/* Due Date */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b sm:border-r border-gray-200 lg:border-r-0 p-3 sm:p-2 text-sm bg-gray-100">
                <span className="font-semibold text-xs sm:text-sm mb-1 sm:mb-0">Due Date</span>
                <span className={`text-xs sm:text-sm text-left sm:text-right break-words ${
                  shouldHighlight ? "text-red-600 font-semibold" : "text-muted-foreground"
                }`}>
                  { formatDate(schedule.due_date,"MMM dd yyyy") }
                   {/* {schedule.dueTag} */}
                </span>
              </div>
              
              {/* Due Amount */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b sm:border-r border-gray-200 p-3 sm:p-2 text-sm bg-gray-50">
                <span className="font-semibold text-xs sm:text-sm mb-1 sm:mb-0">Due Amount</span>
                <span className="text-muted-foreground text-xs sm:text-sm text-left sm:text-right break-words">
                  {formatDecimal(schedule.amount)}
                </span>
              </div>
              
              {/* Date Paid */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b sm:border-r border-gray-200 p-3 sm:p-2 text-sm bg-gray-100">
                <span className="font-semibold text-xs sm:text-sm mb-1 sm:mb-0">Date Paid</span>
                <span className="text-muted-foreground text-xs sm:text-sm text-left sm:text-right">
                  { schedule.payment_date_paid && formatDate(schedule.payment_date_paid,"MMM dd yyyy") || "-"}
                </span>
              </div>
              
              {/* Invoice */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b sm:border-r border-gray-200 lg:border-r-0 p-3 sm:p-2 text-sm bg-gray-50">
                <span className="font-semibold text-xs sm:text-sm mb-1 sm:mb-0">Invoice</span>
                <span className="text-muted-foreground text-xs sm:text-sm text-left sm:text-right">
                  {schedule.payment_invoice_number || "-"}
                </span>
              </div>
              
              {/* Amount Paid */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b sm:border-r border-gray-200 p-3 sm:p-2 text-sm bg-gray-100">
                <span className="font-semibold text-xs sm:text-sm mb-1 sm:mb-0">Amount Paid</span>
                <div className="text-left sm:text-right">
                  <div className="text-muted-foreground text-xs sm:text-sm">
                    {schedule.payment_date_paid && formatDecimal(schedule.payment_amount) || "-"}
                  </div>
                  {
                  // schedule.amountTag 
                  // && (
                  //   <div className="text-[10px] text-gray-500">
                  //     [{schedule.amountTag} {schedule.mode}]
                  //   </div>
                  // )
                  }
                </div>
              </div>
              
              {/* Running Balance */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b sm:border-r border-gray-200 p-3 sm:p-2 text-sm bg-gray-50">
                <span className="font-semibold text-xs sm:text-sm mb-1 sm:mb-0">Running Balance</span>
                <span className="text-muted-foreground text-xs sm:text-sm text-left sm:text-right break-words">
                  { schedule.payment_date_paid && formatDecimal(schedule.payment_running_balance) || "-"}
                </span>
              </div>

               <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b sm:border-r border-gray-200 p-3 sm:p-2 text-sm bg-gray-50">
                <span className="font-semibold text-xs sm:text-sm mb-1 sm:mb-0">Receipts</span>
                <span className="text-muted-foreground text-xs sm:text-sm text-left sm:text-right break-words">
                  { schedule?.payment?._id && <div className="">
                      <FileGallery
                          options={{
                              folder: ["payments",schedule?.payment?._id].join("/"),
                              entityID: schedule?.payment?._id,
                              collection: "payments"
                          }}
                      />
                  </div>}
                </span>
              </div>

                 
              
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="w-full space-y-4">

      {/* Desktop: Always show table */}
      <div className="hidden sm:block">
        <div className="w-full overflow-x-auto border rounded-xl border-gray-200">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="text-xs text-gray-600 px-2 py-2">MA</TableHead>
                <TableHead className="text-xs text-gray-600 px-2 py-2">Due Date</TableHead>
                <TableHead className="text-xs text-gray-600 px-2 py-2">Due Amount</TableHead>
                <TableHead className="text-xs text-gray-600 px-2 py-2">Date Paid</TableHead>
                <TableHead className="text-xs text-gray-600 px-2 py-2">Invoice</TableHead>
                <TableHead className="text-xs text-gray-600 px-2 py-2">Amount Paid</TableHead>
                <TableHead className="text-xs text-gray-600 px-2 py-2">Running Balance</TableHead>
                <TableHead className="text-xs text-gray-600 px-2 py-2">Upload</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule, index) => {
                const rowId = `row-${index}`;
                const shouldHighlight = !schedule.payment_date_paid && schedule.due_date && schedule.isDelayed;

                return (
                  <TableRow
                    key={rowId}
                    className={`${
                      schedule.isTotal
                        ? "bg-gray-100 font-semibold"
                        : index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <TableCell className="px-2 py-2 text-xs text-muted-foreground">
                      {schedule.ma_label}
                    </TableCell>
                    <TableCell
                      className={`px-2 py-2 text-xs ${
                        shouldHighlight ? "text-red-600 font-semibold" : "text-muted-foreground"
                      }`}
                    >
                      { formatDate(schedule.due_date,"MMM dd yyyy") }
                      {/* {schedule.dueTag} */}
                    </TableCell>
                    <TableCell className="px-2 py-2 text-xs text-muted-foreground">
                      {formatDecimal(schedule.amount)}
                    </TableCell>
                    <TableCell className="px-2 py-2 text-xs text-muted-foreground">
                      { schedule.payment_date_paid && formatDate(schedule.payment_date_paid,"MMM dd yyyy") || "-"}
                    </TableCell>
                    <TableCell className="px-2 py-2 text-xs text-muted-foreground">
                      {schedule.payment_invoice_number || "-"}
                    </TableCell>
                    <TableCell className="px-2 py-2 text-xs text-muted-foreground">
                      <div className="flex flex-col">
                        <span>{schedule.payment_date_paid && formatDecimal(schedule.payment_amount) || "-"}</span>
                        {/* {schedule.amountTag && (
                          <span className="text-[10px]">[{schedule.amountTag} {schedule.mode}]</span>
                        )} */}
                      </div>
                    </TableCell>
                    <TableCell className="px-2 py-2 text-xs text-muted-foreground">
                      { schedule.payment_date_paid && formatDecimal(schedule.payment_running_balance) || "-"}
                    </TableCell>
                    <TableCell className="px-2 py-2 text-xs text-muted-foreground">
                      { schedule?.payment?._id && <>
                      <FileGallery
                          options={{
                              folder: ["payments",schedule?.payment?._id].join("/"),
                              entityID: schedule?.payment?._id,
                              collection: "payments"
                          }}
                      />
                  </>}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile: Show card view automatically */}
      <div className="sm:hidden">
        <CardView />
      </div>
    </div>
  );
}