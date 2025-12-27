"use client";

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
import { useRouter } from "next/navigation";


export default function ProjectsPage() {
    const { data, isSuccess } = useSalesManagerProjectsQuery()
    const router = useRouter()
    return (
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
                                <TableHead>Name</TableHead>
                                <TableHead className="text-right">Blocks</TableHead>
                                <TableHead className="text-right">Lots</TableHead>
                                <TableHead className="text-right">Sold</TableHead>
                                <TableHead className="text-right">Available</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!isSuccess && <TableRow><TableCell colSpan={5}><Loader /></TableCell></TableRow>}
                            {isSuccess && data?.map((project: any) => (
                                <TableRow key={project.name} className="hover:bg-accent cursor-pointer" onClick={
                                    () => {
                                        router.push(`/projects/${project._id}`)
                                    }
                                }>
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
    );
}
