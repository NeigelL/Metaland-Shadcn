"use client";

import { useState } from "react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog";

const notifications= [
  { id: 1, message: "Payment received for BADIANG 1 / BLK 4 / LOT 17", type: "success", date: "2025-04-28" },
  { id: 2, message: "BADIANG 2 Update", type: "info", date: "2025-04-28" },
  { id: 3, message: "Reminder: Payment is Overdue by 120 days for BADIANG 2 / BLK 4 / LOT 17", type: "warning", date: "2025-04-28" },
  { id: 4, message: "Reminder: Upcoming Payment for BADIANG 1 / BLK 4 / LOT 17", type: "warning", date: "2025-04-28" },
];

export function NotificationButton() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon">
            🔔
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-60 p-2 space-y-1">
          <h4 className="text-sm font-medium text-muted-foreground mb-1">
            Notifications
          </h4>

          <div className="space-y-1 text-sm">
            {notifications.slice(0, 3).map((notif, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-2 py-1 hover:bg-muted rounded"
              >
                <span className="truncate">{notif.message}</span>
                <Badge variant="outline" className="text-xs">
                  New
                </Badge>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t">
            <Button
              variant="ghost"
              className="w-full text-sm justify-center px-2 py-1 h-auto"
              onClick={() => setOpenDialog(true)}
            >
              See all notifications
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Full-screen Dialog for All Notifications */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-screen-md h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>All Notifications</DialogTitle>
            <DialogDescription>Recent activity updates</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            {notifications.map((notif, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-3 border rounded-md hover:bg-muted"
              >
                <span className="text-sm">{notif.message}</span>
                <span className="text-xs text-muted-foreground">
                  {notif.date}
                </span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
