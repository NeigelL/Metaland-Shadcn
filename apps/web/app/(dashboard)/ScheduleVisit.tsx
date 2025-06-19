"use client";
import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

export default function ScheduleVisit() {
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(undefined);
    
    const [selectedReason, setSelectedReason] = useState("");
    const handleSelectChange = (value: string) => {
      setSelectedReason(value);
    };
    const [scheduledVisits, setScheduledVisits] = useState<{
    id: number;
    date: Date;
    reason: string;
  }[]>([]);
    const handleScheduleRequest = () => {
      if (!date || !selectedReason) return;
      
      // Create a new visit entry with both date and reason
      const newVisit = {
        id: Date.now(),
        date: date,
        reason: selectedReason
      };
      setScheduledVisits([...scheduledVisits, newVisit]);
      setDate(undefined);
      setSelectedReason("");
    };
    const clearScheduledVisits = () =>  {
      setScheduledVisits([]);
    };

   return (
    <>
        {/* Schedule a Visit Card (on top) */}
                <Card className="border shadow-sm w-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Schedule a Visit</CardTitle>
                  </CardHeader>

                  <CardContent className="text-xs text-muted-foreground space-y-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="visit-date" className="text-xs">Pick a Date</Label>
                      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full h-9 justify-start text-left font-normal text-xs"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                            {date ? format(date, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(newDate) => {
                              setDate(newDate);
                              setCalendarOpen(false);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="visit-time" className="text-xs">Reason</Label>
                      <Select onValueChange={handleSelectChange}  value={selectedReason}>
                        <SelectTrigger className="w-full h-9 text-xs">
                          <SelectValue placeholder="Select Reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Payment">Payment</SelectItem>
                          <SelectItem value="Reservation">Reservation</SelectItem>
                          <SelectItem value="Request">Document Requisition</SelectItem>
                          <SelectItem value="Request">Site Tour</SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      size="sm"
                      className="h-8 px-4 text-xs w-full"
                      onClick={handleScheduleRequest}
                      disabled={!date || !selectedReason}
                    >
                      Schedule Visit
                    </Button>
                  </CardContent>
                </Card>
                <Card className="border shadow-sm w-full">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Scheduled Visits</CardTitle>
                      </CardHeader>

                      <CardContent className="text-xs text-muted-foreground space-y-2 overflow-y-auto max-h-[150px]">
                        {scheduledVisits.length === 0 ? (
                          <p>No scheduled visits yet.</p>
                        ) : (
                          scheduledVisits.map((visit) => (
                            <div key={visit.id} className="p-2 border rounded">
                              <div>{format(visit.date, "PPP")}</div>
                              <div>{visit.reason}</div>
                            </div>
                          ))
                        )}
                      </CardContent>
              
                      <CardFooter>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs h-8"
                          onClick={clearScheduledVisits}
                          disabled={scheduledVisits.length === 0}
                        >
                          Clear All
                        </Button>
                      </CardFooter>
                </Card>
    </>
    )
}