export interface LotsDetails {
  userName: string;
  totalTcp: number;
  totalLots: number;
  totalAmountPaid: number;
  fullyPaidLots: number;
  ongoingLots: number;
  upcomingDueDates: {
    lot: string;
    date: string;
    amount: string;
    project: string;
  }[];
  backlogs: {
    lot: string;
    date: string;
    amount: string;
    project: string;
  }[];
  allLots: {
    lotId?: number;
    project?: string;
    lot: string;
    tcp?: number;
    status?: string;
    dueDate?: string;
    dueAmount?: string;
    reservation?: string;
    lotType?: string;
    paid?: number;
    total?: number;
  }[];
}