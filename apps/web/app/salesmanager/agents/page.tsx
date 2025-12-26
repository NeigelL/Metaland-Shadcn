"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
import { Badge } from "@workspace/ui/components/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@workspace/ui/components/dialog";
import { Plus, UserCheck, UserX, Clock } from "lucide-react";

const initialAgents = [
    { id: "1", name: "Sarah Williams", email: "sarah.w@example.com", phone: "+63 917 123 4567", status: "Active", sales: 12 },
    { id: "2", name: "Mike Johnson", email: "mike.j@example.com", phone: "+63 918 765 4321", status: "Active", sales: 8 },
    { id: "3", name: "Emily Brown", email: "emily.b@example.com", phone: "+63 919 555 1212", status: "Inactive", sales: 0 },
];

const initialRequests = [
    { id: "req-1", name: "John Doe", email: "john.d@example.com", status: "Pending", date: "2024-05-10" }
];

export default function AgentsPage() {
    const [agents, setAgents] = useState(initialAgents);
    const [requests, setRequests] = useState(initialRequests);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newAgent, setNewAgent] = useState({ name: "", email: "", phone: "" });

    const handleRequestAgent = (e: React.FormEvent) => {
        e.preventDefault();
        const req: any = {
            id: `req-${Date.now()}`,
            name: newAgent.name,
            email: newAgent.email,
            status: "Pending",
            date: new Date().toISOString().split('T')[0]
        };
        setRequests([req, ...requests]);
        setIsAddOpen(false);
        setNewAgent({ name: "", email: "", phone: "" });
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            COMING SOON
            {/* <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Agent Management</h2>
                    <p className="text-muted-foreground">Manage your sales team and agent requests.</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Add New Agent</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Request New Agent</DialogTitle>
                            <DialogDescription>
                                Submit a request to add a new agent to your team. Office staff will review and approve.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleRequestAgent} className="space-y-4 py-4">
                            <div className="grid gap-2">
                                <Label>Full Name</Label>
                                <Input value={newAgent.name} onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })} required placeholder="Agent Name" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Email</Label>
                                <Input value={newAgent.email} onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })} required type="email" placeholder="agent@example.com" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Phone</Label>
                                <Input value={newAgent.phone} onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })} placeholder="Mobile Number" />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Submit Request</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-2 md:col-span-1 lg:col-span-2 xl:col-span-1">
                    <CardHeader>
                        <CardTitle>My Agents</CardTitle>
                        <CardDescription>List of active agents under your team.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Sales</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {agents.map((agent) => (
                                    <TableRow key={agent.id}>
                                        <TableCell className="font-medium">{agent.name}</TableCell>
                                        <TableCell>
                                            <div className="text-xs">{agent.email}</div>
                                            <div className="text-xs text-muted-foreground">{agent.phone}</div>
                                        </TableCell>
                                        <TableCell>{agent.sales}</TableCell>
                                        <TableCell>
                                            <Badge variant={agent.status === 'Active' ? 'default' : 'secondary'}>
                                                {agent.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="col-span-2 md:col-span-1 lg:col-span-2 xl:col-span-1">
                    <CardHeader>
                        <CardTitle>Request Status</CardTitle>
                        <CardDescription>Status of your requests to add new agents.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {requests.map(req => (
                                <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <p className="font-medium">{req.name}</p>
                                        <p className="text-sm text-muted-foreground">{req.email} • {req.date}</p>
                                    </div>
                                    <div className="flex items-center">
                                        {req.status === 'Pending' && <Clock className="h-4 w-4 text-yellow-500 mr-2" />}
                                        {req.status === 'Approved' && <UserCheck className="h-4 w-4 text-green-500 mr-2" />}
                                        <span className="text-sm font-semibold">{req.status}</span>
                                    </div>
                                </div>
                            ))}
                            {requests.length === 0 && <p className="text-sm text-muted-foreground">No pending requests.</p>}
                        </div>
                    </CardContent>
                </Card>
            </div> */}
        </div>
    );
}
