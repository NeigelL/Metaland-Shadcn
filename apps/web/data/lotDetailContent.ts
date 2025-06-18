const lots = [
    { lotId: 1 ,project:"VERDANT ESTATE",lot: "BLK 4 / LOT 17", tcp: 130000.00, status: "ongoing", dueDate: "Jun 07 2025", dueAmount: "2166.67", reservation: "Dec 09 2024 ", lotType: "REGULAR LOT" },
    { lotId: 2 ,project:"BADIANG 2", lot: "BLK 1 / LOT 1", tcp: 141791.00, status: "ongoing", dueDate: "Mar 21 2024", dueAmount: "2363.18", reservation: "Dec 22 2023", lotType: "REGULAR LOT" },  
    { lotId: 3 ,project:"AISLEVIEW RESIDENCES",lot: "BLK 1 / LOT 2", tcp: 127790.00, status: "ongoing", dueDate: "Feb 20 2024", dueAmount: "2129.83", reservation: "Jan 03 2024", lotType: "REGULAR LOT"  },
    { lotId: 4 ,project:"DE MARSEILLE SUBDIVISION",lot: "BLK 5 / LOT 6", tcp: 135070.00, status: "ongoing", dueDate: "Apr 09 2025", dueAmount: "2276.67", reservation: "Nov 31 2024", lotType: "REGULAR LOT"  },
    { lotId: 5 ,project:"BADIANG 2",lot: "BLK 4 / LOT 1", tcp: 135000.00, status: "fully paid", dueDate: "", dueAmount: "", reservation: "Dec 22 2023", lotType: "REGULAR LOT"  },
    { lotId: 6 ,project:"BADIANG 1",lot: "BLK 1 / LOT 7", tcp: 230000.00, status: "fully paid", dueDate: "", dueAmount: "", reservation: "Nov 22 2024", lotType: "REGULAR LOT"  },
];

const totalLots = lots.length;
const totalTcp = lots.reduce((sum, lot) => sum + lot.tcp, 0);
const fullyPaidLots = lots.filter(lot => lot.status === "fully paid").length;
const ongoingLots = lots.filter(lot => lot.status === "ongoing").length;
const cancelledLots = lots.filter(lot => lot.status === "cancelled").length;
const allLots = lots;



const today = new Date();
today.setHours(0, 0, 0, 0);

const backlogs = lots
    .filter(lot => {
        const dueDate = new Date(lot.dueDate);
        return dueDate < today;
    })
    .map(lot => ({ project: lot.project, lot: lot.lot, date: lot.dueDate, amount: lot.dueAmount }));

const upcomingDueDates = lots
    .filter(lot => {
        const dueDate = new Date(lot.dueDate);
        return dueDate >= today;
    })
    .map(lot => ({ project: lot.project, lot: lot.lot, date: lot.dueDate, amount: lot.dueAmount }));



export const lotsDetails = {
    userName: "JOHN RAYMAR ROMARATE",
    lots,
    totalLots,
    totalTcp,
    fullyPaidLots,
    ongoingLots,
    upcomingDueDates,
    cancelledLots,
    backlogs,
    allLots
    
}

