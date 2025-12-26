"use client"

import { useSalesManagerProjectsQuery } from "@/components/api/salesmanagerApi"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import Loader from "@workspace/ui/components/loader"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

// const data = [
//   {
//     name: "Jan",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Feb",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Mar",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Apr",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "May",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Jun",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
// ]

// const projects = [
//   {
//     name: "Metaland Heights",
//     totalLots: 165,
//     totalBlocks: 12,
//     totalSold: 120,
//     totalAvailable: 45,
//   },
//   {
//     name: "Sunnyvale Estates",
//     totalLots: 197,
//     totalBlocks: 15,
//     totalSold: 85,
//     totalAvailable: 112,
//   },
//   {
//     name: "Urban Loft Towers",
//     totalLots: 40,
//     totalBlocks: 2,
//     totalSold: 32,
//     totalAvailable: 8,
//   },
//   {
//     name: "Lakeside Villas",
//     totalLots: 60,
//     totalBlocks: 5,
//     totalSold: 10,
//     totalAvailable: 50,
//   },
// ]

export function PageClient() {

  const { data, isSuccess } = useSalesManagerProjectsQuery()

  return <>  <div className="flex-1 space-y-4 p-8 pt-6">
    <div className="grid gap-4 md:grid-cols-1">
      <Card>
        <CardHeader>
          <CardTitle>Project Status</CardTitle>
          <CardDescription>
            Overview of project inventory and sales status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead className="text-right">Blocks</TableHead>
                <TableHead className="text-right">Lots</TableHead>
                <TableHead className="text-right">Sold</TableHead>
                <TableHead className="text-right">Available</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isSuccess && <TableRow><TableCell colSpan={5}><Loader /></TableCell></TableRow>}
              {isSuccess && data?.map((project: any) => (
                <TableRow key={project.name} className="hover:bg-accent cursor-pointer">
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell className="text-right">{project.blocks}</TableCell>
                  <TableCell className="text-right">{project.lots}</TableCell>
                  <TableCell className="text-right">{project.sold}</TableCell>
                  <TableCell className="text-right">{project.available}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </div>
  </>
}